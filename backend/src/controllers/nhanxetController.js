const db = require("../config/db");
const { pool, sql } = require("../config/db");


exports.getCommentsByPostId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool
      .request()
      .input("MaBV", id)
      .query(`
        SELECT n.ID, n.NoiDung, n.NgayTao, u.MaNguoiDung, u.Email
        FROM NHANXET n
        JOIN USERS u ON n.MaTK = u.ID
        WHERE n.MaBV = @MaBV
        ORDER BY n.NgayTao DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi lấy nhận xét" });
  }
};

exports.postComment = async (req, res) => {
  const { id } = req.params; // bài viết
  const { noiDung } = req.body;
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
