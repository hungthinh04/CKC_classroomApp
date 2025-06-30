const express = require('express');
const router = express.Router();
const controller = require('../controllers/sinhvienController');

// Dùng GET cho phép gọi từ URL query (?maLHP=...)
// router.get('/', controller.getSinhVienByLHP);

module.exports = router;
