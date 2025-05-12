import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    
    setMessage("");
    setLoading(true);
    
    try {
      await register(username, email, password);
      navigate("/login");
    } catch (error) {
      setMessage("Error al registrar el usuario: " + error.message);
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
          <p className="auth-subtitle">Crea tu cuenta</p>
        </div>

        {/* Tarjeta de registro */}
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

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">Nombre de usuario</label>
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
                    placeholder="Elige un nombre de usuario"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="tu@correo.com"
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
                    placeholder="Crea una contraseña segura"
                    required
                  />
                </div>
                <div className="password-strength">
                  <div className={`strength-bar ${password.length > 0 ? 'active' : ''} ${password.length >= 8 ? 'strong' : ''}`}></div>
                  <div className={`strength-bar ${password.length >= 4 ? 'active' : ''} ${password.length >= 10 ? 'strong' : ''}`}></div>
                  <div className={`strength-bar ${password.length >= 8 ? 'active' : ''} ${password.length >= 12 ? 'strong' : ''}`}></div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    placeholder="Repite tu contraseña"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-checkbox mt-3">
                  <input type="checkbox" required />
                  <span className="checkbox-text">Acepto los <a href="#" className="text-primary">términos y condiciones</a> y la <a href="#" className="text-primary">política de privacidad</a></span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success btn-block"
              >
                {loading && <span className="spinner"></span>}
                {loading ? "Procesando..." : "Crear cuenta"}
              </button>
            </form>
          </div>
          
          <div className="card-footer" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="text-muted">¿Ya tienes una cuenta?</span>
            <Link to="/login" className="btn btn-outline-primary">Iniciar sesión</Link>
          </div>
        </div>

        <div className="text-center mt-4 text-muted" style={{fontSize: '14px'}}>
          © {new Date().getFullYear()} Farmacia Becerra. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}