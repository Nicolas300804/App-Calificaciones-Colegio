const asyncHandler = require("express-async-handler");
const Grade = require("../models/Grade");
const Assignment = require("../models/Assignment");

// Category weights for calculation
const CATEGORY_WEIGHTS = {
  quizes: 0.2,
  tareas: 0.2,
  trabajo_clase: 0.1,
  exposicion: 0.05,
  comprension_lectura: 0.05,
  evaluacion_final: 0.4,
};

// @desc    Create a new grade
// @route   POST /api/grades
// @access  Private/Teacher
const createGrade = asyncHandler(async (req, res) => {
  const {
    student,
    assignment,
    trimester,
    category,
    score,
    description,
    comments,
  } = req.body;

  // Verify the teacher is assigned to this class
  const assignmentDoc = await Assignment.findById(assignment);
  if (!assignmentDoc) {
    res.status(404);
    throw new Error("Assignment not found");
  }

  if (assignmentDoc.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to grade this class");
  }

  // For evaluacion_final, check if one already exists
  if (category === "evaluacion_final") {
    const existing = await Grade.findOne({
      student,
      assignment,
      trimester,
      category: "evaluacion_final",
    });

    if (existing) {
      res.status(400);
      throw new Error("Evaluación Final already exists for this trimester");
    }
  }

  const grade = await Grade.create({
    student,
    assignment,
    trimester,
    category,
    score,
    description,
    comments,
    recordedBy: req.user._id,
  });

  res.status(201).json(grade);
});

// @desc    Get all grades for a student in an assignment
// @route   GET /api/grades/student/:studentId/assignment/:assignmentId
// @access  Private
const getStudentGrades = asyncHandler(async (req, res) => {
  const { studentId, assignmentId } = req.params;

  const grades = await Grade.find({
    student: studentId,
    assignment: assignmentId,
  }).sort({ trimester: 1, category: 1, createdAt: 1 });

  // Group by trimester and category
  const groupedGrades = {
    1: {},
    2: {},
    3: {},
  };

  grades.forEach((grade) => {
    if (!groupedGrades[grade.trimester][grade.category]) {
      groupedGrades[grade.trimester][grade.category] = [];
    }
    groupedGrades[grade.trimester][grade.category].push(grade);
  });

  res.json({
    grades: groupedGrades,
    calculations: {
      trimester1: calculateTrimesterGrade(groupedGrades[1]),
      trimester2: calculateTrimesterGrade(groupedGrades[2]),
      trimester3: calculateTrimesterGrade(groupedGrades[3]),
    },
  });
});

// @desc    Update a grade
// @route   PUT /api/grades/:gradeId
// @access  Private/Teacher
const updateGrade = asyncHandler(async (req, res) => {
  const { gradeId } = req.params;
  const { score, description, comments } = req.body;

  const grade = await Grade.findById(gradeId).populate("assignment");

  if (!grade) {
    res.status(404);
    throw new Error("Grade not found");
  }

  // Verify teacher authorization
  if (grade.assignment.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this grade");
  }

  grade.score = score !== undefined ? score : grade.score;
  grade.description =
    description !== undefined ? description : grade.description;
  grade.comments = comments !== undefined ? comments : grade.comments;

  const updatedGrade = await grade.save();
  res.json(updatedGrade);
});

// @desc    Delete a grade
// @route   DELETE /api/grades/:gradeId
// @access  Private/Teacher
const deleteGrade = asyncHandler(async (req, res) => {
  const { gradeId } = req.params;

  const grade = await Grade.findById(gradeId).populate("assignment");

  if (!grade) {
    res.status(404);
    throw new Error("Grade not found");
  }

  // Verify teacher authorization
  if (grade.assignment.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this grade");
  }

  await grade.deleteOne();
  res.json({ message: "Grade deleted successfully" });
});

// Helper function to calculate category average
const calculateCategoryAverage = (grades) => {
  if (!grades || grades.length === 0) return null;
  const sum = grades.reduce((acc, grade) => acc + grade.score, 0);
  return sum / grades.length;
};

// Helper function to calculate trimester grade
const calculateTrimesterGrade = (trimesterGrades) => {
  const categoryAverages = {};
  let totalWeight = 0;
  let weightedSum = 0;

  // Calculate average for each category
  Object.keys(CATEGORY_WEIGHTS).forEach((category) => {
    const grades = trimesterGrades[category] || [];
    const average = calculateCategoryAverage(grades);

    if (average !== null) {
      categoryAverages[category] = average;
      weightedSum += average * CATEGORY_WEIGHTS[category];
      totalWeight += CATEGORY_WEIGHTS[category];
    }
  });

  // If no grades, return null
  if (totalWeight === 0) return null;

  // Return weighted average (normalized if not all categories have grades)
  return {
    grade: weightedSum / totalWeight,
    categoryAverages,
    completionPercentage: (totalWeight / 1.0) * 100,
  };
};

// @desc    Calculate final course grade
// @route   GET /api/grades/calculate/:studentId/:assignmentId
// @access  Private
const calculateFinalGrade = asyncHandler(async (req, res) => {
  const { studentId, assignmentId } = req.params;

  const grades = await Grade.find({
    student: studentId,
    assignment: assignmentId,
  });

  // Group by trimester
  const groupedGrades = {
    1: {},
    2: {},
    3: {},
  };

  grades.forEach((grade) => {
    if (!groupedGrades[grade.trimester][grade.category]) {
      groupedGrades[grade.trimester][grade.category] = [];
    }
    groupedGrades[grade.trimester][grade.category].push(grade);
  });

  // Calculate each trimester
  const trimester1 = calculateTrimesterGrade(groupedGrades[1]);
  const trimester2 = calculateTrimesterGrade(groupedGrades[2]);
  const trimester3 = calculateTrimesterGrade(groupedGrades[3]);

  // Calculate final grade (average of trimesters)
  const trimesterGrades = [trimester1, trimester2, trimester3]
    .filter((t) => t !== null)
    .map((t) => t.grade);

  const finalGrade =
    trimesterGrades.length > 0
      ? trimesterGrades.reduce((a, b) => a + b, 0) / trimesterGrades.length
      : null;

  res.json({
    trimester1,
    trimester2,
    trimester3,
    finalGrade,
  });
});

module.exports = {
  createGrade,
  getStudentGrades,
  updateGrade,
  deleteGrade,
  calculateFinalGrade,
};
