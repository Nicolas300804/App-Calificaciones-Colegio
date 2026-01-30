import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import GradeCategory from "../components/GradeCategory";

const CATEGORY_CONFIG = {
  quizes: { name: "Quizes", weight: 20, maxGrades: 10 },
  tareas: { name: "Tareas", weight: 20, maxGrades: 10 },
  trabajo_clase: { name: "Trabajo en Clase", weight: 10, maxGrades: 10 },
  exposicion: { name: "Exposición", weight: 5, maxGrades: 10 },
  comprension_lectura: {
    name: "Comprensión de Lectura",
    weight: 5,
    maxGrades: 10,
  },
  evaluacion_final: { name: "Evaluación Final", weight: 40, maxGrades: 1 },
};

const CATEGORY_WEIGHTS = {
  quizes: 0.2,
  tareas: 0.2,
  trabajo_clase: 0.1,
  exposicion: 0.05,
  comprension_lectura: 0.05,
  evaluacion_final: 0.4,
};

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedTrimester, setSelectedTrimester] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const { data } = await api.get("/teacher/my-courses");
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setSelectedSubject(null);
    setStudents([]);
    setSelectedStudent(null);
    try {
      const { data } = await api.get(
        `/teacher/my-courses/${course._id}/subjects`,
      );
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setSelectedStudent(null);
    await fetchStudents(subject._id);
  };

  const fetchStudents = async (subjectId) => {
    try {
      const { data } = await api.get(
        `/teacher/my-classes/${selectedCourse._id}/${subjectId}/students`,
      );

      if (!data || !data.students) {
        console.error("Invalid API response:", data);
        setStudents([]);
        setAssignmentId(null);
        return;
      }

      setStudents(data.students);
      setAssignmentId(data.assignmentId);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setAssignmentId(null);
    }
  };

  const handleGradeUpdate = () => {
    // Refresh students data
    if (selectedSubject) {
      fetchStudents(selectedSubject._id);
    }
  };

  const calculateCategoryAverage = (grades) => {
    if (!grades || grades.length === 0) return null;
    const sum = grades.reduce((acc, g) => acc + g.score, 0);
    return sum / grades.length;
  };

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

  const calculateFinalGrade = (studentGrades) => {
    const trimesterGrades = [1, 2, 3]
      .map((t) => calculateTrimesterGrade(studentGrades[t]))
      .filter((g) => g !== null);

    if (trimesterGrades.length === 0) return null;
    return trimesterGrades.reduce((a, b) => a + b, 0) / trimesterGrades.length;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get(
        `/export/grades/${selectedCourse._id}/${selectedSubject._id}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Calificaciones_${selectedCourse.name}_${selectedSubject.name}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting excel:", error);
      alert("Error al descargar el archivo Excel");
    }
  };

  const currentStudent = students.find((s) => s._id === selectedStudent);
  const trimesterGrade = currentStudent
    ? calculateTrimesterGrade(currentStudent.grades[selectedTrimester])
    : null;
  const finalGrade = currentStudent
    ? calculateFinalGrade(currentStudent.grades)
    : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Horizontal Navigation */}
      <div className="horizontal-nav">
        <div className="nav-brand">EduGrade Pro</div>

        <div className="nav-items">
          {!selectedCourse &&
            courses.map((course) => (
              <div
                key={course._id}
                className="nav-item"
                onClick={() => handleCourseSelect(course)}
              >
                📚 {course.name}
              </div>
            ))}

          {selectedCourse && (
            <>
              <div
                className="nav-item"
                onClick={() => {
                  setSelectedCourse(null);
                  setSelectedSubject(null);
                  setStudents([]);
                  setSelectedStudent(null);
                }}
              >
                ← Mis Cursos
              </div>
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className={`nav-item ${selectedSubject?._id === subject._id ? "active" : ""}`}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  {subject.name}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-500">Profesor</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {!selectedCourse && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Mis Cursos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseSelect(course)}
                  className="info-card cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Año Académico: {course.academicYear}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && students.length > 0 && (
          <div>
            <div className="app-header">
              <div>
                <h1 className="page-title">
                  Calificaciones - {selectedSubject.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCourse.name} - {selectedCourse.academicYear}
                </p>
              </div>
              <button onClick={handleExportExcel} className="btn-primary">
                📊 Descargar Excel
              </button>
            </div>

            {/* Trimester Tabs */}
            <div className="nav-tabs">
              {[1, 2, 3].map((trimester) => (
                <button
                  key={trimester}
                  className={`nav-tab ${selectedTrimester === trimester ? "active" : ""}`}
                  onClick={() => setSelectedTrimester(trimester)}
                >
                  Trimestre {trimester}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Student Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Estudiante
                </label>
                <select
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStudent || ""}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">-- Selecciona un estudiante --</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Entry for Selected Student */}
              {currentStudent && (
                <div className="student-card">
                  <div className="student-card-header">
                    <div className="student-avatar">
                      {currentStudent.fullName.charAt(0)}
                    </div>
                    <h3>{currentStudent.fullName}</h3>
                  </div>

                  {/* Grade Categories */}
                  <div className="space-y-3">
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <GradeCategory
                        key={key}
                        categoryKey={key}
                        categoryName={config.name}
                        weight={config.weight}
                        maxGrades={config.maxGrades}
                        grades={
                          currentStudent.grades[selectedTrimester][key] || []
                        }
                        studentId={currentStudent._id}
                        assignmentId={assignmentId}
                        trimester={selectedTrimester}
                        onGradeUpdate={handleGradeUpdate}
                      />
                    ))}
                  </div>

                  {/* Trimester Summary */}
                  {trimesterGrade !== null && (
                    <div className="trimester-summary">
                      <h4>Calificación del Trimestre {selectedTrimester}</h4>
                      <p className="grade-value">{trimesterGrade.toFixed(2)}</p>
                    </div>
                  )}

                  {/* Final Grade */}
                  {finalGrade !== null && (
                    <div className="final-grade-display">
                      <h3>Calificación Final del Curso</h3>
                      <p className="grade-value">{finalGrade.toFixed(2)}</p>
                      <p className="text-sm mt-2 opacity-90">
                        Promedio de los 3 trimestres
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!selectedStudent && (
                <div className="text-center py-12 text-gray-500">
                  Selecciona un estudiante para ver y editar sus calificaciones
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCourse && !selectedSubject && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Selecciona una materia de la barra de navegación superior
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
