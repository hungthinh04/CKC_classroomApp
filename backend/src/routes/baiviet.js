const express = require('express');
const router = express.Router();

const {getBaiVietByLopHocPhan} = require('../controllers/baivietController')
const {createBaiViet} = require('../controllers/baivietController')
const auth = require('../middleware/auth');
const checkGiangVien = require('../middleware/checkGiangVien');

router.get('/lophophan/:id/baiviet',auth,getBaiVietByLopHocPhan);
router.post('/giangvien/:id/baiviet', auth,checkGiangVien, createBaiViet);

module.exports = router