// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

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
  };
  
  export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };