import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/subzones`;

const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      defaultMessage;
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};

// Create a new subzone
const createSubzone = async (subzoneData) => {
  try {
    const response = await axios.post(API_URL, subzoneData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to create subzone");
  }
};


// Get all active subzones
const getAllActiveSubzones = async () => {
    try {
      const response = await axios.get(API_URL, { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error, "Failed to fetch subzones");
    }
  };

// Get subzone by ID
const getSubzoneById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch subzone");
  }
};

// Update subzone
const updateSubzone = async (id, subzoneData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, subzoneData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to update subzone");
  }
};

// Soft delete subzone
const deleteSubzone = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to delete subzone");
  }
};

// Get subzones by brand ID
const getSubzonesByBrandId = async (brandId) => {
  try {
    const response = await axios.get(`${API_URL}/brand/${brandId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch subzones by brand");
  }
};

export default {
  createSubzone,
  getAllActiveSubzones,
  getSubzoneById,
  updateSubzone,
  deleteSubzone,
  getSubzonesByBrandId,
};