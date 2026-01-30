const asyncHandler = require("express-async-handler");
const Student = require("../models/Student");

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  // Populate course details
  const students = await Student.find({}).populate(
    "course",
    "name academicYear",
  );
  res.json(students);
});

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const { studentId, fullName, course } = req.body;

  const student = new Student({
    studentId,
    fullName,
    course,
  });

  const createdStudent = await student.save();
  res.status(201).json(createdStudent);
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    await student.deleteOne();
    res.json({ message: "Student removed" });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

module.exports = { getStudents, createStudent, deleteStudent };
