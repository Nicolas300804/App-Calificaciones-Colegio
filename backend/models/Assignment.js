const mongoose = require("mongoose");

const assignmentSchema = mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    schedule: [
      {
        day: { type: String, required: true }, // e.g., "Monday"
        startTime: { type: String, required: true }, // e.g., "08:00"
        endTime: { type: String, required: true }, // e.g., "10:00"
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
