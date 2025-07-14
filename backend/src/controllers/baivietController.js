const { BASE_URL } = require("../../constants/Link");
// import { BASE_URL } from '@/constants/Link';
const { pool, sql } = require("../config/db");

exports.getBaiVietByLHP = async (req, res) => {
  const maLHP = parseInt(req.params.id);
  if (!maLHP) return res.status(400).json({ message: "Mã lớp học phần không hợp lệ" });
  try {
    const result = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT 
          bv.ID, bv.TieuDe, bv.NgayTao, bv.NoiDung, bv.LoaiBV, 
          bv.MaBaiViet, bv.TrangThai, 
          COALESCE(gv.HoGV + ' ' + gv.TenGV, '') AS TenGiangVien
        FROM BAIVIET bv
        LEFT JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        LEFT JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
        WHERE bv.MaLHP = @MaLHP AND bv.IsDeleted = 0
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi truy vấn bài viết:", err);
    res.status(500).json({ message: "Lỗi khi lấy bài viết" });
  }
};

exports.createBaiViet = async (req, res) => {
  const { TieuDe, NoiDung, LoaiBV, MaLHP, HanNop } = req.body;
  try {
    const result = await pool
      .request()
      .input("TieuDe", sql.NVarChar, TieuDe)
      .input("NoiDung", sql.NVarChar, NoiDung)
      .input("LoaiBV", sql.SmallInt, LoaiBV)
      .input("MaLHP", sql.Int, MaLHP)
      .input("MaTK", sql.Int, req.user.id)
      .input("HanNop", sql.DateTime, HanNop || null)
      .input("TrangThai", sql.SmallInt, 1)
      .query(`
        INSERT INTO BAIVIET (TieuDe, NoiDung, LoaiBV, MaLHP, MaTK, HanNop, TrangThai)
        VALUES (@TieuDe, @NoiDung, @LoaiBV, @MaLHP, @MaTK, @HanNop, @TrangThai);
        SELECT SCOPE_IDENTITY() AS ID;
      `);

    const baiVietId = result.recordset[0].ID;

    // Nếu có file, insert sang bảng FILE
    let fileUrl = null;
    if (req.file) {
      const fileName = req.file.filename;
      fileUrl = `/uploads/${fileName}`;
      await pool.request()
        .input("TenFile", sql.NVarChar, req.file.originalname)
        .input("DuongDan", sql.NVarChar, fileUrl)
        .input("LoaiFile", sql.NVarChar, req.file.mimetype)
        .input("DungLuong", sql.Float, req.file.size)
        .input("TrangThai", sql.SmallInt, 1)
        .input("MaBaiViet", sql.Int, baiVietId)
        .query(`
          INSERT INTO [FILE] (TenFile, DuongDan, LoaiFile, DungLuong, TrangThai, MaBaiViet)
          VALUES (@TenFile, @DuongDan, @LoaiFile, @DungLuong, @TrangThai, @MaBaiViet)
        `);
    }

    res.status(201).json({ message: "Tạo bài viết thành công", baiVietId, fileUrl });
  } catch (err) {
    console.error("Lỗi tạo bài viết:", err);
    res.status(500).json({ message: "Lỗi khi tạo bài viết" });
  }
};


