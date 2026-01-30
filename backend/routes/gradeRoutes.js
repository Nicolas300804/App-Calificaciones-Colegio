const express = require("express");
const router = express.Router();
const {
  createGrade,
  getStudentGrades,
  updateGrade,
  deleteGrade,
  calculateFinalGrade,
} = require("../controllers/gradeController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Grade CRUD operations
router.post("/", createGrade);
router.get("/student/:studentId/assignment/:assignmentId", getStudentGrades);
router.put("/:gradeId", updateGrade);
router.delete("/:gradeId", deleteGrade);

// Calculation endpoint
router.get("/calculate/:studentId/:assignmentId", calculateFinalGrade);

module.exports = router;
