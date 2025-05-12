// src/services/ordencomprasService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/detalleOrdenCompra";
const getToken = () => localStorage.getItem("token");

export const getOrdenesCompra = async () => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};