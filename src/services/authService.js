import axios from "axios";
import API_BASE_URL from "../config/api.config";

const API_URL = `${API_BASE_URL}/auth/`;

export const register = async (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password
  });
};
  
export const login = async (username, password) => {
  const response = await axios.post(API_URL + "signin", {
    username,
    password
  });
    
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", response.data.accessToken);
  }
    
  return response.data;
};
  
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token"); // Asegúrate de limpiar también el token
};
  
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};