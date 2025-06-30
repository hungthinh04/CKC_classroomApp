const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const controller = require('../controllers/sinhvienController');
const checkGiangVien = require('../middleware/checkGiangVien');

// router.get('/lophophan/:id/baiviet',auth,controller.getBaiVietByLHP);
// router.post('/:id', auth, controller.getSinhVienByLHP);

module.exports = router;
