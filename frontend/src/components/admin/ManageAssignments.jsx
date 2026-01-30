import { useState, useEffect } from "react";
import api from "../../api/axios";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    teacher: "",
    subject: "",
    course: "",
  });

  useEffect(() => {
    fetchAssignments();
    fetchTeachers();
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get("/assignments");
      setAssignments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/users");
      const teachersList = data.filter((u) => u.role === "teacher");
      setTeachers(teachersList);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/assignments", formData);
      setShowModal(false);
      setFormData({ teacher: "", subject: "", course: "" });
      fetchAssignments();
    } catch (error) {
      alert("Error al crear asignación");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta asignación?")) {
      try {
        await api.delete(`/assignments/${id}`);
        fetchAssignments();
      } catch (error) {
        alert("Error al eliminar asignación");
      }
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold mb-0">Gestión de Asignaciones</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nueva Asignación
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">Profesor</th>
                  <th className="fw-semibold">Materia</th>
                  <th className="fw-semibold">Curso</th>
                  <th className="fw-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="fw-medium">
                      {assignment.teacher?.fullName || "Sin asignar"}
                    </td>
                    <td className="text-muted">
                      {assignment.subject?.name || "Sin asignar"}
                    </td>
                    <td className="text-muted">
                      {assignment.course?.name || "Sin asignar"}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay asignaciones registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Nueva Asignación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Profesor</label>
                    <select
                      className="form-select"
                      value={formData.teacher}
                      onChange={(e) =>
                        setFormData({ ...formData, teacher: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccionar profesor</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Materia</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccionar materia</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Curso</label>
                    <select
                      className="form-select"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccionar curso</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.name} - {course.academicYear}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Asignación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssignments;
