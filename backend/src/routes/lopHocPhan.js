// routes/lophophan.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/lopHocPhanController");
const checkGiangVien = require("../middleware/checkGiangVien");

router.get("/thanhphan", controller.getGiangVienVaSinhVien);
router.get("/:id", controller.getLopHocPhanById);
router.post("/:maLHP/add-sinhvien", checkGiangVien, controller.addSinhVien);
router.post("/:maLHP/add-giangvien", checkGiangVien, controller.addGiangVien);
router.delete("/:maLHP/remove-sinhvien", controller.removeSinhVien);

module.exports = router;
