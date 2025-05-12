import axios from "axios";
import API_BASE_URL from "../config/api.config";

const API_URL = `${API_BASE_URL}/medicamentos`;
const getToken = () => localStorage.getItem("token");

export const getMedicamentos = async () => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};