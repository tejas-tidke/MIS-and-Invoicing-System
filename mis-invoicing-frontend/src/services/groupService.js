import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/groups`;


// Add a new group
export const addGroup = async (group) => {
  try {
    const response = await axios.post(API_URL, group, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding group:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to add group");
  }
};

// Get all groups
export const getAllGroups = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch groups";
  }
};

// Update group name
export const updateGroup = async (groupId, newGroupName) => {
  try {
    const response = await axios.put(
      `${API_URL}/${groupId}`,
      { newGroupName },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update group";
  }
};

// Soft delete group
export const deleteGroup = async (groupId) => {
  try {
    const response = await axios.delete(`${API_URL}/${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete group";
  }
};