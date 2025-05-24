import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { addGroup } from "../services/groupService";

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) {
      setError("Group name is required");
      return;
    }

    try {
      await addGroup({ name: groupName });
      console.log("Navigating to /manage-groups");
      navigate("/manage-groups", { replace: true }); 
    } catch (error) {
      setError(error.message || "Failed to add group");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Paper elevation={3} sx={{ padding: "40px", borderRadius: "12px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Add Group
        </Typography>
        {error && <Snackbar open autoHideDuration={6000} onClose={() => setError("")}><Alert severity="error">{error}</Alert></Snackbar>}
        <form onSubmit={handleSubmit}>
          <TextField label="Group Name" fullWidth required margin="normal" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "16px" }}>
            Add Group
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddGroup;
