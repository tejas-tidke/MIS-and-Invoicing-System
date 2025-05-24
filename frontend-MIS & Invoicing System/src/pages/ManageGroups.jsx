import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { getAllGroups, deleteGroup } from "../services/groupService";
import authService from "../services/authService"; 

const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userRole = authService.getUserRole(); 

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getAllGroups();
      setGroups(data);
    } catch (error) {
      setError("Failed to fetch groups");
    }
  };

  const handleDelete = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId)); 
      setSuccess("Group deleted successfully");
    } catch (error) {
      setError("Failed to delete group");
    }
  };

  const handleEdit = (groupId) => {
    navigate(`/edit-group/${groupId}`);
  };

  const handleAddGroup = () => {
    navigate("/add-group");
  };

  return (
    
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Manage Groups
      </Typography>

      
      {userRole === "ROLE_ADMIN" && (
        <Button
          variant="contained"
          onClick={handleAddGroup}
          sx={{
            marginBottom: 2,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Add Group
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Group Name</TableCell>
              
              {userRole === "ROLE_ADMIN" && (
                <>
                  <TableCell sx={{ fontWeight: "bold" }}>Edit</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Delete</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.name}</TableCell>
                
                {userRole === "ROLE_ADMIN" && (
                  <>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(group.id)}
                        sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(group.id)}
                        sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#c62828" } }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess("")}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageGroups;