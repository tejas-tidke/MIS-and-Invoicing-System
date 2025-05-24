import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/brands`;

const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      defaultMessage;
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};

// Create a new brand
const createBrand = async (brandData) => {
  try {
    const response = await axios.post(API_URL, brandData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to create brand");
  }
};

// Get all active brands (using DTO version)
const getAllActiveBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch brands");
  }
};

// Get brand by ID
const getBrandById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch brand");
  }
};

// Update brand
const updateBrand = async (id, brandData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, brandData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to update brand");
  }
};

// Soft delete brand
const deleteBrand = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to delete brand");
  }
};

// Get brands by chain ID
const getBrandsByChainId = async (chainId) => {
  try {
    const response = await axios.get(`${API_URL}/chain/${chainId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch brands by chain");
  }
};

export default {
  createBrand,
  getAllActiveBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  getBrandsByChainId,
};