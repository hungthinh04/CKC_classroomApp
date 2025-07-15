const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMe, addSinhVien, addGiangVien, getMaSV } = require('../controllers/userController');
const checkGiangVien = require('../middleware/checkGiangVien');
const checkAdmin = require('../middleware/checkAdmin');

router.get('/users/me', auth, getMe);
router.get('/getMaSV/me', auth, getMaSV);


router.post('/sinhvien', auth, checkGiangVien, addSinhVien);

router.post('/giangvien', auth, checkAdmin, addGiangVien);

module.exports = router;
