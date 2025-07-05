const { pool, sql } = require("../config/db");

// API lấy danh sách lớp học phần theo sinh viên
exports.getLopHocPhanBySinhVien = async (req, res) => {
  const maSV = req.user.id;

  try {
    const result = await pool.request().input("MaSV", sql.Int, maSV).query(`
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
        JOIN GIANGVIENN gv ON lhp.MaGV = gv.ID
        JOIN MONHOC mh ON lhp.MaMH = mh.ID
        JOIN LOPHOC lh ON lhp.MaLH = lh.ID
        WHERE svlhp.MaSV = @MaSV AND lhp.TrangThai = 1
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi lấy LHP sinh viên:", err);
    res.status(500).json({ message: "Không thể lấy lớp học phần sinh viên" });
  }
};


