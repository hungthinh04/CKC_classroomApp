const { sql, pool } = require('../config/db');

// exports.getLopHocPhanByGiangVien = async (req, res) => {
//   const maGV = req.user.id;

//   try {
//     const result = await pool
//       .request()
//       .input('MaGV', sql.Int, maGV)
//       .query(`
//         SELECT * FROM LOPHOCPHAN
//         WHERE MaGV = @MaGV AND TrangThai = 1
//       `);

//     res.status(200).json(result.recordset);
//   } catch (err) {
//     console.error('❌ Lỗi lấy lớp học phần giảng viên:', err);
//     res.status(500).json({ message: 'Không thể lấy lớp học phần' });
//   }
// };

exports.getLopHocPhanByGiangVien = async (req, res) => {
  const maGV = req.user.id;

  try {
    const result = await pool
      .request()
      .input("MaGV", sql.Int, maGV)
      .query(`
        SELECT lhp.*, mh.TenMH, lh.MaLop
        FROM LOPHOCPHAN lhp
        JOIN MONHOC mh ON lhp.MaMH = mh.ID
        JOIN LOPHOC lh ON lhp.MaLH = lh.ID
        WHERE lhp.MaGV = @MaGV AND lhp.TrangThai = 1
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi lấy lớp học phần giảng viên:", err);
    res.status(500).json({ message: "Không thể lấy lớp học phần" });
  }
};


exports.getLopHocPhanFullInfoByGV = async (req, res) => {
  const maGV = req.user.id;
  try {
    const poolConnection = await pool.connect();
    const result = await poolConnection
      .request()
      .input("MaGV", sql.Int, maGV)
      .query(`
        SELECT lhp.ID, lhp.TenLHP, lhp.HocKy, lhp.NamHoc, mh.TenMH, lh.TenLP,
               COUNT(DISTINCT sv.ID) AS SoSinhVien,
               COUNT(DISTINCT bt.ID) AS SoBaiTap
        FROM LOPHOCPHAN lhp
        JOIN MONHOC mh ON lhp.MaMH = mh.ID
        JOIN LOPHOC lh ON lhp.MaLH = lh.ID
        LEFT JOIN SINHVIEN sv ON sv.MaLopHoc = lh.ID
        LEFT JOIN BAITAP bt ON bt.MaLHP = lhp.ID
        WHERE lhp.MaGV = @MaGV
        GROUP BY lhp.ID, lhp.TenLHP, lhp.HocKy, lhp.NamHoc, mh.TenMH, lh.TenLP
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi lấy lớp học phần chi tiết:", err);
    res.status(500).json({ message: "Không thể lấy lớp học phần chi tiết" });
  }
};


exports.getDashboardLHP = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request()
      .input("MaLHP", id)
      .query(`
        SELECT 
          L.TenLHP,
          L.HocKy,
          L.NamHoc,
          (GV.HoGV + ' ' + GV.TenGV) AS TenGV,
          MH.TenMH,
          LH.MaLop,
          (
            SELECT COUNT(*) 
            FROM SINHVIEN_LHP 
            WHERE MaLHP = L.ID
          ) AS TongSinhVien,
          (
            SELECT COUNT(*) 
            FROM BAIVIET 
            WHERE MaLHP = L.ID
          ) AS TongBaiViet,
          (
            SELECT COUNT(*) 
            FROM BAIVIET 
            WHERE MaLHP = L.ID AND LoaiBV = 1
          ) AS TongBaiTap,
          (
            SELECT COUNT(*) 
            FROM SINHVIEN_BAITAP 
            WHERE MaBaiViet IN (
              SELECT ID FROM BAIVIET WHERE MaLHP = L.ID
            )
          ) AS SoLuongDaNop
        FROM LOPHOCPHAN L
        JOIN GIANGVIENN GV ON L.MaGV = GV.ID
        JOIN MONHOC MH ON L.MaMH = MH.ID
        JOIN LOPHOC LH ON L.MaLH = LH.ID
        WHERE L.ID = @MaLHP
      `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi dashboard:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getAllGiangVien = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM GIANGVIEN');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách giảng viên' });
  }
};

exports.getGiangVienByLHP = async (req, res) => {
  const { maLHP } = req.query;
  try {
    const result = await pool.request()
      .input('MaLHP', sql.Int, maLHP)
      .query(`
        SELECT sv.MaSinhVien, sv.HoTen, sv.MaSV
        FROM SINHVIEN_LHP slhp
        JOIN SINHVIEN sv ON slhp.MaSV = sv.ID
        WHERE slhp.MaLHP = @MaLHP
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy sinh viên' });
  }
};
