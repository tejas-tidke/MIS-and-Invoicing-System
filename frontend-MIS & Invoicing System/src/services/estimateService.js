
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/estimates`;

const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      defaultMessage;
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};


const createEstimate = async (estimateData) => {
  try {
    const response = await axios.post(API_URL, estimateData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to create estimate");
  }
};

// Update an estimate
const updateEstimate = async (id, estimateData) => {
  try {
    // Make sure to use the correct ID field name that your backend expects
    const response = await axios.put(`${API_URL}/${id}`, {
      ...estimateData,
      estimateId: id // Include this if your backend expects estimateId
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to update estimate");
  }
};

// Delete an estimate
const deleteEstimate = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to delete estimate");
  }
};

// Get estimate by ID
const getEstimateById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch estimate");
  }
};


const getEstimates = async (groupId = null, chainId = null) => {
  try {
    let url = API_URL;
    const params = new URLSearchParams();
    
    if (groupId) params.append('groupId', groupId);
    if (chainId) params.append('chainId', chainId);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch estimates");
  }
};

export default {
  createEstimate,
  updateEstimate,
  deleteEstimate,
  getEstimateById,
  getEstimates
};