import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicamentosPage from "./pages/Medicamentos";
import OrdenesCompraPage from "./pages/OrdenesCompra";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'; // Asegúrate que este CSS es el que estás editando

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />}>
          <Route path="/medicamentos" element={<MedicamentosPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/ordenes-compra" element={<OrdenesCompraPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;