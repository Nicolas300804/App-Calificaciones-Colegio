const asyncHandler = require("express-async-handler");
const Assignment = require("../models/Assignment");

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({})
    .populate("teacher", "fullName")
    .populate("subject", "name")
    .populate("course", "name");
  res.json(assignments);
});

// @desc    Create an assignment (Assign teacher to subject/course)
// @route   POST /api/assignments
// @access  Private/Admin
const createAssignment = asyncHandler(async (req, res) => {
  const { teacher, subject, course, schedule } = req.body;

  const assignment = new Assignment({
    teacher,
    subject,
    course,
    schedule,
  });

  const createdAssignment = await assignment.save();
  res.status(201).json(createdAssignment);
});

// @desc    Get assignments for logged in teacher (My Schedule/Classes)
// @route   GET /api/assignments/my-classes
// @access  Private/Teacher
const getMyClasses = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ teacher: req.user._id })
    .populate("subject", "name")
    .populate("course", "name");
  res.json(assignments);
});

module.exports = { getAssignments, createAssignment, getMyClasses };
