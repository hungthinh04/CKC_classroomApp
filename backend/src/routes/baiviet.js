const express = require("express");
const router = express.Router();

const { getBaiVietByLopHocPhan } = require("../controllers/baivietController");
const { createBaiViet } = require("../controllers/baivietController");
const auth = require("../middleware/auth");
const controller = require("../controllers/baivietController");
const controllerComment = require("../controllers/nhanxetController");
const checkGiangVien = require("../middleware/checkGiangVien");
const upload = require("../utils/multer"); // ✅ import đúng middleware
const verifyToken = require("../middleware/authMiddleware");

router.post("/tao", auth, checkGiangVien, upload.single("file"), (req, res, next) => {
  // console.log("🔍 Kiểm tra req.headers['content-type']:", req.headers['content-type']);
  // console.log("✅ Multer file:", req.file);
  // console.log("✅ Multer body:", req.body);

  // if (!req.file) {
  //   return res.status(400).json({ message: "Không có tệp nào được upload." });
  // }
  next();
}, createBaiViet);


router.get("/loai", controller.getBaiVietTheoLoai);

router.get("/id/:id", controller.getBaiVietById);
router.get("/:id", controller.getBaiVietByLHP);


// router.post("/tao", auth, checkGiangVien, controller.createBaiViet);

router.delete("/:id", auth, checkGiangVien, controller.deleteBaiViet);
// router.post("/nopbai", controller.nopBai);
router.post("/nopbai", auth, upload.single("file"), controller.nopBai);
router.get('/chitiet/:id', controller.getBaiVietById);


router.get("/:id/comments", controllerComment.getCommentsByPostId);

// Gửi comment mới (phải đăng nhập)
router.post("/:id/comment", verifyToken, controllerComment.postComment);

module.exports = router;
