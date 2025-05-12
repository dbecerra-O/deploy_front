import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicamentos } from "../services/medicamentoService";
import { createDetalleOrdenCompra } from "../services/ordenCompraService";

const MedicamentosPage = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getMedicamentos();
        setMedicamentos(data);
        setFilteredMedicamentos(data);
      } catch (err) {
        setError("Error al cargar los medicamentos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMedicamentos(medicamentos);
    } else {
      const filtered = medicamentos.filter(med => 
        med.descripcionMed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.Marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.CodMedicamento.toString().includes(searchTerm)
      );
      setFilteredMedicamentos(filtered);
    }
  }, [searchTerm, medicamentos]);

  const openComprarModal = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setCantidad(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedicamento(null);
  };

  const handleComprar = async () => {
    if (!selectedMedicamento) return;
    
    try {
      setProcessingPurchase(true);
      
      if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        setError("Por favor ingrese una cantidad válida");
        return;
      }

      const compraData = {
        CodMedicamento: selectedMedicamento.CodMedicamento,
        cantidad: parseInt(cantidad),
        precio: parseFloat(selectedMedicamento.precioVentaUni)
      };

      await createDetalleOrdenCompra(compraData);
      
      // Actualizar el stock localmente (opcional - depende de cómo funciona tu API)
      const updatedMedicamentos = medicamentos.map(med => {
        if (med.CodMedicamento === selectedMedicamento.CodMedicamento) {
          return { ...med, stock: med.stock - cantidad };
        }
        return med;
      });
      
      setMedicamentos(updatedMedicamentos);
      setFilteredMedicamentos(updatedMedicamentos);
      
      // Mostrar mensaje de éxito y cerrar modal
      setSuccessMessage("¡Compra realizada exitosamente!");
      setTimeout(() => {
        setSuccessMessage("");
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Error en compra:", err);
      setError("Error al procesar la compra");
    } finally {
      setProcessingPurchase(false);
    }
  };

  const [successMessage, setSuccessMessage] = useState("");

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-large"></div>
      <p>Cargando medicamentos...</p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Catálogo de Medicamentos</h1>
          <p className="page-subtitle">Consulta y compra medicamentos de nuestro inventario</p>
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

        {successMessage && (
          <div className="alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, marca o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="search-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="table-info">
            Mostrando {filteredMedicamentos.length} de {medicamentos.length} medicamentos
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Fabricación</th>
                <th>Vencimiento</th>
                <th>Presentación</th>
                <th>Stock</th>
                <th>Precio Unit.</th>
                <th>Precio Present.</th>
                <th>Marca</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicamentos.length > 0 ? (
                filteredMedicamentos.map((med) => (
                  <tr key={med.CodMedicamento}>
                    <td><span className="med-code">{med.CodMedicamento}</span></td>
                    <td>{med.descripcionMed}</td>
                    <td>{new Date(med.fechaFabricacion).toLocaleDateString()}</td>
                    <td>
                      <span className={isExpired(med.fechaVencimiento) ? 'expired-date' : ''}>
                        {new Date(med.fechaVencimiento).toLocaleDateString()}
                      </span>
                    </td>
                    <td>{med.Presentacion}</td>
                    <td>
                      <span className={`stock-badge ${getStockClass(med.stock)}`}>
                        {med.stock}
                      </span>
                    </td>
                    <td>${parseFloat(med.precioVentaUni).toFixed(2)}</td>
                    <td>${parseFloat(med.precioVentaPres).toFixed(2)}</td>
                    <td>
                      <span className="brand-badge">{med.Marca}</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => openComprarModal(med)}
                        disabled={med.stock <= 0}
                      >
                        {med.stock > 0 ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="btn-icon">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Comprar
                          </>
                        ) : "Sin Stock"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-results">
                    <div className="no-results-message">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No se encontraron medicamentos con tu búsqueda.</p>
                      <button className="btn btn-outline-primary" onClick={() => setSearchTerm("")}>
                        Mostrar todos los medicamentos
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de compra */}
      {modalVisible && selectedMedicamento && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Comprar Medicamento</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="product-info">
                <div className="product-name">{selectedMedicamento.descripcionMed}</div>
                <div className="product-details">
                  <span className="product-brand">{selectedMedicamento.Marca}</span>
                  <span className="product-presentation">{selectedMedicamento.Presentacion}</span>
                </div>
                <div className="product-price">
                  <span className="price-label">Precio unitario:</span>
                  <span className="price-value">${parseFloat(selectedMedicamento.precioVentaUni).toFixed(2)}</span>
                </div>
                <div className="product-stock">
                  <span className="stock-label">Stock disponible:</span>
                  <span className="stock-value">{selectedMedicamento.stock} unidades</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cantidad" className="form-label">Cantidad:</label>
                <div className="quantity-input">
                  <button 
                    className="quantity-btn"
                    onClick={() => setCantidad(Math.max(1, parseInt(cantidad) - 1))}
                    disabled={cantidad <= 1}
                  >−</button>
                  <input
                    type="number"
                    id="cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.min(selectedMedicamento.stock, Math.max(1, parseInt(e.target.value) || 0)))}
                    min="1"
                    max={selectedMedicamento.stock}
                    className="form-control quantity-control"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => setCantidad(Math.min(selectedMedicamento.stock, parseInt(cantidad) + 1))}
                    disabled={cantidad >= selectedMedicamento.stock}
                  >+</button>
                </div>
              </div>
              
              <div className="total-calculation">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${(parseFloat(selectedMedicamento.precioVentaUni) * cantidad).toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>${(parseFloat(selectedMedicamento.precioVentaUni) * cantidad).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={closeModal}>Cancelar</button>
              <button 
                className="btn btn-primary" 
                onClick={handleComprar}
                disabled={processingPurchase}
              >
                {processingPurchase ? (
                  <>
                    <span className="spinner-sm"></span>
                    Procesando...
                  </>
                ) : "Confirmar Compra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Función para determinar si una fecha está expirada
const isExpired = (dateString) => {
  const expirationDate = new Date(dateString);
  const today = new Date();
  return expirationDate < today;
};

// Función para determinar la clase CSS basada en el stock
const getStockClass = (stock) => {
  if (stock <= 0) return 'out-of-stock';
  if (stock < 10) return 'low-stock';
  if (stock < 30) return 'medium-stock';
  return 'high-stock';
};

export default MedicamentosPage;
