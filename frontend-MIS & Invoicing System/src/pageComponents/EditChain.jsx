import React, { useState, useEffect } from "react";
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

const EditChain = ({ open, onClose, chain, onUpdate, showSnackbar, groups }) => {
  const [companyName, setCompanyName] = useState("");
  const [gstnNo, setGstnNo] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    if (chain) {
      setCompanyName(chain.companyName);
      setGstnNo(chain.gstnNo);
      setGroupId(chain.group.id); 
    }
  }, [chain]);

  const handleSubmit = async () => {
    if (!companyName || !gstnNo || !groupId) {
      showSnackbar("All fields are required", "error");
      return;
    }

    try {
      const chainData = { companyName, gstnNo, groupId }; 
      

      const response = await chainService.updateChain(chain.chainId, chainData); 
      

      onUpdate(); 
      onClose(); 
      showSnackbar("Chain updated successfully", "success");
    } catch (error) {
      console.error("Error updating chain:", error); 
      showSnackbar("Failed to update chain", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Chain</DialogTitle>
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
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditChain;