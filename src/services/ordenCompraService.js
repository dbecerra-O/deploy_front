import axios from "axios";
import API_BASE_URL from "../config/api.config";

const API_URL = `${API_BASE_URL}/detalleOrdenCompra`;
const getToken = () => localStorage.getItem("token");

export const getOrdenesCompra = async () => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const createDetalleOrdenCompra = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};