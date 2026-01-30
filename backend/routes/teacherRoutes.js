const express = require("express");
const router = express.Router();
const {
  getMyCourses,
  getMySubjectsInCourse,
  getStudentsForGrading,
} = require("../controllers/teacherController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my-courses", protect, getMyCourses);
router.get("/my-courses/:courseId/subjects", protect, getMySubjectsInCourse);
router.get(
  "/my-classes/:courseId/:subjectId/students",
  protect,
  getStudentsForGrading,
);

module.exports = router;
