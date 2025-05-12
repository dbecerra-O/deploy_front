import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    try {
      const user = await login(username, password);
      
      // Redirección basada en roles
      if (user.roles.includes("admin") || user.roles.includes("moderator")) {
        navigate("/ordenes-compra");
      } else {
        navigate("/medicamentos");
      }
    } catch (error) {
      setMessage("Credenciales inválidas - Verifique usuario y contraseña" + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div>
        {/* Logo y título */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="auth-title">Farmacia Becerra</h1>
          <p className="auth-subtitle">Acceso al sistema</p>
        </div>

        {/* Tarjeta de login */}
        <div className="auth-card">
          <div className="card-body">
            {message && (
              <div className="form-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{display: 'inline-block', marginRight: '8px'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">Usuario</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    placeholder="Ingrese su nombre de usuario"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <label className="form-checkbox">
                    <input type="checkbox" /> Recordarme
                  </label>
                </div>
                <div>
                  <a href="#" className="text-primary">¿Olvidó su contraseña?</a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block"
              >
                {loading && <span className="spinner"></span>}
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
          
          <div className="card-footer" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="text-muted">¿Aún no tienes cuenta?</span>
            <a href="/register" className="btn btn-secondary">Registrarse</a>
          </div>
        </div>

        <div className="text-center mt-4 text-muted" style={{fontSize: '14px'}}>
          © {new Date().getFullYear()} Farmacia Becerra. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}