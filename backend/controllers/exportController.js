const asyncHandler = require("express-async-handler");
const ExcelJS = require("exceljs");
const Grade = require("../models/Grade");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Subject = require("../models/Subject");

// Category weights
const CATEGORY_WEIGHTS = {
  quizes: 0.2,
  tareas: 0.2,
  trabajo_clase: 0.1,
  exposicion: 0.05,
  comprension_lectura: 0.05,
  evaluacion_final: 0.4,
};

const CATEGORY_NAMES = {
  quizes: "Quizes",
  tareas: "Tareas",
  trabajo_clase: "Trabajo en Clase",
  exposicion: "Exposición",
  comprension_lectura: "Comprensión de Lectura",
  evaluacion_final: "Evaluación Final",
};

// Helper function to calculate category average
const calculateCategoryAverage = (grades) => {
  if (!grades || grades.length === 0) return null;
  const sum = grades.reduce((acc, g) => acc + g.score, 0);
  return sum / grades.length;
};

// Helper function to calculate trimester grade
const calculateTrimesterGrade = (trimesterGrades) => {
  let totalWeight = 0;
  let weightedSum = 0;

  Object.keys(CATEGORY_WEIGHTS).forEach((category) => {
    const grades = trimesterGrades[category] || [];
    const average = calculateCategoryAverage(grades);

    if (average !== null) {
      weightedSum += average * CATEGORY_WEIGHTS[category];
      totalWeight += CATEGORY_WEIGHTS[category];
    }
  });

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
};

