import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/chains`;

// Add a new chain
 const addChain = async (chain) => {
  try {
    const response = await axios.post(API_URL, chain, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding chain:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to add chain");
  }
};

// Get all chains
 const getAllChains = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch chains";
  }
};

// Get chains by group ID
 const getChainsByGroup = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch chains by group";
  }
};

// Update chain details
 const updateChain = async (chainId, chainData) => {
  try {
    const response = await axios.put(`${API_URL}/${chainId}`, chainData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update chain";
  }
};

// Soft delete chain
 const deleteChain = async (chainId) => {
  try {
    const response = await axios.delete(`${API_URL}/${chainId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete chain";
  }
};



const chainService = {
    addChain,
    getAllChains,
    getChainsByGroup,
    updateChain,
    deleteChain
  };
  
  export default chainService;
  