import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { updateGroup, getAllGroups } from "../services/groupService";

const EditGroup = () => {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groups = await getAllGroups();
        const group = groups.find((g) => g.id === parseInt(groupId));
        if (group) {
          setGroupName(group.name);
        }
      } catch (error) {
        setError("Failed to fetch group details");
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) {
      setError("Group name is required");
      return;
    }

    try {
      await updateGroup(groupId, groupName);
      console.log("Navigating to /manage-groups");
      navigate("/manage-groups", { replace: true }); 
    } catch (error) {
      setError(error.message || "Failed to update group");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Paper elevation={3} sx={{ padding: "40px", borderRadius: "12px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Edit Group
        </Typography>
        {error && <Snackbar open autoHideDuration={6000} onClose={() => setError("")}><Alert severity="error">{error}</Alert></Snackbar>}
        <form onSubmit={handleSubmit}>
          <TextField label="Group Name" fullWidth required margin="normal" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "16px" }}>
            Update Group
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EditGroup;