exports.getBaiVietTheoLoai = async (req, res) => {
  const { maLHP, loaiBV } = req.query;
  const maLHPInt = parseInt(maLHP);
  const loaiBVInt = parseInt(loaiBV);

  if (isNaN(maLHPInt) || isNaN(loaiBVInt)) {
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
          bv.HanNop AS ngayKetThuc,
          bv.LoaiBV AS loaiBV,
          bv.MaBaiViet AS maBaiViet,
          bv.TrangThai AS trangThai,
          f.DuongDan AS duongDanFile
        FROM BAIVIET bv
        LEFT JOIN [FILE] f ON f.MaBaiViet = bv.ID AND f.TrangThai = 1
        WHERE bv.MaLHP = @MaLHP AND bv.LoaiBV = @LoaiBV
        ORDER BY bv.NgayTao DESC
      `);

    // Sửa lại file url trả về đúng BASE_URL nếu có file
    const data = result.recordset.map((bv) => ({
      ...bv,
      duongDanFile: bv.duongDanFile ? `${BASE_URL}${bv.duongDanFile}` : null,
    }));

    res.json(data);
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

exports.deleteBaiNop = async (req, res) => {
  const { id } = req.params; // Nhận ID của bài nộp từ URL params

  // Kiểm tra ID hợp lệ
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "ID bài nộp không hợp lệ" });
  }

  try {
    // Thực hiện xóa bài nộp trong bảng SINHVIEN_NOPBAI
    const result = await pool
      .request()
      .input("ID", sql.Int, parseInt(id)) // Chuyển ID thành số trước khi truyền vào SQL
      .query("DELETE FROM SINHVIEN_NOPBAI WHERE ID = @ID");

    // Kiểm tra xem có bài nộp nào được xóa hay không
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài nộp để xóa" });
    }

    // Trả về phản hồi thành công
    res.json({ message: "Xóa bài nộp thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa bài nộp:", err);
    res.status(500).json({ message: "Lỗi server khi xóa bài nộp" });
  }
};

// DELETE /baiviet/:id
exports.deleteBaiNop = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ message: "ID bài nộp không hợp lệ" });

  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, parseInt(id))
      .query("DELETE FROM NOPBAI WHERE ID = @ID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài nộp để xóa" });
    }
    res.json({ message: "Xóa bài nộp thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa bài nộp:", err);
    res.status(500).json({ message: "Lỗi server khi xóa bài nộp" });
  }
};


// exports.nopBai = async (req, res) => {
//   try {
//     console.log("📥 Nhận dữ liệu nộp bài:", req.body);
//     console.log("📁 File nhận được:", req.file);

//     const MaBV = req.body.MaBV;
//     const VanBan = req.body.VanBan || null;
//     const MaTK = req.user.id;

//     // 🔐 Kiểm tra quyền sinh viên
//     if (req.user.role !== 0) {
//       return res
//         .status(403)
//         .json({ message: "Chỉ sinh viên được phép nộp bài" });
//     }

//     if (!MaBV || (!req.file && !VanBan)) {
//       return res
//         .status(400)
//         .json({ message: "Vui lòng chọn tệp hoặc nhập nhận xét" });
//     }

//     // 🔍 Lấy MaSV từ MaTK
//     const svResult = await pool
//       .request()
//       .input("MaTK", sql.Int, MaTK)
//       .query(`SELECT TOP 1 ID FROM SINHVIEN WHERE MaTK = @MaTK`);

//     if (svResult.recordset.length === 0) {
//       return res.status(403).json({ message: "Không tìm thấy sinh viên" });
//     }

//     const MaSV = svResult.recordset[0].ID;

//     // 📎 Nếu có file, lưu vào bảng FILE
//     let MaFile = null;
//     let LienKet = null;

//     if (req.file) {
//       const { filename, originalname, size } = req.file;
//       const filePath = `/uploads/${filename}`;
//       const extension = originalname.split(".").pop();
//       const dungLuongMB = (size / (1024 * 1024)).toFixed(2);

//       const fileResult = await pool
//         .request()
//         .input("TenFile", sql.NVarChar, originalname)
//         .input("DuongDan", sql.NVarChar, filePath)
//         .input("DungLuong", sql.Float, dungLuongMB)
//         .input("LoaiFile", sql.NVarChar, extension)
//         .input("MaBaiViet", sql.Int, MaBV)
//         .input("TrangThai", sql.SmallInt, 1).query(`
//   DECLARE @InsertedIds TABLE (ID INT);
//   INSERT INTO [FILE] (
//     TenFile, DuongDan, DungLuong, LoaiFile, MaBaiViet, TrangThai, NgayTao
//   )
//   OUTPUT inserted.ID INTO @InsertedIds
//   VALUES (@TenFile, @DuongDan, @DungLuong, @LoaiFile, @MaBaiViet, @TrangThai, GETDATE());

//   SELECT ID FROM @InsertedIds;
// `);

//       MaFile = fileResult.recordset[0].ID;
//       LienKet = `/uploads/${filename}`;
//     }

//     // 💾 Lưu bài nộp
//     await pool
//       .request()
//       .input("MaSV", sql.Int, MaSV)
//       .input("MaFile", sql.Int, MaFile)
//       .input("LienKet", sql.NVarChar, LienKet)
//       .input("VanBan", sql.NVarChar, VanBan)
//       .input("MaBaiViet", sql.Int, MaBV).query(`
//         INSERT INTO SINHVIEN_NOPBAI (MaSV, MaFile, LienKet, VanBan, MaBaiViet)
//         VALUES (@MaSV, @MaFile, @LienKet, @VanBan, @MaBaiViet)
//       `);
//     console.log("📤 Trả response thành công:", {
//       fileUrl: LienKet,
//     });

//     return res.status(201).json({
//       message: "✅ Nộp bài thành công",
//       fileUrl: LienKet,
//     });
//   } catch (err) {
//     console.error("❌ Lỗi khi nộp bài:", err.message, err.stack);

//     res.status(500).json({ message: "Lỗi khi nộp bài" });
//   }
// };

exports.nopBai = async (req, res) => {
  try {
    const { MaBaiViet, VanBan } = req.body;
    const MaTK = req.user.id;

    let maLHP = req.body.MaLHP;
    if (Array.isArray(maLHP)) maLHP = maLHP[0];
    maLHP = parseInt(maLHP, 10);
    console.log("MaLHP fix:", maLHP, typeof maLHP);

    if (isNaN(maLHP)) return res.status(400).json({ message: "MaLHP không hợp lệ!" });

    // Lấy mã sinh viên
    const svResult = await pool
      .request()
      .input("MaTK", sql.Int, MaTK)
      .query(`SELECT TOP 1 ID FROM SINHVIEN WHERE MaTK = @MaTK`);
    if (svResult.recordset.length === 0)
      return res.status(403).json({ message: "Không tìm thấy sinh viên" });

    const MaSV = svResult.recordset[0].ID;

    // Thêm file nếu có
    let FileDinhKem = null;
    if (req.file) {
      FileDinhKem = `/uploads/${req.file.filename}`;
    }

    await pool.request()
      .input("MaSV", sql.Int, MaSV)
      .input("MaLHP", sql.Int, maLHP)
      .input("MaBaiViet", sql.Int, MaBaiViet)
      .input("FileDinhKem", sql.NVarChar, FileDinhKem)
      .input("VanBan", sql.NVarChar, VanBan)
      .input("TrangThai", sql.SmallInt, 1)
      .query(`
        INSERT INTO NOPBAI (MaSV, MaLHP, MaBaiViet, FileDinhKem, VanBan, TrangThai)
        VALUES (@MaSV, @MaLHP, @MaBaiViet, @FileDinhKem, @VanBan, @TrangThai)
      `);

    res.status(201).json({ message: "Nộp bài thành công" });
  } catch (err) {
    console.error("Lỗi khi nộp bài:", err);
    res.status(500).json({ message: "Lỗi khi nộp bài" });
  }
};

exports.getBaiNopByBaiViet = async (req, res) => {
  const { maBaiViet } = req.params;   // phải là ID bài viết
  const { maSV, maLHP } = req.query;
  if (!maSV || !maLHP) {
    return res.status(400).json({ message: "Thiếu mã sinh viên hoặc mã lớp học phần" });
  }

  try {
    const result = await pool
      .request()
      .input("MaBaiViet", sql.Int, maBaiViet)
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT 
            NOP.ID,
            NOP.MaSV,
            NOP.MaLHP,
            NOP.MaBaiViet,
            NOP.Diem,
            NOP.NgayNop,
            NOP.FileDinhKem,
            NOP.VanBan
        FROM NOPBAI NOP
        WHERE NOP.MaBaiViet = @MaBaiViet AND NOP.MaSV = @MaSV AND NOP.MaLHP = @MaLHP
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy bài nộp:", err);
    res.status(500).json({ message: "Lỗi khi lấy bài nộp" });
  }
};





// GET /baiviet/id/:
exports.getBaiVietById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request().input("ID", sql.Int, id).query(`
      SELECT 
        bv.ID,
        bv.TieuDe AS tieuDe,
        bv.NoiDung AS noiDung,
        bv.LoaiBV AS loaiBV,
        bv.NgayTao AS ngayTao,
        bv.MaLHP,                       
        f.DuongDan AS fileUrl,
        u.ID AS maNguoiDang,
        u.Email,
        COALESCE(sv.HoTen, gv.HoGV + ' ' + gv.TenGV, u.Email) AS tenNguoiDang
      FROM BAIVIET bv
      JOIN USERS u ON bv.MaTK = u.ID
      LEFT JOIN SINHVIEN sv ON sv.MaTK = u.ID
      LEFT JOIN GIANGVIEN gv ON gv.MaTK = u.ID
      LEFT JOIN [FILE] f ON f.MaBaiViet = bv.ID AND f.TrangThai = 1
      WHERE bv.ID = @ID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    const data = result.recordset[0];
    res.json({
      ...data,
      fileUrl: data.fileUrl ? `${BASE_URL}${data.fileUrl}` : null,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết bài viết:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};



exports.getBaiTapCanLam = async (req, res) => {
  const { maSV } = req.params; // Mã sinh viên (hoặc lấy từ token nếu đã login)

  try {
    const result = await pool.request().input("MaSV", sql.Int, maSV).query(`
        SELECT bv.ID, bv.TieuDe, bv.NoiDung, bv.NgayTao, bv.TrangThai
        FROM BAIVIET bv
        JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        JOIN SINHVIEN_LHP sv_lhp ON sv_lhp.MaLHP = lhp.ID
        WHERE sv_lhp.MaSV = @MaSV 
      
        AND bv.TrangThai = 1 
        AND NOT EXISTS ( 
          SELECT 1 
          FROM SINHVIEN_NOPBAI sn 
          WHERE sn.MaBaiViet = bv.ID AND sn.MaSV = @MaSV
        )
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy bài tập cần làm:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài tập" });
  }
};
