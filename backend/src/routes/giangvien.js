const { verify } = require("crypto");
const express =require("express");
const checkGiangVien = require("../middleware/checkGiangVien");
const { getLopHocPhanByGiangVien, getLopHocPhanFullInfoByGV } = require("../controllers/giangvienController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// router.get("/lophocphan", verifyToken, checkGiangVien, getLopHocByGiangVien);
router.get("/giangvien/:id/lophocphan",verifyToken, getLopHocPhanByGiangVien);
router.get("/giangvien/lophocphan", verifyToken, getLopHocPhanByGiangVien);
router.get("/lophocphan/my", verifyToken, getLopHocPhanFullInfoByGV);

module.exports = router;