const express = require("express");
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  getMyClasses,
} = require("../controllers/assignmentController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, admin, getAssignments) // Only admin sees all? Or maybe listing for admin.
  .post(protect, admin, createAssignment);

router.route("/my-classes").get(protect, getMyClasses);

module.exports = router;
