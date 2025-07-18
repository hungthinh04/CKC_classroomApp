const { pool, sql } = require("../config/db");

// GET /baiviet/:id/comments
exports.getCommentsByPostId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool
      .request()
      .input("MaBV", sql.Int, id)
      .query(`
        SELECT 
          n.ID, 
          n.NoiDung, 
          n.NgayTao, 
          n.MaTK,
          COALESCE(sv.HoTen, gv.HoGV + ' ' + gv.TenGV, u.HoTen, u.Email) AS TenNguoiDung
        FROM NHANXET n
        JOIN USERS u ON n.MaTK = u.ID
        LEFT JOIN SINHVIEN sv ON sv.MaTK = u.ID
        LEFT JOIN GIANGVIEN gv ON gv.MaTK = u.ID
        WHERE n.MaBV = @MaBV
        ORDER BY n.NgayTao DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi lấy nhận xét" });
  }
};



// POST /baiviet/:id/comment
exports.postComment = async (req, res) => {
  const { id } = req.params; // id của bài viết
  const { noiDung } = req.body;
  const user = req.user;

  const postId = parseInt(id); // Ép kiểu trước
  if (isNaN(postId)) {
    return res.status(400).json({ message: "ID bài viết không hợp lệ" });
  }
  if (!noiDung?.trim()) {
    return res.status(400).json({ message: "Nội dung không được để trống" });
  }

  try {
    await pool
      .request()
      .input("NoiDung", sql.NVarChar, noiDung)
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


// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const check = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT MaTK FROM NHANXET WHERE ID = @ID");
    if (check.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhận xét" });
    }
    const comment = check.recordset[0];
    if (comment.MaTK !== user.id) {
      return res.status(403).json({ message: "Không có quyền xoá nhận xét này" });
    }
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM NHANXET WHERE ID = @ID");
    res.json({ message: "Đã xoá nhận xét" });
  } catch (err) {
    console.error("❌ Lỗi khi xoá nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi xoá nhận xét" });
  }
};


exports.updateComment = async (req, res) => {
  const { id } = req.params; // ID của nhận xét
  const user = req.user;
  console.log("👤 User từ token:", user);

  const { noiDung } = req.body;

  if (!noiDung?.trim()) {
    return res.status(400).json({ message: "Nội dung không được để trống" });
  }

  try {
    // Kiểm tra quyền sửa
    const check = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT MaTK FROM NHANXET WHERE ID = @ID");

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhận xét" });
    }

    const comment = check.recordset[0];
    if (comment.MaTK !== user.id) {
      return res.status(403).json({ message: "Không có quyền sửa nhận xét này" });
    }

    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("NoiDung", noiDung)
      .query("UPDATE NHANXET SET NoiDung = @NoiDung WHERE ID = @ID");

    res.json({ message: "Đã cập nhật nhận xét" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật nhận xét:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật nhận xét" });
  }
};
