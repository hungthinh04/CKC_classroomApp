const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const controller = require('../controllers/sinhvienController');
const checkGiangVien = require('../middleware/checkGiangVien');
const verifyToken = require('../middleware/authMiddleware');

// router.get('/lophophan/:id/baiviet',auth,controller.getBaiVietByLHP);
// router.post('/:id', auth, controller.getSinhVienByLHP);
router.get("/sinhvien/:id/lophocphan", verifyToken, controller.getLopHocPhanBySinhVien);

module.exports = router;
