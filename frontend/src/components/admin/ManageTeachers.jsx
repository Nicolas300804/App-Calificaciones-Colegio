import { useState, useEffect } from "react";
import api from "../../api/axios";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/users");
      const teachersList = data.filter((u) => u.role === "teacher");
      setTeachers(teachersList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { ...formData, role: "teacher" });
      setShowModal(false);
      setFormData({ username: "", password: "", fullName: "", email: "" });
      fetchTeachers();
    } catch (error) {
      alert("Error al crear profesor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este profesor?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchTeachers();
      } catch (error) {
        alert("Error al eliminar profesor");
      }
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 fw-bold mb-0">Gestión de Profesores</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Profesor
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">Nombre Completo</th>
                  <th className="fw-semibold">Usuario</th>
                  <th className="fw-semibold">Email</th>
                  <th className="fw-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.875rem",
                          }}
                        >
                          {teacher.fullName?.charAt(0) || "T"}
                        </div>
                        <span className="fw-medium">{teacher.fullName}</span>
                      </div>
                    </td>
                    <td className="text-muted">{teacher.username}</td>
                    <td className="text-muted">{teacher.email || "-"}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(teacher._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay profesores registrados
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
                <h5 className="modal-title fw-bold">Nuevo Profesor</h5>
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
                    <label className="form-label fw-semibold">Usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
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
                    Crear Profesor
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

export default ManageTeachers;
