// routes/file.js
const express = require("express");
const router = express.Router();
const multer = require("../utils/multer");
const controller = require("../controllers/fileController");

router.post("/upload", multer.single("file"), controller.uploadFileBaiViet);

module.exports = router;
