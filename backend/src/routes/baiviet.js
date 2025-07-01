const express = require("express");
const router = express.Router();

const { getBaiVietByLopHocPhan } = require("../controllers/baivietController");
const { createBaiViet } = require("../controllers/baivietController");
const auth = require("../middleware/auth");
const controller = require("../controllers/baivietController");
const checkGiangVien = require("../middleware/checkGiangVien");
const upload = require("../utils/multer"); // ✅ import đúng middleware

// router.get('/lophophan/:id/baiviet',auth,controller.getBaiVietByLHP);
router.get("/loai", controller.getBaiVietTheoLoai);

router.get("/:id", controller.getBaiVietByLHP);


// router.post("/tao", auth, checkGiangVien, controller.createBaiViet);

router.delete("/:id", auth, checkGiangVien, controller.deleteBaiViet);
router.post("/nopbai", controller.nopBai);
router.get('/chitiet/:id', controller.getBaiVietById);

router.post(
  "/tao",
  auth,
  checkGiangVien,
  upload.single("file"), // 👈 để parse `multipart/form-data`
  controller.createBaiViet
);
module.exports = router;
