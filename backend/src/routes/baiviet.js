const express = require('express');
const router = express.Router();

const {getBaiVietByLopHocPhan} = require('../controllers/baivietController')
const {createBaiViet} = require('../controllers/baivietController')
const auth = require('../middleware/auth');
const checkGiangVien = require('../middleware/checkGiangVien');
const controller = require('../controllers/baivietController');

// router.get('/lophophan/:id/baiviet',auth,controller.getBaiVietByLHP);
router.post('/giangvien/:id/baiviet', auth,checkGiangVien, controller.createBaiViet);
router.get('/', controller.getBaiVietByLHP);

module.exports = router;
