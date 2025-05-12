import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            {user ? `Bienvenido, ${user.username}` : "Farmacia Becerra"}
          </h1>
          <p className="hero-subtitle">
            {user ? 
              "Gestiona tus medicamentos y órdenes de compra de manera eficiente" : 
              "Nos complace ofrecer productos farmacéuticos de calidad y servicios especializados para tu bienestar"
            }
          </p>
          
          <div className="hero-buttons">
            {user ? (
              <>
                {(user.roles.includes('admin') || user.roles.includes('moderator')) && (
                  <button 
                    onClick={() => navigate('/ordenes-compra')}
                    className="btn btn-accent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Ver Órdenes de Compra
                  </button>
                )}
                <button 
                  onClick={() => navigate('/medicamentos')}
                  className="btn btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  Ver Medicamentos
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn btn-success"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Servicios section (visible solo para usuarios no logueados) */}
      {!user && (
        <section className="services-section">
          <div className="container">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">Descubre todo lo que podemos ofrecerte</p>
            
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon" style={{backgroundColor: '#e9f5ff'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="service-title">Atención 24/7</h3>
                <p className="service-description">Atención farmacéutica disponible en cualquier momento que lo necesites.</p>
                <button className="btn btn-outline-primary">Más información</button>
              </div>
              
              <div className="service-card">
                <div className="service-icon" style={{backgroundColor: '#f0fdf4'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
                    <line x1="12" y1="10" x2="12" y2="16"></line>
                    <line x1="9" y1="13" x2="15" y2="13"></line>
                  </svg>
                </div>
                <h3 className="service-title">Medicamentos</h3>
                <p className="service-description">Gran variedad de medicamentos de calidad a precios accesibles.</p>
                <button className="btn btn-outline-success">Explorar catálogo</button>
              </div>
              
              <div className="service-card">
                <div className="service-icon" style={{backgroundColor: '#fff1f2'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 className="service-title">Consultas</h3>
                <p className="service-description">Consultas farmacéuticas con profesionales capacitados.</p>
                <button className="btn btn-outline-danger">Agendar consulta</button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Sección de estadísticas para usuarios logueados */}
      {user && (
        <section className="dashboard-section">
          <div className="container">
            <h2 className="section-title">Panel de Control</h2>
            <p className="section-subtitle">Gestión de farmacia al alcance de tu mano</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Medicamentos</h3>
                  <p className="stat-value">152</p>
                  <p className="stat-description">en inventario</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Clientes</h3>
                  <p className="stat-value">84</p>
                  <p className="stat-description">registrados</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Ventas</h3>
                  <p className="stat-value">S/. 8,245</p>
                  <p className="stat-description">este mes</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer section */}
      <footer className="main-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Farmacia Becerra. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}