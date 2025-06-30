// routes/lophophan.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/lopHocPhanController");

router.get("/thanhphan", controller.getGiangVienVaSinhVien);
router.get("/:id", controller.getLopHocPhanById);

module.exports = router;
