import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import chainService from "../services/chainService"; 

const AddChain = ({ open, onClose, onAdd, showSnackbar, groups }) => {
  const [companyName, setCompanyName] = useState("");
  const [gstnNo, setGstnNo] = useState("");
  const [groupId, setGroupId] = useState("");

  const handleSubmit = async () => {
    if (!companyName || !gstnNo || !groupId) {
      showSnackbar("All fields are required", "error");
      return;
    }

    try {
      const chainData = { companyName, gstnNo, groupId }; 
      

      const response = await chainService.addChain(chainData); 
      

      onAdd(); 
      onClose(); 
      showSnackbar("Chain added successfully", "success");
    } catch (error) {
      console.error("Error adding chain:", error); 
      showSnackbar("Failed to add chain", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Chain</DialogTitle>
      <DialogContent>
        <TextField
          label="Company Name"
          fullWidth
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          sx={{ marginBottom: "16px" }}
        />
        <TextField
          label="GSTN Number"
          fullWidth
          value={gstnNo}
          onChange={(e) => setGstnNo(e.target.value)}
          sx={{ marginBottom: "16px" }}
        />
        <FormControl fullWidth sx={{ marginBottom: "16px" }}>
          <InputLabel>Group</InputLabel>
          <Select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddChain;