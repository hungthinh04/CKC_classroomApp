const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/thongke", adminController.getDashboardSummary);

module.exports = router;
