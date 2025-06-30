const { pool, sql } = require('../config/db');



exports.getBaiVietByLHP = async (req, res) => {
  const maLHP = req.params.id;
  try {
    const result = await pool.request()
      .input('MaLHP', sql.Int, maLHP)
      .query(`
        SELECT 
          bv.ID, bv.TieuDe, bv.NgayTao, bv.NoiDung, bv.LoaiBV, 
          bv.MaBaiViet, bv.TrangThai, gv.TenGV,gv.HoGV
        FROM BAIVIET bv
        JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        JOIN GIANGVIENN gv ON lhp.MaGV = gv.ID
        WHERE bv.MaLHP = @MaLHP
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy bài viết' });
  }
};
exports.createBaiViet = async (req, res) => {
  const {
    TieuDe,
    NoiDung,
    LoaiBV,
    MaLHP,
    MaCD,
    NgayKetThuc,
    GioKetThuc,
  } = req.body;

  try {
    await pool.request()
      .input("TieuDe", sql.NVarChar, TieuDe)
      .input("NoiDung", sql.NVarChar, NoiDung)
      .input("LoaiBV", sql.SmallInt, LoaiBV)
      .input("MaLHP", sql.Int, MaLHP)
      .input("MaTK", sql.Int, req.user.id) // ✅ lấy từ token
      .input("MaCD", sql.Int, MaCD)
      .input("NgayKetThuc", sql.DateTime, NgayKetThuc || null)
      .input("GioKetThuc", sql.DateTime, GioKetThuc || null)
      .query(`
        INSERT INTO BAIVIET (
          TieuDe, NoiDung, LoaiBV, MaLHP, MaTK,
          MaCD, NgayTao, NgayKetThuc, GioKetThuc, TrangThai
        )
        VALUES (
          @TieuDe, @NoiDung, @LoaiBV, @MaLHP, @MaTK,
          @MaCD, GETDATE(), @NgayKetThuc, @GioKetThuc, 1
        )
      `);

    res.status(201).json({ message: "Tạo bài viết thành công" });
  } catch (err) {
    console.error("❌ Lỗi tạo bài viết:", err);
    res.status(500).json({ message: "Lỗi khi tạo bài viết" });
  }
};


exports.getBaiVietTheoLoai = async (req, res) => {
  const { maLHP, loaiBV } = req.query;
  console.log("➡️ typeof maLHP:", typeof maLHP, "value:", maLHP);
  console.log("➡️ typeof loaiBV:", typeof loaiBV, "value:", loaiBV);

  const maLHPInt = parseInt(maLHP);
  const loaiBVInt = parseInt(loaiBV);

  if (isNaN(maLHPInt) || isNaN(loaiBVInt)) {
    console.warn("❌ maLHP hoặc loaiBV không hợp lệ:", maLHP, loaiBV);
    return res.status(400).json({ message: "Tham số không hợp lệ" });
  }

  try {
    const result = await pool
      .request()
      .input("MaLHP", sql.Int, maLHPInt)
      .input("LoaiBV", sql.Int, loaiBVInt).query(`
        SELECT 
          bv.ID AS id,
          bv.TieuDe AS tieuDe,
          bv.NoiDung AS noiDung,
          bv.NgayTao AS ngayTao,
          bv.NgayKetThuc AS ngayKetThuc,
          bv.LoaiBV AS loaiBV,
          bv.MaBaiViet AS maBaiViet,
          bv.TrangThai AS trangThai
        FROM BAIVIET bv
        WHERE bv.MaLHP = @MaLHP AND bv.LoaiBV = @LoaiBV
        ORDER BY bv.NgayTao DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy bài viết theo loại:", err);
    res.status(500).json({ message: "Lỗi server khi lấy bài viết theo loại" });
  }
};



// exports.createBaiViet = async (req, res) => {
//   const {
//     TieuDe,
//     NoiDung,
//     LoaiBV,
//     MaLHP,
//     MaCD,
//     GioKetThuc,
//     NgayKetThuc,
//   } = req.body;
// console.log('👉 MaLHP:', MaLHP);

//   try {
//     await pool.request()
//       .input('TieuDe', sql.NVarChar, TieuDe)
//       .input('NoiDung', sql.NVarChar, NoiDung)
//       .input('LoaiBV', sql.SmallInt, LoaiBV)
//       .input('MaTK', sql.Int, req.user.id) // lấy từ token
//       .input('MaLHP', sql.Int, MaLHP)
//       .input('MaCD', sql.Int, MaCD)
//       .input('GioKetThuc', sql.DateTime, GioKetThuc)
//       .input('NgayKetThuc', sql.DateTime, NgayKetThuc)
//       .input('TrangThai', sql.SmallInt, 1)
//       .query(`
//         INSERT INTO BAIVIET (
//           TieuDe, NoiDung, LoaiBV, MaTK, MaLHP, MaCD, 
//           GioKetThuc, NgayKetThuc, TrangThai
//         )
//         VALUES (
//           @TieuDe, @NoiDung, @LoaiBV, @MaTK, @MaLHP, @MaCD, 
//           @GioKetThuc, @NgayKetThuc, @TrangThai
//         )
//       `);

//     res.status(201).json({ message: "Tạo bài viết thành công" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi tạo bài viết" });
//   }
// };