// @desc    Export grades to Excel for a course/subject
// @route   GET /api/export/grades/:courseId/:subjectId
// @access  Private/Teacher
const exportGradesToExcel = asyncHandler(async (req, res) => {
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

  // Get course and subject info
  const course = await Course.findById(courseId);
  const subject = await Subject.findById(subjectId);

  // Get students
  const students = await Student.find({ course: courseId }).sort({
    fullName: 1,
  });

  // Get all grades
  const grades = await Grade.find({ assignment: assignment._id });

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "EduGrade Pro";
  workbook.created = new Date();

  // Create worksheet
  const worksheet = workbook.addWorksheet("Calificaciones");

  // Set column widths
  worksheet.columns = [
    { width: 30 }, // Estudiante
    { width: 12 }, // Trimestre 1
    { width: 12 }, // Trimestre 2
    { width: 12 }, // Trimestre 3
    { width: 12 }, // Final
  ];

  // Add title
  worksheet.mergeCells("A1:E1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Reporte de Calificaciones - ${course.name} - ${subject.name}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" },
  };
  titleCell.font = { ...titleCell.font, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).height = 30;

  // Add headers
  const headerRow = worksheet.getRow(3);
  headerRow.values = [
    "Estudiante",
    "Trimestre 1",
    "Trimestre 2",
    "Trimestre 3",
    "Calificación Final",
  ];
  headerRow.font = { bold: true, size: 12 };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9E1F2" },
  };
  headerRow.height = 25;

  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Process each student
  let currentRow = 4;
  students.forEach((student) => {
    // Get student grades
    const studentGrades = grades.filter(
      (g) => g.student.toString() === student._id.toString(),
    );

    // Group by trimester
    const groupedGrades = { 1: {}, 2: {}, 3: {} };
    studentGrades.forEach((grade) => {
      if (!groupedGrades[grade.trimester][grade.category]) {
        groupedGrades[grade.trimester][grade.category] = [];
      }
      groupedGrades[grade.trimester][grade.category].push(grade);
    });

    // Calculate trimester grades
    const t1 = calculateTrimesterGrade(groupedGrades[1]);
    const t2 = calculateTrimesterGrade(groupedGrades[2]);
    const t3 = calculateTrimesterGrade(groupedGrades[3]);

    // Calculate final grade
    const trimesterGrades = [t1, t2, t3].filter((g) => g !== null);
    const finalGrade =
      trimesterGrades.length > 0
        ? trimesterGrades.reduce((a, b) => a + b, 0) / trimesterGrades.length
        : null;

    // Add row
    const row = worksheet.getRow(currentRow);
    row.values = [
      student.fullName,
      t1 !== null ? t1.toFixed(2) : "-",
      t2 !== null ? t2.toFixed(2) : "-",
      t3 !== null ? t3.toFixed(2) : "-",
      finalGrade !== null ? finalGrade.toFixed(2) : "-",
    ];

    // Style the row
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

    // Add borders
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Color code final grade
    if (finalGrade !== null) {
      const finalCell = row.getCell(5);
      if (finalGrade >= 9) {
        finalCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC6EFCE" },
        }; // Green
      } else if (finalGrade >= 7) {
        finalCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFEB9C" },
        }; // Yellow
      } else if (finalGrade >= 6) {
        finalCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFC7CE" },
        }; // Light Red
      } else {
        finalCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF0000" },
        }; // Red
        finalCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      }
    }

    currentRow++;
  });

  // Add detailed breakdown for each student
  currentRow += 2;
  const detailTitleRow = worksheet.getRow(currentRow);
  worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
  const detailTitleCell = worksheet.getCell(`A${currentRow}`);
  detailTitleCell.value = "Desglose Detallado por Estudiante";
  detailTitleCell.font = { size: 14, bold: true };
  detailTitleCell.alignment = { horizontal: "center", vertical: "middle" };
  detailTitleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF70AD47" },
  };
  detailTitleCell.font = {
    ...detailTitleCell.font,
    color: { argb: "FFFFFFFF" },
  };
  worksheet.getRow(currentRow).height = 25;
  currentRow += 2;

  // Add detailed breakdown for each student
  students.forEach((student) => {
    // Student name header
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const studentNameCell = worksheet.getCell(`A${currentRow}`);
    studentNameCell.value = student.fullName;
    studentNameCell.font = { bold: true, size: 12 };
    studentNameCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE7E6E6" },
    };
    currentRow++;

    // Get student grades
    const studentGrades = grades.filter(
      (g) => g.student.toString() === student._id.toString(),
    );

    // Group by trimester
    const groupedGrades = { 1: {}, 2: {}, 3: {} };
    studentGrades.forEach((grade) => {
      if (!groupedGrades[grade.trimester][grade.category]) {
        groupedGrades[grade.trimester][grade.category] = [];
      }
      groupedGrades[grade.trimester][grade.category].push(grade);
    });

    // Add trimester headers
    const trimesterHeaderRow = worksheet.getRow(currentRow);
    trimesterHeaderRow.values = [
      "Categoría",
      "Trimestre 1",
      "Trimestre 2",
      "Trimestre 3",
      "Peso",
    ];
    trimesterHeaderRow.font = { bold: true };
    trimesterHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    currentRow++;

    // Add category rows
    Object.keys(CATEGORY_WEIGHTS).forEach((categoryKey) => {
      const row = worksheet.getRow(currentRow);
      const t1Avg = calculateCategoryAverage(groupedGrades[1][categoryKey]);
      const t2Avg = calculateCategoryAverage(groupedGrades[2][categoryKey]);
      const t3Avg = calculateCategoryAverage(groupedGrades[3][categoryKey]);

      row.values = [
        CATEGORY_NAMES[categoryKey],
        t1Avg !== null ? t1Avg.toFixed(2) : "-",
        t2Avg !== null ? t2Avg.toFixed(2) : "-",
        t3Avg !== null ? t3Avg.toFixed(2) : "-",
        `${(CATEGORY_WEIGHTS[categoryKey] * 100).toFixed(0)}%`,
      ];
      currentRow++;
    });

    currentRow += 1;
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Set headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Calificaciones_${course.name}_${subject.name}.xlsx`,
  );

  res.send(buffer);
});

module.exports = {
  exportGradesToExcel,
};
