const express = require("express");
const router = express.Router();

// const { getBaiVietByLopHocPhan } = require("../controllers/baivietController");
const { createBaiViet } = require("../controllers/baivietController");
const auth = require("../middleware/auth");
const controller = require("../controllers/baivietController");
const controllerComment = require("../controllers/nhanxetController");
const checkGiangVien = require("../middleware/checkGiangVien");
const upload = require("../utils/multer"); // ✅ import đúng middleware
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer"); // import gốc từ package multer

const multiUpload = multer(); // Sử dụng multer mặc định hoặc tùy chỉnh như ví dụ trên

router.post("/tao", auth, checkGiangVien, upload.single("file"), (req, res, next) => {
  // console.log("🔍 Kiểm tra req.headers['content-type']:", req.headers['content-type']);
  // console.log("✅ Multer file:", req.file);
  // console.log("✅ Multer body:", req.body);

  // if (!req.file) {
  //   return res.status(400).json({ message: "Không có tệp nào được upload." });
  // }
  next();
}, createBaiViet);



// router.get('/bainop/danhsach/:maBaiViet', controller.getDanhSachBaiNopByBaiViet);
router.get("/loai", controller.getBaiVietTheoLoai);

router.get("/id/:id", controller.getBaiVietById);
router.get("/:id", controller.getBaiVietByLHP);

router.get("/bainop/bv/:maBaiViet", controller.getDanhSachBaiNopByBaiViet);
// router.post("/tao", auth, checkGiangVien, controller.createBaiViet);

router.delete("/:id", auth, checkGiangVien, controller.deleteBaiNop);
// router.post("/nopbai", controller.nopBai);
router.post(
  "/nopbai",
  auth,
  
  controller.nopBai
);
router.get("/chitiet/:id", controller.getBaiVietById);
router.delete("/bainop/:id", controller.deleteBaiNop);
router.delete("/:id", controller.deleteBaiTap);

router.get("/:id/comments", controllerComment.getCommentsByPostId);

// Ví dụ với Express
router.get("/bainop/danhsach/:id", controller.getBaiNopByBaiViet);

// Gửi comment mới (phải đăng nhập)
router.post("/:id/comment", verifyToken, controllerComment.postComment);
router.get("/canlam/:maSV", controller.getBaiTapCanLam);
router.put("/capnhat/:id", auth, controller.updateBaiNop);
// router.get('/me/role', auth, controller.getMyRole);
module.exports = router;
