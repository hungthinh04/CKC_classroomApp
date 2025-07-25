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

exports.getAllKhoa = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM KHOA');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách khoa' });
  }
};



exports.addSinhVien = async (req, res) => {
  const { maTK, maLopHoc, hoTen } = req.body;

  try {
    // Thêm sinh viên vào bảng SINHVIEN
    await pool.request()
      .input('MaTK', sql.Int, maTK)
      .input('MaLopHoc', sql.Int, maLopHoc)
      .input('HoTen', sql.NVarChar, hoTen)
      .query(
        `INSERT INTO SINHVIEN (MaTK, MaLopHoc, HoTen)
         VALUES (@MaTK, @MaLopHoc, @HoTen)`
      );

    res.status(201).json({ message: 'Sinh viên đã được thêm' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể thêm sinh viên' });
  }
};


exports.addGiangVien = async (req, res) => {
  const { maTK, hoTen, maBM } = req.body;

try {
  // Thêm giảng viên vào bảng GIANGVIEN
  await pool.request()
    .input('MaTK', sql.Int, maTK)
    .input('HoTen', sql.NVarChar, hoTen)
    .input('MaBM', sql.Int, maBM)  // Đảm bảo bạn truyền giá trị maBM hợp lệ
    .query(
      `INSERT INTO GIANGVIEN (MaTK, HoTen, MaBM)
       VALUES (@MaTK, @HoTen, @MaBM)`
    );

  res.status(201).json({ message: 'Giảng viên đã được thêm' });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Không thể thêm giảng viên' });
}

};


exports.getMaSV = async (req, res) => {
  const  userId  = req.user.id;
  console.log(userId, "userId from");
  try {
    const result = await pool.request()
  .input('MaTK', sql.Int, userId)
  .query(`SELECT MaSinhVien FROM SINHVIEN WHERE MaTK = @MaTK`);

const maSV = result.recordset[0].MaSinhVien;
    if (!maSV) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

    res.json(maSV);
  } catch (err) {
    console.error("❌ Lỗi khi MaSV: ", err);
    res.status(500).json({ message: "Lỗi server khi lấy MaSV" });
  }
};