const { pool, sql } = require('../config/db');

module.exports = async (req, res, next) => {
  const userId = req.user.id;  // Lấy thông tin người dùng từ JWT

  try {
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT Quyen FROM USERS WHERE ID = @id');

    const user = result.recordset[0];
    if (!user || user.Quyen !== 2) {  // Kiểm tra quyền Admin (Quyen = 2)
      return res.status(403).json({ message: 'Bạn không có quyền Admin' });
    }

    next();  // Chỉ cho phép tiếp tục nếu người dùng là Admin
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi kiểm tra quyền' });
  }
};
