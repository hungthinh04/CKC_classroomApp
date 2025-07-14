const express = require('express');
const router = express.Router();
const { login, loginGiangVien, loginSinhVien, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/auth', loginUser);
router.get("/profilee", authenticateToken, getProfile); // Bảo vệ với JWT token
router.put("/profile", authenticateToken, updateProfile); // Cập nhật thông tin người dùng


// router.post("/gv/login", loginGiangVien);
// router.post("/sv/login", loginSinhVien);

module.exports = router;
