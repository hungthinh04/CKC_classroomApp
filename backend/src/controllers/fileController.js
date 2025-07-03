// controllers/fileController.js
const sql = require("mssql");
const pool = require("../db");

exports.uploadFileBaiViet = async (req, res) => {
  try {
    const file = req.file;
    const { MaBaiViet } = req.body;

    if (!file) return res.status(400).json({ message: "Không có file gửi lên" });

    const fileName = file.originalname;
    const filePath = file.path;
    const dungLuong = file.size / 1024; // KB
    const ext = fileName.split(".").pop();

    const result = await pool.request()
      .input("MaFile", sql.NVarChar(20), "") // sẽ được cập nhật sau bằng trigger
      .input("TenFile", sql.NVarChar(255), fileName)
      .input("TenVatTy", sql.NVarChar(255), fileName)
      .input("NgayTao", sql.DateTime, new Date())
      .input("DuongDan", sql.NVarChar(255), filePath)
      .input("LoaiFile", sql.NVarChar(10), ext)
      .input("DungLuong", sql.Float, dungLuong)
      .input("TrangThai", sql.SmallInt, 1)
      .input("MaBaiViet", sql.Int, MaBaiViet)
      .query(`
        INSERT INTO [FILE] 
        (MaFile, TenFile, TenVatTy, NgayTao, DuongDan, LoaiFile, DungLuong, TrangThai, MaBaiViet)
        OUTPUT INSERTED.ID
        VALUES 
        (@MaFile, @TenFile, @TenVatTy, @NgayTao, @DuongDan, @LoaiFile, @DungLuong, @TrangThai, @MaBaiViet)
      `);

    const fileId = result.recordset[0].ID;

    await pool.request()
      .input("MaFile", sql.Int, fileId)
      .input("MaBaiViet", sql.Int, MaBaiViet)
      .input("TrangThai", sql.SmallInt, 1)
      .query(`
        INSERT INTO FILE_BAIVIET (MaFile, TrangThai, MaBaiViet)
        VALUES (@MaFile, @TrangThai, @MaBaiViet)
      `);

    res.json({ message: "✅ Upload thành công", fileId });
  } catch (err) {
    console.error("❌ Lỗi upload:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
