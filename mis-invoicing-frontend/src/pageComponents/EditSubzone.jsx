import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import subzoneService from "../services/subzoneService";

const EditSubzone = ({ open, onClose, subzone, onUpdate, showSnackbar, brands }) => {
  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subzone) {
      setFormData({
        name: subzone.name || "",
        brandId: subzone.brand?.id || "",
      });
    }
  }, [subzone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.brandId) {
      showSnackbar("Subzone name and brand are required", "error");
      return;
    }

    if (!subzone?.id) {
      showSnackbar("Invalid subzone ID", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedSubzone = await subzoneService.updateSubzone(subzone.id, formData);
      onUpdate(updatedSubzone);
      onClose();
      showSnackbar("Subzone updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Subzone</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="Subzone Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <FormControl fullWidth required>
            <InputLabel>Brand</InputLabel>
            <Select
              name="brandId"
              value={formData.brandId}
              label="Brand"
              onChange={handleChange}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Updating..." : "Update Subzone"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSubzone;