const { pool, sql } = require('../config/db');

module.exports = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT Quyen FROM USERS WHERE ID = @id');

    const user = result.recordset[0];
    if (!user || (user.Quyen !== 1 && user.Quyen !== 2)) {  // Giảng Viên (Quyen = 1) hoặc Admin (Quyen = 2)
      return res.status(403).json({ message: 'Bạn không có quyền Giảng Viên hoặc Admin' });
    }

    next();  // Tiếp tục nếu là Giảng Viên hoặc Admin
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi kiểm tra quyền' });
  }
};
