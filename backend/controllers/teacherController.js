const asyncHandler = require("express-async-handler");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");
const Grade = require("../models/Grade");

// @desc    Get distinct courses assigned to teacher
// @route   GET /api/teacher/my-courses
// @access  Private/Teacher
const getMyCourses = asyncHandler(async (req, res) => {
  // Find all assignments for this teacher
  const assignments = await Assignment.find({ teacher: req.user._id }).populate(
    "course",
    "name academicYear",
  );

  // Extract unique courses
  const coursesMap = new Map();
  assignments.forEach((a) => {
    if (a.course) {
      coursesMap.set(a.course._id.toString(), a.course);
    }
  });

  const courses = Array.from(coursesMap.values());
  res.json(courses);
});

// @desc    Get subjects for a specific course assigned to teacher
// @route   GET /api/teacher/my-courses/:courseId/subjects
// @access  Private/Teacher
const getMySubjectsInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const assignments = await Assignment.find({
    teacher: req.user._id,
    course: courseId,
  }).populate("subject", "name description");

  const subjectsMap = new Map();
  assignments.forEach((a) => {
    if (a.subject) {
      subjectsMap.set(a.subject._id.toString(), a.subject);
    }
  });

  const subjects = Array.from(subjectsMap.values());
  res.json(subjects);
});

// @desc    Get students in a course for a subject (with grades)
// @route   GET /api/teacher/my-classes/:courseId/:subjectId/students
// @access  Private/Teacher
const getStudentsForGrading = asyncHandler(async (req, res) => {
  const { courseId, subjectId } = req.params;

  // Verify assignment exists
  const assignment = await Assignment.findOne({
    teacher: req.user._id,
    course: courseId,
    subject: subjectId,
  });

  if (!assignment) {
    res.status(401);
    throw new Error("Not authorized for this class");
  }

  // Get students in the course
  const students = await Student.find({ course: courseId });

  // Get all grades for this assignment
  const grades = await Grade.find({ assignment: assignment._id });

  // Map grades to students
  const studentsWithGrades = students.map((student) => {
    // Get all grades for this student
    const studentGrades = grades.filter(
      (g) => g.student.toString() === student._id.toString(),
    );

    // Group by trimester and category
    const groupedGrades = {
      1: {},
      2: {},
      3: {},
    };

    studentGrades.forEach((grade) => {
      if (!groupedGrades[grade.trimester][grade.category]) {
        groupedGrades[grade.trimester][grade.category] = [];
      }
      groupedGrades[grade.trimester][grade.category].push({
        _id: grade._id,
        score: grade.score,
        description: grade.description,
        comments: grade.comments,
        createdAt: grade.createdAt,
      });
    });

    return {
      ...student.toObject(),
      grades: groupedGrades,
    };
  });

  res.json({
    assignmentId: assignment._id,
    students: studentsWithGrades,
  });
});

module.exports = { getMyCourses, getMySubjectsInCourse, getStudentsForGrading };
