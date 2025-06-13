const { pool, sql } = require('../config/db');

exports.getMe = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT ID, MaNguoiDung, Email, Quyen, TrangThai FROM USERS WHERE ID = @id');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ');
  }
};
