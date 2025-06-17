// adminRoutes.js

const express = require("express");
const router = express.Router();

const { getAllKhoa, getAllMonHoc, getMonHocById } = require("../controllers/adminController"); // Import getAllKhoa from adminController
const { getAllBoMon } = require("../controllers/adminController"); // Import getAllKhoa from adminController
const { getBoMonById } = require("../controllers/adminController"); // Import getBoMonById from adminController
const {
  addKhoa,
  updateKhoa,
  deleteKhoa,
  addBoMon,
  updateBoMon,
  deleteBoMon,
  addMonHoc,
  updateMonHoc,
  deleteMonHoc,
} = require("../controllers/adminController");
const { getKhoaById } = require("../controllers/adminController");

//khoa
router.get("/khoa/:id", getKhoaById);
router.get("/khoa", getAllKhoa); // trong adminRoutes
router.post("/khoa", addKhoa);
router.put("/khoa/:id", updateKhoa);
router.delete("/khoa/:id", deleteKhoa);

// Quản lý Bộ môn
router.get("/bomon", getAllBoMon); // Assuming this is to get all BoMon
router.get("/bomon/:id", getBoMonById); // Assuming this is to get BoMon by ID

router.post("/bomon", addBoMon);
router.put("/bomon/:id", updateBoMon);
router.delete("/bomon/:id", deleteBoMon);

// Quản lý Môn học
router.get("/monhoc", getAllMonHoc); // Assuming this is to get all MonHoc
router.get("/monhoc/:id", getMonHocById); // Assuming this is to get MonHoc by ID

router.post("/monhoc", addMonHoc);
router.put("/monhoc/:id", updateMonHoc);
router.delete("/monhoc/:id", deleteMonHoc);

module.exports = router;
