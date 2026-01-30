const express = require("express");
const router = express.Router();
const { exportGradesToExcel } = require("../controllers/exportController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Export routes
router.get("/grades/:courseId/:subjectId", exportGradesToExcel);

module.exports = router;
