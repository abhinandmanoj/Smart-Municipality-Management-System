import axios from "axios";

// ==========================
// API Base URL
// ==========================

const API_URL = "http://localhost:5000/api/auth";

// ==========================
// Register User
// ==========================

export const registerUser = async (userData) => {
  return await axios.post(
    `${API_URL}/register`,
    userData
  );
};

// ==========================
// Login User
// ==========================

export const loginUser = async (loginData) => {
  return await axios.post(
    `${API_URL}/login`,
    loginData
  );
};