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
