const mongoose = require("mongoose");

const gradeSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    trimester: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "quizes",
        "tareas",
        "trabajo_clase",
        "exposicion",
        "comprension_lectura",
        "evaluacion_final",
      ],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    description: {
      type: String,
      // Optional: "Quiz 1", "Tarea 2", etc.
    },
    comments: {
      type: String,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Teacher who recorded it
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
gradeSchema.index({ student: 1, assignment: 1, trimester: 1 });

const Grade = mongoose.model("Grade", gradeSchema);
module.exports = Grade;
