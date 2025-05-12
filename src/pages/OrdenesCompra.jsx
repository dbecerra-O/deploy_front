// src/pages/OrdenesCompraPage.jsx
import { useEffect, useState } from "react";
import { getOrdenesCompra } from "../services/ordenCompraService";

const OrdenesCompraPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todas");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [showStats, setShowStats] = useState(true);
  const [groupByDate, setGroupByDate] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Estadísticas calculadas
  const [stats, setStats] = useState({
    totalOrdenes: 0,
    totalMonto: 0,
    totalProductos: 0,
    ordenesHoy: 0,
    montoHoy: 0,
    ordenesEstaSemana: 0,
    usuariosMasFrecuentes: [],
    medicamentosMasVendidos: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrdenesCompra();
        setOrdenes(data);
        setFilteredOrdenes(sortOrders(data, sortConfig.key, sortConfig.direction));
        calculateStats(data);
      } catch (err) {
        setError("No tienes permiso para ver estas órdenes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcular estadísticas
  const calculateStats = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    lastWeekDate.setHours(0, 0, 0, 0);
    
    const ordenesHoy = data.filter(orden => new Date(orden.createdAt) >= today);
    const ordenesEstaSemana = data.filter(orden => new Date(orden.createdAt) >= lastWeekDate);
    
    // Usuarios más frecuentes
    const userCounts = {};
    data.forEach(orden => {
      const username = orden.user?.username || "Desconocido";
      userCounts[username] = (userCounts[username] || 0) + 1;
    });
    
    // Medicamentos más vendidos
    const medCounts = {};
    data.forEach(orden => {
      const medName = orden.medicamento?.descripcionMed || "Desconocido";
      const cantidad = orden.cantidad || 0;
      medCounts[medName] = (medCounts[medName] || 0) + cantidad;
    });
    
    // Ordenar y limitar a los 3 principales
    const topUsers = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
      
    const topMeds = Object.entries(medCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    setStats({
      totalOrdenes: data.length,
      totalMonto: data.reduce((sum, orden) => sum + (orden.montouni || 0), 0),
      totalProductos: data.reduce((sum, orden) => sum + (orden.cantidad || 0), 0),
      ordenesHoy: ordenesHoy.length,
      montoHoy: ordenesHoy.reduce((sum, orden) => sum + (orden.montouni || 0), 0),
      ordenesEstaSemana: ordenesEstaSemana.length,
      usuariosMasFrecuentes: topUsers,
      medicamentosMasVendidos: topMeds
    });
  };

  // Función para ordenar
  const sortOrders = (orders, key, direction) => {
    return [...orders].sort((a, b) => {
      if (key === 'createdAt') {
        return direction === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      if (key === 'montouni' || key === 'precio' || key === 'cantidad') {
        return direction === 'asc' 
          ? (a[key] || 0) - (b[key] || 0)
          : (b[key] || 0) - (a[key] || 0);
      }
      
      // Para campos de texto
      const aValue = a[key] || '';
      const bValue = b[key] || '';
      
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  // Manejar cambio de ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    setFilteredOrdenes(sortOrders(filteredOrdenes, key, direction));
  };

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let result = [...ordenes];
    
    // Filtrar por período
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    lastWeekDate.setHours(0, 0, 0, 0);
    
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    lastMonthDate.setHours(0, 0, 0, 0);
    
    if (selectedFilter === 'hoy') {
      result = result.filter(orden => new Date(orden.createdAt) >= today);
    } else if (selectedFilter === 'ayer') {
      result = result.filter(orden => new Date(orden.createdAt) >= yesterday && new Date(orden.createdAt) < today);
    } else if (selectedFilter === 'semana') {
      result = result.filter(orden => new Date(orden.createdAt) >= lastWeekDate);
    } else if (selectedFilter === 'mes') {
      result = result.filter(orden => new Date(orden.createdAt) >= lastMonthDate);
    }
    
    // Aplicar búsqueda
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(orden => 
        (orden.descripcion && orden.descripcion.toLowerCase().includes(searchLower)) ||
        (orden.medicamento?.descripcionMed && orden.medicamento.descripcionMed.toLowerCase().includes(searchLower)) ||
        (orden.user?.username && orden.user.username.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar ordenamiento
    result = sortOrders(result, sortConfig.key, sortConfig.direction);
    
    setFilteredOrdenes(result);
  }, [searchTerm, selectedFilter, ordenes, sortConfig]);

  // Agrupar ordenes por fecha
  const groupOrdersByDate = () => {
    const grouped = {};
    
    filteredOrdenes.forEach(orden => {
      const date = new Date(orden.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(orden);
    });
    
    // Ordenar las fechas
    return Object.entries(grouped).sort((a, b) => {
      const dateA = new Date(a[0].split('/').reverse().join('/'));
      const dateB = new Date(b[0].split('/').reverse().join('/'));
      return sortConfig.key === 'createdAt' && sortConfig.direction === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    });
  };

  // Ver detalles de una orden
  const showOrderDetails = (orden) => {
    setSelectedOrden(orden);
    setModalVisible(true);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Formatear monto en moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', { 
      style: 'currency', 
      currency: 'PEN'
    }).format(amount);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-large"></div>
      <p>Cargando órdenes de compra...</p>
    </div>
  );

  const groupedOrders = groupByDate ? groupOrdersByDate() : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Órdenes de Compra</h1>
          <p className="page-subtitle">Gestiona y monitorea las órdenes realizadas</p>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError("")} className="alert-close">×</button>
          </div>
        )}

        {/* Dashboard de estadísticas */}
        {showStats && (
          <div className="stats-dashboard">
            <div className="stats-header">
              <h2>Resumen</h2>
              <button 
                className="btn btn-icon btn-sm" 
                onClick={() => setShowStats(false)}
                title="Ocultar estadísticas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Órdenes</h3>
                  <p className="stat-value">{stats.totalOrdenes}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Monto Total</h3>
                  <p className="stat-value">{formatCurrency(stats.totalMonto)}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Productos Vendidos</h3>
                  <p className="stat-value">{stats.totalProductos}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Órdenes Hoy</h3>
                  <p className="stat-value">{stats.ordenesHoy}</p>
                  <p className="stat-description">{formatCurrency(stats.montoHoy)}</p>
                </div>
              </div>
            </div>
            
            <div className="stats-details">
              <div className="top-items">
                <h3>Medicamentos más vendidos</h3>
                <ul className="ranking-list">
                  {stats.medicamentosMasVendidos.map((med, index) => (
                    <li key={index}>
                      <span className="rank">{index + 1}</span>
                      <span className="name">{med.name}</span>
                      <span className="value">{med.count} unidades</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="top-items">
                <h3>Usuarios más frecuentes</h3>
                <ul className="ranking-list">
                  {stats.usuariosMasFrecuentes.map((user, index) => (
                    <li key={index}>
                      <span className="rank">{index + 1}</span>
                      <span className="name">{user.name}</span>
                      <span className="value">{user.count} órdenes</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {!showStats && (
          <button 
            className="btn btn-outline-primary mb-4" 
            onClick={() => setShowStats(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="btn-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Mostrar Estadísticas
          </button>
        )}

        {/* Controles de filtrado y búsqueda */}
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por medicamento, usuario o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="search-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="filter-controls">
            <select 
              className="filter-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="todas">Todas las órdenes</option>
              <option value="hoy">Hoy</option>
              <option value="ayer">Ayer</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
            
            <label className="toggle-container">
              <input 
                type="checkbox" 
                checked={groupByDate}
                onChange={() => setGroupByDate(!groupByDate)}
              />
              <span className="toggle-label">Agrupar por fecha</span>
            </label>
          </div>
        </div>
        
        <div className="table-info">
          Mostrando {filteredOrdenes.length} de {ordenes.length} órdenes
        </div>

        {/* Vista agrupada por fecha */}
        {groupByDate ? (
          <div className="orders-by-date">
            {groupedOrders.length > 0 ? (
              groupedOrders.map(([date, orders]) => (
                <div key={date} className="date-group">
                  <div className="date-header">
                    <h3>{formatDate(date)}</h3>
                    <span className="date-count">{orders.length} órdenes</span>
                  </div>
                  
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('descripcion')} className="sortable-header">
                            Descripción
                            {sortConfig.key === 'descripcion' && (
                              <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </th>
                          <th onClick={() => handleSort('cantidad')} className="sortable-header">
                            Cantidad
                            {sortConfig.key === 'cantidad' && (
                              <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </th>
                          <th onClick={() => handleSort('precio')} className="sortable-header">
                            Precio Unit.
                            {sortConfig.key === 'precio' && (
                              <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </th>
                          <th onClick={() => handleSort('montouni')} className="sortable-header">
                            Total
                            {sortConfig.key === 'montouni' && (
                              <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </th>
                          <th>Medicamento</th>
                          <th>Usuario</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((orden) => (
                          <tr key={orden.id}>
                            <td>{orden.descripcion || 'Sin descripción'}</td>
                            <td>
                              <span className="quantity-badge">{orden.cantidad}</span>
                            </td>
                            <td>{formatCurrency(orden.precio || 0)}</td>
                            <td className="total-cell">{formatCurrency(orden.montouni || 0)}</td>
                            <td>{orden.medicamento?.descripcionMed || 'No disponible'}</td>
                            <td>
                              <span className="user-badge">{orden.user?.username || 'Anónimo'}</span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => showOrderDetails(orden)}
                              >
                                Ver detalles
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron órdenes con los filtros actuales.</p>
                  <button className="btn btn-outline-primary" onClick={() => {
                    setSearchTerm("");
                    setSelectedFilter("todas");
                  }}>
                    Mostrar todas las órdenes
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Vista clásica de tabla
          <div className="table-container">
            {filteredOrdenes.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('descripcion')} className="sortable-header">
                      Descripción
                      {sortConfig.key === 'descripcion' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th onClick={() => handleSort('cantidad')} className="sortable-header">
                      Cantidad
                      {sortConfig.key === 'cantidad' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th onClick={() => handleSort('precio')} className="sortable-header">
                      Precio Unit.
                      {sortConfig.key === 'precio' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th onClick={() => handleSort('montouni')} className="sortable-header">
                      Total
                      {sortConfig.key === 'montouni' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Medicamento</th>
                    <th>Usuario</th>
                    <th onClick={() => handleSort('createdAt')} className="sortable-header">
                      Fecha
                      {sortConfig.key === 'createdAt' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdenes.map((orden) => (
                    <tr key={orden.id}>
                      <td>{orden.descripcion || 'Sin descripción'}</td>
                      <td>
                        <span className="quantity-badge">{orden.cantidad}</span>
                      </td>
                      <td>{formatCurrency(orden.precio || 0)}</td>
                      <td className="total-cell">{formatCurrency(orden.montouni || 0)}</td>
                      <td>{orden.medicamento?.descripcionMed || 'No disponible'}</td>
                      <td>
                        <span className="user-badge">{orden.user?.username || 'Anónimo'}</span>
                      </td>
                      <td>{new Date(orden.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => showOrderDetails(orden)}
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">
                <div className="no-results-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron órdenes con los filtros actuales.</p>
                  <button className="btn btn-outline-primary" onClick={() => {
                    setSearchTerm("");
                    setSelectedFilter("todas");
                  }}>
                    Mostrar todas las órdenes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {modalVisible && selectedOrden && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Detalles de la Orden</h3>
              <button className="modal-close" onClick={() => setModalVisible(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-section">
                  <h4>Información General</h4>
                  <div className="detail-row">
                    <span className="detail-label">Descripción:</span>
                    <span className="detail-value">{selectedOrden.descripcion || 'Sin descripción'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fecha:</span>
                    <span className="detail-value">{formatDate(selectedOrden.createdAt)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ID de orden:</span>
                    <span className="detail-value order-id">{selectedOrden.id}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Medicamento</h4>
                  <div className="detail-row">
                    <span className="detail-label">Nombre:</span>
                    <span className="detail-value">{selectedOrden.medicamento?.descripcionMed || 'No disponible'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Código:</span>
                    <span className="detail-value">{selectedOrden.medicamento?.CodMedicamento || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Marca:</span>
                    <span className="detail-value">{selectedOrden.medicamento?.Marca || 'No disponible'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Marca:</span>
                    <span className="detail-value">{selectedOrden.medicamento?.Marca || 'No disponible'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Presentación:</span>
                    <span className="detail-value">{selectedOrden.medicamento?.Presentacion || 'No disponible'}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Detalles de la Compra</h4>
                  <div className="detail-row">
                    <span className="detail-label">Cantidad:</span>
                    <span className="detail-value">{selectedOrden.cantidad}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Precio unitario:</span>
                    <span className="detail-value">{formatCurrency(selectedOrden.precio || 0)}</span>
                  </div>
                  <div className="detail-row total-row">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value total-value">{formatCurrency(selectedOrden.montouni || 0)}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Usuario</h4>
                  <div className="detail-row">
                    <span className="detail-label">Nombre de usuario:</span>
                    <span className="detail-value">{selectedOrden.user?.username || 'Anónimo'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrden.user?.email || 'No disponible'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rol:</span>
                    <span className="detail-value user-role">{selectedOrden.user?.roles?.[0] || 'Usuario'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-primary" onClick={() => setModalVisible(false)}>Cerrar</button>
              <button className="btn btn-primary" onClick={() => {
                // Aquí se podría implementar la funcionalidad de imprimir/exportar
                window.print();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdenesCompraPage;