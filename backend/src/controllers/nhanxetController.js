const { pool, sql } = require("../config/db");

// Lấy danh sách nhận xét theo bài viết
exports.getCommentsByPostId = async (req, res) => {
  const { id } = req.params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    return res.status(400).json({ message: "ID bài viết không hợp lệ" });
  }

  try {
    const result = await pool
      .request()
      .input("MaBV", sql.Int, postId)
      .query(`
        SELECT 
          n.ID, 
          n.NoiDung, 
          n.NgayTao,
          COALESCE(sv.HoTen, gv.HoGV + ' ' + gv.TenGV, u.Email) AS TenNguoiDung
        FROM NHANXET n
        JOIN USERS u ON n.MaTK = u.ID
        LEFT JOIN SINHVIEN sv ON sv.MaTK = u.ID
        LEFT JOIN GIANGVIENN gv ON gv.MaTK = u.ID
        WHERE n.MaBV = @MaBV
        ORDER BY n.NgayTao DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi lấy nhận xét" });
  }
};

// Thêm nhận xét vào bài viết
exports.postComment = async (req, res) => {
  const { id } = req.params;
  const { noiDung } = req.body;
  const user = req.user; // middleware verifyToken
  const postId = parseInt(id);

  console.log("📥 postComment -> id:", id);
  console.log("👤 user.id:", user?.id);

  if (!noiDung?.trim()) {
    return res.status(400).json({ message: "Nội dung không được để trống" });
  }

  if (isNaN(postId)) {
    return res.status(400).json({ message: "ID bài viết không hợp lệ" });
  }

  try {
    await pool
      .request()
      .input("NoiDung", sql.NVarChar(sql.MAX), noiDung)
      .input("MaBV", sql.Int, postId)
      .input("MaTK", sql.Int, user.id)
      .query(`
        INSERT INTO NHANXET (NoiDung, MaBV, MaTK)
        VALUES (@NoiDung, @MaBV, @MaTK)
      `);

    res.status(201).json({ message: "Đã thêm nhận xét" });
  } catch (err) {
    console.error("❌ Lỗi khi thêm nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi thêm nhận xét" });
  }
};
