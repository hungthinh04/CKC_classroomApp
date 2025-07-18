const { pool, sql } = require("../config/db");


exports.getLopHocPhanBySinhVien = async (req, res) => {
  try {
    // 1. Lấy ID sinh viên dựa trên user đăng nhập
    const userId = req.user.id; // Đây là ID tài khoản USERS
    
    const resultSV = await pool.request()
      .input("userId", sql.Int, userId)
      .query("SELECT ID FROM SINHVIEN WHERE MaTK = @userId");
    
    if (!resultSV.recordset[0]) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    const maSV = resultSV.recordset[0].ID; // <-- Lấy ID (INT) của SINHVIEN
console.log("userId:", userId);
console.log("maSV:", maSV);

   const result = await pool.request()
  .input("MaSV", sql.Int, maSV)
  .query(`
    SELECT 
      lhp.ID,
      lhp.TenLHP,
      lhp.HocKy,
      lhp.NamHoc,
      gv.HoGV + ' ' + gv.TenGV AS TenGV,
      mh.TenMH,
      lh.MaLop
    FROM SINHVIEN_LHP svlhp
    JOIN LOPHOCPHAN lhp ON svlhp.MaLHP = lhp.ID
    LEFT JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
    LEFT JOIN MONHOC mh ON lhp.MaMH = mh.ID
    LEFT JOIN LOPHOC lh ON lhp.MaLH = lh.ID
    WHERE svlhp.MaSV = @MaSV AND lhp.TrangThai = 1
  `);


    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lớp học phần cho sinh viên" });
    }

    // 3. Gửi kết quả về frontend
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi lấy LHP sinh viên:", err);
    res.status(500).json({ message: "Không thể lấy lớp học phần sinh viên" });
  }
};

// adminController.js
exports.addStudentToLHP = async (req, res) => {
  const { studentId, lophocphanId } = req.body;
  try {
    // Kiểm tra xem sinh viên đã tham gia lớp học phần này chưa
    const existingEntry = await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .input("lophocphanId", sql.Int, lophocphanId)
      .query(
        "SELECT COUNT(*) as count FROM SINHVIEN_LHP WHERE MaSV = @studentId AND MaLHP = @lophocphanId"
      );

    if (existingEntry.recordset[0].count > 0) {
      return res.status(400).json({ message: "Sinh viên đã tham gia lớp học phần này!" });
    }

    // Thêm sinh viên vào lớp học phần
    await pool
      .request()
      .input("studentId", sql.Int, studentId)
      .input("lophocphanId", sql.Int, lophocphanId)
      .query(
        "INSERT INTO SINHVIEN_LHP (MaSV, MaLHP, TrangThai) VALUES (@studentId, @lophocphanId, 1)"
      );

    res.json({ message: "Sinh viên đã được thêm vào lớp học phần!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm sinh viên vào lớp học phần" });
  }
};exports.addSVCl = async (req, res) => {
  const { studentId, lophocphanId } = req.body;
  console.log(studentId, lophocphanId, " studentId, lophocphanId");

  try {
    // Kiểm tra mã lớp học phần có tồn tại trong cơ sở dữ liệu không
    const checkLHP = await pool.request()
      .input('MaLHP', sql.Int, lophocphanId)
      .query('SELECT 1 FROM LOPHOCPHAN WHERE ID = @MaLHP AND IsDeleted = 0');

    if (checkLHP.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Mã lớp học phần không hợp lệ' });
    }

    // Kiểm tra sinh viên có tồn tại trong hệ thống không
    const checkStudent = await pool.request()
      .input('MaSV', sql.Int, studentId)
      .query('SELECT 1 FROM SINHVIEN WHERE ID = @MaSV AND IsDeleted = 0');

    if (checkStudent.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Sinh viên không tồn tại' });
    }

    // Nếu lớp học phần và sinh viên hợp lệ, gọi stored procedure để thêm sinh viên vào lớp học phần
    const result = await pool.request()
      .input('MaSV', sql.Int, studentId)
      .input('MaLHP', sql.Int, lophocphanId)
      .execute('sp_ThemSinhVienVaoLHP'); // Gọi stored procedure

    res.json({ success: true, message: 'Sinh viên đã được thêm vào lớp học phần' });
  } catch (error) {
    console.error('Error adding student to LHP:', error);
    res.status(500).json({ success: false, message: 'Không thể thêm sinh viên vào lớp học phần' });
  }
};

// Controller (node.js) - Lấy danh sách lớp học phần
exports.getAllLopHocPhan = async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT * FROM LOPHOCPHAN WHERE TrangThai = 1');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching LHP:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách lớp học phần.' });
  }
};
