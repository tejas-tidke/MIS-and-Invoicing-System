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
import brandService from "../services/brandService";

const EditBrand = ({ open, onClose, brand, onUpdate, showSnackbar, chains }) => {
  const [formData, setFormData] = useState({
    brandName: "",
    chainId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        brandName: brand.brandName || "",
        chainId: brand.chain?.chainId || "",
      });
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.brandName || !formData.chainId) {
      showSnackbar("Brand name and company are required", "error");
      return;
    }

    if (!brand?.id) {
      showSnackbar("Invalid brand ID", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const brandData = {
        brandName: formData.brandName,
        chainId: formData.chainId,
      };
      const updatedBrand = await brandService.updateBrand(brand.id, brandData);  
      onUpdate(updatedBrand);
      onClose();
      showSnackbar("Brand updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Brand</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            name="brandName"
            label="Brand Name"
            fullWidth
            value={formData.brandName}
            onChange={handleChange}
            required
          />
          
          <FormControl fullWidth required>
            <InputLabel>Company</InputLabel>
            <Select
              name="chainId"
              value={formData.chainId}
              label="Company"
              onChange={handleChange}
            >
              {chains.map((chain) => (
                <MenuItem key={chain.chainId} value={chain.chainId}>
                  {chain.companyName}
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
          {isSubmitting ? "Updating..." : "Update Brand"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBrand;