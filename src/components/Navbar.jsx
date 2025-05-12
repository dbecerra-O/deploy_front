import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Farmacia Becerra
        </Link>

        <button className="navbar-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            : 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          {!user ? (
            <>
              <Link to="/login" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {(user.roles.includes("ROLE_ADMIN") || user.roles.includes("moderator")) && (
                <Link to="/ordenes-compra" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                  Órdenes de Compra
                </Link>
              )}
              <Link to="/medicamentos" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                Medicamentos
              </Link>
              
              <div className="navbar-user">
                <span className="navbar-user-name">{user.username}</span>
                <button 
                  onClick={handleLogout} 
                  className="navbar-user-logout"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}