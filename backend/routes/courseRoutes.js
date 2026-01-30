const express = require("express");
const router = express.Router();
const {
  getCourses,
  createCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, getCourses).post(protect, admin, createCourse);

router.route("/:id").delete(protect, admin, deleteCourse);

module.exports = router;
