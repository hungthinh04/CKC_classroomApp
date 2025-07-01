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
console.log("✅ req.body:", req.body);
    console.log("✅ req.file:", req.file); // nếu có   file
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


exports.deleteBaiViet = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.request()
      .input("ID", sql.Int, parseInt(id))
      .query("DELETE FROM BAIVIET WHERE ID = @ID");

    res.json({ message: "Xóa bài viết thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa bài viết:", err);
    res.status(500).json({ message: "Lỗi server khi xóa bài viết" });
  }
};



exports.nopBai = async (req, res) => {
  const { maSV, maBaiViet, lienKet, vanBan } = req.body;

  if (!maSV || !maBaiViet) {
    return res.status(400).json({ message: "Thiếu thông tin sinh viên hoặc bài viết" });
  }

  try {
    await pool.request()
      .input("MaSV", sql.Int, maSV)
      .input("MaBaiViet", sql.Int, maBaiViet)
      .input("LienKet", sql.NVarChar, lienKet || "")
      .input("VanBan", sql.NVarChar, vanBan || "")
      .query(`
        INSERT INTO SINHVIEN_NOPBAI (MaSV, MaFile, LienKet, VanBan, MaBaiViet)
        VALUES (@MaSV, NULL, @LienKet, @VanBan, @MaBaiViet)
      `);

    res.json({ message: "Nộp bài thành công" });
  } catch (err) {
    console.error("❌ Lỗi nộp bài:", err);
    res.status(500).json({ message: "Lỗi khi nộp bài" });
  }
};


exports.getBaiVietById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request()
      .input("ID", sql.Int, id)
      .query(`
        SELECT 
          bv.ID, bv.TieuDe, bv.NoiDung, bv.NgayTao, bv.NgayKetThuc,
          bv.LoaiBV, bv.MaBaiViet, bv.TrangThai, gv.HoGV, gv.TenGV
        FROM BAIVIET bv
        JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
        WHERE bv.ID = @ID
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết bài viết:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
