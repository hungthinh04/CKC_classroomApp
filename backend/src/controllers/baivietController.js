const { pool, sql } = require("../config/db");

exports.getBaiVietByLHP = async (req, res) => {
  const maLHP = req.params.id;
  try {
    const result = await pool.request().input("MaLHP", sql.Int, maLHP).query(`
        SELECT 
          bv.ID, bv.TieuDe, bv.NgayTao, bv.NoiDung, bv.LoaiBV, 
          bv.MaBaiViet, bv.TrangThai, gv.TenGV,gv.HoGV,bv.DuongDanFile
        FROM BAIVIET bv
        JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        JOIN GIANGVIENN gv ON lhp.MaGV = gv.ID
        WHERE bv.MaLHP = @MaLHP
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy bài viết" });
  }
};
exports.createBaiViet = async (req, res) => {
  const { TieuDe, NoiDung, LoaiBV, MaLHP, MaCD, NgayKetThuc, GioKetThuc } =
    req.body;
  console.log("✅ req.body:", req.body);
  console.log("✅ req.file:", req.file); // nếu có   file
  try {
    await pool
      .request()
      .input("TieuDe", sql.NVarChar, TieuDe)
      .input("NoiDung", sql.NVarChar, NoiDung)
      .input("LoaiBV", sql.SmallInt, LoaiBV)
      .input("MaLHP", sql.Int, MaLHP)
      .input("MaTK", sql.Int, req.user.id) // ✅ lấy từ token
      .input("MaCD", sql.Int, MaCD)
      .input("NgayKetThuc", sql.DateTime, NgayKetThuc || null)
      .input("GioKetThuc", sql.DateTime, GioKetThuc || null)
      .input(
        "DuongDanFile",
        sql.NVarChar,
        req.file ? `/uploads/${req.file.filename}` : null
      ).query(`
        INSERT INTO BAIVIET (
          TieuDe, NoiDung, LoaiBV, MaLHP, MaTK,
          MaCD, NgayTao, NgayKetThuc, GioKetThuc, TrangThai,
          DuongDanFile
        )
        VALUES (
          @TieuDe, @NoiDung, @LoaiBV, @MaLHP, @MaTK,
          @MaCD, GETDATE(), @NgayKetThuc, @GioKetThuc, 1,
          @DuongDanFile
        )
        `);

    res.status(201).json({
      message: "Tạo bài viết thành công",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
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
          bv.DuongDanFile AS duongDanFile,
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
    await pool
      .request()
      .input("ID", sql.Int, parseInt(id))
      .query("DELETE FROM BAIVIET WHERE ID = @ID");

    res.json({ message: "Xóa bài viết thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa bài viết:", err);
    res.status(500).json({ message: "Lỗi server khi xóa bài viết" });
  }
};

exports.nopBai = async (req, res) => {
  try {
    console.log("📥 Nhận dữ liệu nộp bài:", req.body);
    console.log("📁 File nhận được:", req.file);

    const MaBV = req.body.MaBV;
    const VanBan = req.body.VanBan || null;
    const MaTK = req.user.id;

    // 🔐 Kiểm tra quyền sinh viên
    if (req.user.role !== 0) {
      return res
        .status(403)
        .json({ message: "Chỉ sinh viên được phép nộp bài" });
    }

    if (!MaBV || (!req.file && !VanBan)) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn tệp hoặc nhập nhận xét" });
    }

    // 🔍 Lấy MaSV từ MaTK
    const svResult = await pool
      .request()
      .input("MaTK", sql.Int, MaTK)
      .query(`SELECT TOP 1 ID FROM SINHVIEN WHERE MaTK = @MaTK`);

    if (svResult.recordset.length === 0) {
      return res.status(403).json({ message: "Không tìm thấy sinh viên" });
    }

    const MaSV = svResult.recordset[0].ID;

    // 📎 Nếu có file, lưu vào bảng FILE
    let MaFile = null;
    let LienKet = null;

    if (req.file) {
      const { filename, originalname, size } = req.file;
      const filePath = `/uploads/${filename}`;
      const extension = originalname.split(".").pop();
      const dungLuongMB = (size / (1024 * 1024)).toFixed(2);

      const fileResult = await pool
        .request()
        .input("TenFile", sql.NVarChar, originalname)
        .input("DuongDan", sql.NVarChar, filePath)
        .input("DungLuong", sql.Float, dungLuongMB)
        .input("LoaiFile", sql.NVarChar, extension)
        .input("MaBaiViet", sql.Int, MaBV)
        .input("TrangThai", sql.SmallInt, 1).query(`
  DECLARE @InsertedIds TABLE (ID INT);
  INSERT INTO [FILE] (
    TenFile, DuongDan, DungLuong, LoaiFile, MaBaiViet, TrangThai, NgayTao
  )
  OUTPUT inserted.ID INTO @InsertedIds
  VALUES (@TenFile, @DuongDan, @DungLuong, @LoaiFile, @MaBaiViet, @TrangThai, GETDATE());

  SELECT ID FROM @InsertedIds;
`);

      MaFile = fileResult.recordset[0].ID;
      LienKet = `http://192.168.1.104:3000${filePath}`;
    }

    // 💾 Lưu bài nộp
    await pool
      .request()
      .input("MaSV", sql.Int, MaSV)
      .input("MaFile", sql.Int, MaFile)
      .input("LienKet", sql.NVarChar, LienKet)
      .input("VanBan", sql.NVarChar, VanBan)
      .input("MaBaiViet", sql.Int, MaBV).query(`
        INSERT INTO SINHVIEN_NOPBAI (MaSV, MaFile, LienKet, VanBan, MaBaiViet)
        VALUES (@MaSV, @MaFile, @LienKet, @VanBan, @MaBaiViet)
      `);
    console.log("📤 Trả response thành công:", {
      fileUrl: LienKet,
    });

    return res.status(201).json({
      message: "✅ Nộp bài thành công",
      fileUrl: LienKet,
    });
  } catch (err) {
    console.error("❌ Lỗi khi nộp bài:", err.message, err.stack);

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
          bv.ID,
          bv.TieuDe AS tieuDe,
          bv.NoiDung AS noiDung,
          bv.LoaiBV AS loaiBV,
          bv.NgayTao AS ngayTao,
          bv.NgayKetThuc AS hanNop,
          bv.DuongDanFile AS fileUrl,
          gv.ID AS maGV,
          gv.TenGV AS tenGV,
          gv.HoGV AS hoGV
        FROM BAIVIET bv
        JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        JOIN GIANGVIENN gv ON lhp.MaGV = gv.ID
        WHERE bv.ID = @ID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    const data = result.recordset[0];

    res.json({
      ...data,
      fileUrl: data.fileUrl
        ? `http://192.168.1.104:3000${data.fileUrl}`
        : null,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết bài viết:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
