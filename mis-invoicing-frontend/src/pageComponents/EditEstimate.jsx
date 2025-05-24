import React, { useState, useEffect, useMemo } from "react";
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
  Typography,
  Divider,
  Paper
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

const EditEstimate = ({ 
  open, 
  onClose, 
  estimate = {}, 
  onUpdate, 
  showSnackbar, 
  chains = [], 
  groups = [], 
  brands = [], 
  subzones = [] 
}) => {
  const [formData, setFormData] = useState({
    groupId: "",
    chainId: "",
    brandId: "",
    subzoneId: "",
    service: "",
    qty: 1,
    costPerUnit: 500,
    deliveryDate: null,
    deliveryDetails: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalAmount = useMemo(() => formData.qty * formData.costPerUnit, [formData.qty, formData.costPerUnit]);
  
  const filteredChains = useMemo(() => {
    return chains.filter(chain => chain.group?.id?.toString() === formData.groupId?.toString());
  }, [chains, formData.groupId]);
 
  const filteredBrands = useMemo(() => {
    return brands.filter(brand => brand.chain?.chainId?.toString() === formData.chainId?.toString());
  }, [brands, formData.chainId]);

  const filteredSubzones = useMemo(() => {
    return subzones.filter(subzone => subzone.brand?.id?.toString() === formData.brandId?.toString());
  }, [subzones, formData.brandId]);

  useEffect(() => {
    if (open && estimate?.id) {
      setFormData({
        groupId: estimate.groupId?.toString() || "",
        chainId: estimate.chainId?.toString() || "",
        brandId: estimate.brandId?.toString() || "",
        subzoneId: estimate.subzoneId?.toString() || "",
        service: estimate.service || "",
        qty: estimate.qty || 1,
        costPerUnit: estimate.costPerUnit || 500,
        deliveryDate: estimate.deliveryDate ? new Date(estimate.deliveryDate) : null,
        deliveryDetails: estimate.deliveryDetails || ""
      });
    }
  }, [estimate, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const resetFields = {};
    if (name === 'groupId') {
      resetFields.chainId = '';
      resetFields.brandId = '';
      resetFields.subzoneId = '';
    } else if (name === 'chainId') {
      resetFields.brandId = '';
      resetFields.subzoneId = '';
    } else if (name === 'brandId') {
      resetFields.subzoneId = '';
    }
    
    setFormData(prev => ({ 
      ...prev, 
      ...resetFields,
      [name]: name === 'qty' || name === 'costPerUnit' ? Number(value) : value 
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, deliveryDate: date }));
  };

  const handleSubmit = async () => {
  
    if (!formData.groupId || !formData.chainId || !formData.brandId || 
        !formData.subzoneId || !formData.service || !formData.deliveryDate) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    
    const estimateId = estimate?.id || estimate?.estimateId;
  if (!estimateId) {
    console.error('Missing estimate ID:', estimate);
    showSnackbar('Invalid estimate data - missing ID', 'error');
    return;
  }

    const selectedGroup = groups.find(g => g.id?.toString() === formData.groupId?.toString());
    const selectedChain = chains.find(c => c.chainId?.toString() === formData.chainId?.toString());
    const selectedBrand = brands.find(b => b.id?.toString() === formData.brandId?.toString());
    const selectedSubzone = subzones.find(s => s.id?.toString() === formData.subzoneId?.toString());

    const estimateData = {
      id: estimateId.toString(),
      groupId: formData.groupId,
      groupName: selectedGroup?.name || '',
      chainId: formData.chainId,
      companyName: selectedChain?.companyName || '',
      brandId: formData.brandId,
      brandName: selectedBrand?.brandName || '',
      subzoneId: formData.subzoneId,
      zoneName: selectedSubzone?.name || '',
      service: formData.service,
      qty: formData.qty,
      costPerUnit: formData.costPerUnit,
      totalCost: totalAmount,
      deliveryDate: format(formData.deliveryDate, 'yyyy-MM-dd'),
      deliveryDetails: formData.deliveryDetails
    };

    setIsSubmitting(true);
    try {
      await onUpdate(estimateData);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      showSnackbar(error.message || "Failed to update estimate", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            Edit Estimate
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Client Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Select Group *</InputLabel>
                <Select
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleChange}
                  label="Select Group *"
                  required
                >
                  {groups.map(group => (
                    <MenuItem key={`group-${group.id}`} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Select Chain *</InputLabel>
                <Select
                  name="chainId"
                  value={formData.chainId}
                  onChange={handleChange}
                  label="Select Chain *"
                  required
                  disabled={!formData.groupId}
                >
                  {filteredChains.length === 0 ? (
                    <MenuItem disabled>No chains found for this group</MenuItem>
                  ) : (
                    filteredChains.map(chain => (
                      <MenuItem key={`chain-${chain.chainId}`} value={chain.chainId}>
                        {chain.companyName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Select Brand *</InputLabel>
                <Select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  label="Select Brand *"
                  required
                  disabled={!formData.chainId}
                >
                  {filteredBrands.length === 0 ? (
                    <MenuItem disabled>No brands found for this chain</MenuItem>
                  ) : (
                    filteredBrands.map(brand => (
                      <MenuItem key={`brand-${brand.id}`} value={brand.id}>
                        {brand.brandName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Select Zone *</InputLabel>
                <Select
                  name="subzoneId"
                  value={formData.subzoneId}
                  onChange={handleChange}
                  label="Select Zone *"
                  required
                  disabled={!formData.brandId}
                >
                  {filteredSubzones.length === 0 ? (
                    <MenuItem disabled>No zones found for this brand</MenuItem>
                  ) : (
                    filteredSubzones.map(subzone => (
                      <MenuItem key={`subzone-${subzone.id}`} value={subzone.id}>
                        {subzone.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                name="service"
                label="Service Provided *"
                value={formData.service}
                onChange={handleChange}
                fullWidth
                required
              />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pricing Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={3}>
              <TextField
                name="qty"
                label="Total Quantity *"
                type="number"
                value={formData.qty}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />

              <TextField
                name="costPerUnit"
                label="Cost Per Quantity (₹) *"
                type="number"
                value={formData.costPerUnit}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Estimated Amount (₹)"
                value={totalAmount}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />

              <DatePicker
                label="Expected Delivery Date *"
                value={formData.deliveryDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
                minDate={new Date()}
                inputFormat="dd-MM-yyyy"
              />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Other Delivery Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              name="deliveryDetails"
              label="Delivery Instructions"
              value={formData.deliveryDetails}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Service must be delivered to following address: A-20, 2nd Tower, 12th Floor, Delta Tech Pvt Ltd Mumbai"
            />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Update Estimate'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditEstimate;



