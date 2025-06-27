const express = require('express');
const router = express.Router();
const { login, loginGiangVien, loginSinhVien, loginUser } = require('../controllers/authController');

router.post('/login', login);
router.post('/auth', loginUser);

// router.post("/gv/login", loginGiangVien);
// router.post("/sv/login", loginSinhVien);

module.exports = router;
