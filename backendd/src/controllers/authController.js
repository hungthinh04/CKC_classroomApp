const { pool, sql } = require('../config/db');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, matkhau } = req.body;
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM USERS WHERE Email = @email');

    const user = result.recordset[0];
    if (!user || user.MatKhau !== matkhau) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    const token = jwt.sign(
      { id: user.ID, role: user.Quyen },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ');
  }
};
