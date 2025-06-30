const express = require("express");
const router = express.Router();

const { getBaiVietByLopHocPhan } = require("../controllers/baivietController");
const { createBaiViet } = require("../controllers/baivietController");
const auth = require("../middleware/auth");
const controller = require("../controllers/baivietController");
const checkGiangVien = require("../middleware/checkGiangVien");

// router.get('/lophophan/:id/baiviet',auth,controller.getBaiVietByLHP);
router.get("/loai", controller.getBaiVietTheoLoai);

router.get("/:id", controller.getBaiVietByLHP);


router.post("/tao", auth, checkGiangVien, controller.createBaiViet);
module.exports = router;
