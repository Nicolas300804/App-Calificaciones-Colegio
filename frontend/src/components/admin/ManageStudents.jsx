import { useState, useEffect } from "react";
import api from "../../api/axios";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    course: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students", formData);
      setShowModal(false);
      setFormData({ studentId: "", fullName: "", course: "" });
      fetchStudents();
    } catch (error) {
      alert("Error al crear estudiante");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este estudiante?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        alert("Error al eliminar estudiante");
      }
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold mb-0">Gestión de Estudiantes</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nuevo Estudiante
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">ID Estudiante</th>
                  <th className="fw-semibold">Nombre Completo</th>
                  <th className="fw-semibold">Curso</th>
                  <th className="fw-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="text-muted">{student.studentId}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.875rem",
                          }}
                        >
                          {student.fullName.charAt(0)}
                        </div>
                        <span className="fw-medium">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="text-muted">
                      {student.course?.name || "Sin asignar"}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay estudiantes registrados
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
                <h5 className="modal-title fw-bold">Nuevo Estudiante</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      ID Estudiante
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.studentId}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
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
                    Crear Estudiante
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

export default ManageStudents;
