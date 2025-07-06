const express = require("express");
const router = express.Router();
const commentController = require("../controllers/nhanxetController");
const verifyToken = require("../middleware/authMiddleware");

// GET: Lấy tất cả nhận xét của bài viết
// router.get("/:id", verifyToken, commentController.getCommentsByPostId);

// POST: Thêm nhận xét
// router.post("/:id", verifyToken, commentController.postComment);

// PUT: Cập nhật nhận xét
router.put("/:id", verifyToken, commentController.updateComment);

// DELETE: Xoá nhận xét
router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;
