const { pool, sql } = require('../config/db');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, matkhau } = req.body;
  try {
    await pool.connect();

    // Kiểm tra thông tin đăng nhập
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM USERS WHERE Email = @email');

    const user = result.recordset[0];
    if (!user || user.MatKhau !== matkhau) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    if (user.Quyen !== 2) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.ID, role: user.Quyen },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Trả về token và thông tin người dùng
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ');
  }
};


exports.loginGiangVien = async (req, res) => {
  const { email, matKhau } = req.body;

  try {
    const result = await pool
      .request()
      .input("Email", sql.NVarChar(100), email)
      .input("MatKhau", sql.NVarChar(255), matKhau)
      .query("SELECT * FROM USERS WHERE Email = @Email AND MatKhau = @MatKhau AND Quyen = 1");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }

    const user = result.recordset[0];
    const token = jwt.sign({ id: user.ID, quyen: user.Quyen }, "SECRET", { expiresIn: "1d" });

    res.json({ accessToken: token, user });
  } catch (err) {
    console.error("Login GV error:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.loginSinhVien = async (req, res) => {
  const { email, matKhau } = req.body;

  try {
    const result = await pool
      .request()
      .input("Email", sql.NVarChar(100), email)
      .input("MatKhau", sql.NVarChar(255), matKhau)
      .query("SELECT * FROM USERS WHERE Email = @Email AND MatKhau = @MatKhau AND Quyen = 2");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }

    const user = result.recordset[0];
    const token = jwt.sign({ id: user.ID, quyen: user.Quyen }, "SECRET", { expiresIn: "1d" });

    res.json({ accessToken: token, user });
  } catch (err) {
    console.error("Login SV error:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};



exports.loginUser = async (req, res) => {
  const { email, matKhau } = req.body;

  if (!email || !matKhau ) {
    return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
  }

  try {
    const result = await pool
      .request()
      .input('Email', sql.NVarChar(100), email)
      .input('MatKhau', sql.NVarChar(255), matKhau)
      .query(`SELECT ID, Email, Quyen, MaNguoiDung FROM USERS WHERE Email = @Email AND MatKhau = @MatKhau AND TrangThai = 1`);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const user = result.recordset[0];

    if( user.Quyen === 2) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    const jwt = require("jsonwebtoken");
    res.status(200).json({
      user: {
        id: user.ID,
        email: user.Email,
        role: user.Quyen,
        maNguoiDung: user.MaNguoiDung
      },
      token: jwt.sign(
    { id: user.ID, role: user.Quyen },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  ),
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
