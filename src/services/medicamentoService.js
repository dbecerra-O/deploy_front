// src/services/laboratorioService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/medicamentos";

const getToken = () => localStorage.getItem("token");

export const getMedicamentos = async () => {
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
};

// src/services/medicamentoService.js
export const createDetalleOrdenCompra = async (data) => {
  const res = await axios.post("http://localhost:3000/api/detalleOrdenCompra", data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};