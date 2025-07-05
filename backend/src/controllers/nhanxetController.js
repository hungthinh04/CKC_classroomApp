const { pool, sql } = require("../config/db");

exports.getCommentsByPostId = async (req, res) => {
  const { id } = req.params;  // Lấy ID bài viết từ URL

  try {
    const result = await pool
      .request()
      .input("MaBV", sql.Int, id)
      .query(`
        SELECT n.ID, n.NoiDung, n.NgayTao, u.HoTen
        FROM NHANXET n
        JOIN USERS u ON n.MaTK = u.ID
        WHERE n.MaBV = @MaBV
        ORDER BY n.NgayTao DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Chưa có nhận xét" });
    }

    // Trả về dữ liệu nhận xét
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi lấy nhận xét" });
  }
};

exports.postComment = async (req, res) => {
  const { id } = req.params; // bài viết
  const { noiDung, tenNguoiDung } = req.body; // Tên người bình luận và nội dung nhận xét
  const user = req.user; // từ middleware verifyToken

  if (!noiDung?.trim()) {
    return res.status(400).json({ message: "Nội dung không được để trống" });
  }

  try {
    await pool
      .request()
      .input("NoiDung", noiDung)
      .input("MaBV", id)
      .input("MaTK", user.id)
      .input("TenNguoiDung", tenNguoiDung)
      .query(`
        INSERT INTO NHANXET (NoiDung, MaBV, MaTK, TenNguoiDung)
        VALUES (@NoiDung, @MaBV, @MaTK, @TenNguoiDung)
      `);

    res.status(201).json({ message: "Đã thêm nhận xét" });
  } catch (err) {
    console.error("❌ Lỗi khi thêm nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi thêm nhận xét" });
  }
};
