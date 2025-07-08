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
exports.getProfile = async (req, res) => {
  const userId = req.user.id; // Lấy thông tin người dùng từ JWT token (middleware bảo vệ)

  try {
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .query("SELECT * FROM USERS WHERE ID = @id");

    const user = result.recordset[0];
    // console.log(user," user");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    res.status(200).json({
      id: user.ID,
      email: user.Email,
      role: user.Quyen,
      hoTen: user.HoTen,
      trangThai: user.TrangThai,
      sdt: user.SDT,
      diaChi: user.DiaChi,
      maGiangVien: user.MaGiangVien,
    });
    console.log(`Lấy thông tin người dùng: ${JSON.stringify(user)}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin tài khoản" });
  }
};

// Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
  const userId = req.user.id; // Lấy thông tin người dùng từ JWT token (middleware bảo vệ)
  const { email, hoTen, sdt, diaChi, matKhau } = req.body;

  try {
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .input("email", sql.VarChar, email)
      .input("hoTen", sql.NVarChar, hoTen)
      .input("sdt", sql.VarChar, sdt)
      .input("diaChi", sql.NVarChar, diaChi)
      .input("matKhau", sql.NVarChar, matKhau)
      .query(`
        UPDATE USERS
        SET Email = @email, HoTen = @hoTen, SDT = @sdt, DiaChi = @diaChi, MatKhau = @matKhau
        WHERE ID = @id
      `);

    res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin tài khoản" });
  }
};
