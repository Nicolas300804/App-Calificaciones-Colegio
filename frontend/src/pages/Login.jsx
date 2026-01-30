import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(username, password);
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/teacher");
      }
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            {/* Logo/Header */}
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold text-dark mb-2">EduGrade Pro</h1>
              <p className="text-muted">Sistema de Gestión Escolar</p>
            </div>

            {/* Login Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="card-title h4 fw-bold mb-4">Iniciar Sesión</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="form-label fw-semibold"
                    >
                      Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                  >
                    Ingresar
                  </button>
                </form>

                <div className="mt-4 pt-4 border-top">
                  <p className="text-center text-muted small mb-0">
                    <span className="fw-semibold">Demo:</span> admin/123 o
                    teacher1/123
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-muted small mt-4">
              © 2026 EduGrade Pro - Sistema de Calificaciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
