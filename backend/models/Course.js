const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    // We can allow virtual population of students or keep an array if needed,
    // but usually referencing Course in Student is cleaner.
    // Plan said: student_ids array. I'll stick to the plan but maybe optional.
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
