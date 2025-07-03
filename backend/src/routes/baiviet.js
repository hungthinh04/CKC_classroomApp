const express = require("express");
const router = express.Router();

const { getBaiVietByLopHocPhan } = require("../controllers/baivietController");
const { createBaiViet } = require("../controllers/baivietController");
const auth = require("../middleware/auth");
const controller = require("../controllers/baivietController");
const checkGiangVien = require("../middleware/checkGiangVien");
const upload = require("../utils/multer"); // ✅ import đúng middleware

router.post("/tao", auth, checkGiangVien, upload.single("file"), (req, res, next) => {
  console.log("🔍 Kiểm tra req.headers['content-type']:", req.headers['content-type']);
  console.log("✅ Multer file:", req.file);
  console.log("✅ Multer body:", req.body);

  // Kiểm tra xem file đã được upload thành công chưa
  if (!req.file) {
    return res.status(400).json({ message: "Không có tệp nào được upload." });
  }

  // Tiếp tục với controller createBaiViet
  next();
}, createBaiViet);


router.get("/loai", controller.getBaiVietTheoLoai);

router.get("/:id", controller.getBaiVietByLHP);


// router.post("/tao", auth, checkGiangVien, controller.createBaiViet);

router.delete("/:id", auth, checkGiangVien, controller.deleteBaiViet);
// router.post("/nopbai", controller.nopBai);
router.post("/nopbai", auth, upload.single("file"), controller.nopBai);
router.get('/chitiet/:id', controller.getBaiVietById);


module.exports = router;
