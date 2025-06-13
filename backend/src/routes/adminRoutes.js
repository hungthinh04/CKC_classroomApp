// adminRoutes.js

const express = require('express');
const router = express.Router();

const {
  addKhoa,
  updateKhoa,
  deleteKhoa,
  addBoMon,
  updateBoMon,
  deleteBoMon,
  addMonHoc,
  updateMonHoc,
  deleteMonHoc
} = require('../controllers/adminController');

// Quản lý Khoa
router.post('/khoa', addKhoa);
router.put('/khoa', updateKhoa);
router.delete('/khoa/:id', deleteKhoa);

// Quản lý Bộ môn
router.post('/bomon', addBoMon);
router.put('/bomon', updateBoMon);
router.delete('/bomon/:id', deleteBoMon);

// Quản lý Môn học
router.post('/monhoc', addMonHoc);
router.put('/monhoc', updateMonHoc);
router.delete('/monhoc/:id', deleteMonHoc);

module.exports = router;
