const asyncHandler = require("express-async-handler");
const Subject = require("../models/Subject");

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({});
  res.json(subjects);
});

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const subject = new Subject({
    name,
    description,
  });

  const createdSubject = await subject.save();
  res.status(201).json(createdSubject);
});

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (subject) {
    await subject.deleteOne();
    res.json({ message: "Subject removed" });
  } else {
    res.status(404);
    throw new Error("Subject not found");
  }
});

module.exports = { getSubjects, createSubject, deleteSubject };
