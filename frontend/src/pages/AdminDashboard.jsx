import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ManageTeachers from "../components/admin/ManageTeachers";
import ManageStudents from "../components/admin/ManageStudents";
import ManageCourses from "../components/admin/ManageCourses";
import ManageSubjects from "../components/admin/ManageSubjects";
import ManageAssignments from "../components/admin/ManageAssignments";

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Horizontal Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold fs-4 mb-0">EduGrade Pro</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/admin") && location.pathname === "/admin" ? "active fw-semibold" : ""}`}
                  onClick={() => navigate("/admin")}
                  style={{ cursor: "pointer" }}
                >
                  📊 Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/admin/teachers") ? "active fw-semibold" : ""}`}
                  onClick={() => navigate("/admin/teachers")}
                  style={{ cursor: "pointer" }}
                >
                  👨‍🏫 Profesores
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/admin/students") ? "active fw-semibold" : ""}`}
                  onClick={() => navigate("/admin/students")}
                  style={{ cursor: "pointer" }}
                >
                  👨‍🎓 Estudiantes
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/admin/courses") ? "active fw-semibold" : ""}`}
                  onClick={() => navigate("/admin/courses")}
                  style={{ cursor: "pointer" }}
                >
                  📚 Cursos
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/admin/subjects") ? "active fw-semibold" : ""}`}
                  onClick={() => navigate("/admin/subjects")}
                  style={{ cursor: "pointer" }}
                >
                  📖 Materias
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/admin/assignments") ? "active fw-semibold" : ""}`}
                  onClick={() => navigate("/admin/assignments")}
                  style={{ cursor: "pointer" }}
                >
                  🔗 Asignaciones
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-semibold small">{user?.fullName}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Administrador
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline-secondary btn-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto bg-light">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container-fluid p-4">
                <h2 className="h3 fw-bold mb-4">Dashboard</h2>
                <div className="row g-4">
                  <div className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow"
                      onClick={() => navigate("/admin/teachers")}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-semibold mb-0">
                            Profesores
                          </h5>
                          <span style={{ fontSize: "2rem" }}>👨‍🏫</span>
                        </div>
                        <p className="card-text text-muted small">
                          Gestiona el personal docente
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow"
                      onClick={() => navigate("/admin/students")}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-semibold mb-0">
                            Estudiantes
                          </h5>
                          <span style={{ fontSize: "2rem" }}>👨‍🎓</span>
                        </div>
                        <p className="card-text text-muted small">
                          Administra el registro estudiantil
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow"
                      onClick={() => navigate("/admin/courses")}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-semibold mb-0">
                            Cursos
                          </h5>
                          <span style={{ fontSize: "2rem" }}>📚</span>
                        </div>
                        <p className="card-text text-muted small">
                          Organiza los grupos académicos
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow"
                      onClick={() => navigate("/admin/subjects")}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-semibold mb-0">
                            Materias
                          </h5>
                          <span style={{ fontSize: "2rem" }}>📖</span>
                        </div>
                        <p className="card-text text-muted small">
                          Define las asignaturas del plan
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow"
                      onClick={() => navigate("/admin/assignments")}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-semibold mb-0">
                            Asignaciones
                          </h5>
                          <span style={{ fontSize: "2rem" }}>🔗</span>
                        </div>
                        <p className="card-text text-muted small">
                          Vincula profesores con clases
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="card-title fw-semibold mb-0">
                            Calificaciones
                          </h5>
                          <span style={{ fontSize: "2rem" }}>📊</span>
                        </div>
                        <p className="card-text text-muted small">
                          Monitorea el rendimiento académico
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/teachers" element={<ManageTeachers />} />
          <Route path="/students" element={<ManageStudents />} />
          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/subjects" element={<ManageSubjects />} />
          <Route path="/assignments" element={<ManageAssignments />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
