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
