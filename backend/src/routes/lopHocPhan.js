// routes/lophophan.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/lopHocPhanController");
const checkGiangVien = require("../middleware/checkGiangVien");
const verifyToken = require("../middleware/authMiddleware");



router.post("/add",verifyToken, controller.addLopHocPhan);
router.get("/thanhphan", verifyToken, controller.getGiangVienVaSinhVien);
router.get("/:id", verifyToken, controller.getLopHocPhanById);
router.post("/:maLHP/add-sinhvien", verifyToken, checkGiangVien, controller.addSinhVien);
router.post("/:maLHP/add-giangvien", verifyToken, checkGiangVien, controller.addGiangVien);
router.delete("/:maLHP/remove-sinhvien", verifyToken, controller.removeSinhVien);
router.delete("/:maLHP/remove-giangvien", verifyToken, controller.removeGiangVien);
router.get("/:maLHP/giangvien", controller.getGiangViensOfLHP);
router.get("/:maLHP/sinhvien", controller.getSinhViensOfLHP);


module.exports = router;
