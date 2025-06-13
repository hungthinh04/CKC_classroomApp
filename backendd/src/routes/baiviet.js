const express = require('express');
const router = express.Router();

const {getBaiVietByLopHocPhan} = require('../controllers/baivietController')
const auth = require('../middleware/auth')

router.get('lophophan/:id/baiviet',auth,getBaiVietByLopHocPhan);

module.exports = router