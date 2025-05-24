
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;


const register = async (name, email, password, role) => {
  return await axios.post(`${API_URL}/register`, { name, email, password, role });
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data) {
    localStorage.setItem('token', response.data.token);
 
  }
  return response;
};

const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/verify?token=${token}`);
    return response.data; 
  } catch (error) {
    console.error("Error verifying email:", error.response?.data || error.message);
    throw error; 
  }
};

// Send a forgot password request
const forgotPassword = async (email) => {
  return await axios.post(`${API_URL}/forgot-password`, { email });
};

const resetPassword = async (tokenOrJwt, newPassword, isLoggedIn) => {
  let headers = { "Content-Type": "application/json" };
  let requestBody = { newPassword };

  if (isLoggedIn) {
   
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      console.error("Error: User is not logged in!");
      throw new Error("User is not logged in.");
    }
    headers["Authorization"] = `Bearer ${userToken}`;
  } else {
    
    if (!tokenOrJwt) {
      console.error("Error: Token is missing!");
      throw new Error("Reset token is required.");
    }
    requestBody.token = tokenOrJwt;
  }

  try {
    const response = await axios.post(
      `${API_URL}/reset-password`,
      requestBody,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw error;
  }
};


const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); 
    
    const role = Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;
    return role || null; 
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const logout = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token'); 
      window.location.href = '/login'; 
    }
  }
};

const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("User Data:", response.data); 

    return response.data; 
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};




export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserRole,
  logout,
  getCurrentUser,
};
