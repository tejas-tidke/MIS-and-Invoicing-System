import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const CreateEstimate = ({ 
  open, 
  onClose, 
  onAdd, 
  showSnackbar, 
  chains = [], 
  groups = [], 
  brands = [], 
  subzones = [] 
}) => {
  const [formData, setFormData] = useState({
    groupId: '',
    chainId: '',
    brandId: '',
    subzoneId: '',
    service: '',
    qty: 1,
    costPerUnit: 500,
    deliveryDate: null,
    deliveryDetails: ''
  });

  const [filteredChains, setFilteredChains] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredSubzones, setFilteredSubzones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);


  useEffect(() => {
    setTotalAmount(formData.qty * formData.costPerUnit);
  }, [formData.qty, formData.costPerUnit]);


  useEffect(() => {
    if (formData.groupId) {
      setIsLoading(true);
      try {
        const groupChains = chains.filter(chain => 
          chain.group?.id?.toString() === formData.groupId.toString()
        );
        setFilteredChains(groupChains);
      } catch (error) {
        console.error('Error filtering chains:', error);
        showSnackbar('Error loading chains', 'error');
      } finally {
        setIsLoading(false);
      }
      setFormData(prev => ({ ...prev, chainId: '', brandId: '', subzoneId: '' }));
    } else {
      setFilteredChains([]);
    }
  }, [formData.groupId, chains]);

  // Filter brands when chain changes
  useEffect(() => {
    if (formData.chainId) {
      setIsLoading(true);
      try {
        const chainBrands = brands.filter(brand => 
          brand.chain?.chainId?.toString() === formData.chainId.toString()
        );
        setFilteredBrands(chainBrands);
      } catch (error) {
        console.error('Error filtering brands:', error);
        showSnackbar('Error loading brands', 'error');
      } finally {
        setIsLoading(false);
      }
      setFormData(prev => ({ ...prev, brandId: '', subzoneId: '' }));
    } else {
      setFilteredBrands([]);
    }
  }, [formData.chainId, brands]);


  useEffect(() => {
    if (formData.brandId) {
      setIsLoading(true);
      try {
        const brandSubzones = subzones.filter(subzone => 
          subzone.brand?.id?.toString() === formData.brandId.toString()
        );
        setFilteredSubzones(brandSubzones);
      } catch (error) {
        console.error('Error filtering subzones:', error);
        showSnackbar('Error loading zones', 'error');
      } finally {
        setIsLoading(false);
      }
      setFormData(prev => ({ ...prev, subzoneId: '' }));
    } else {
      setFilteredSubzones([]);
    }
  }, [formData.brandId, subzones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'qty' || name === 'costPerUnit' ? Number(value) : value 
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, deliveryDate: date }));
  };

  const handleSubmit = () => {
    if (!formData.groupId || !formData.chainId || !formData.brandId || 
        !formData.subzoneId || !formData.service || !formData.deliveryDate) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    const selectedGroup = groups.find(g => g.id.toString() === formData.groupId.toString());
    const selectedChain = chains.find(c => c.chainId.toString() === formData.chainId.toString());
    const selectedBrand = brands.find(b => b.id.toString() === formData.brandId.toString());
    const selectedSubzone = subzones.find(s => s.id.toString() === formData.subzoneId.toString());

    const estimateData = {
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

    onAdd(estimateData);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            Create New Estimate
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Client Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={3}>
              {/* Group Selection */}
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
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Chain Selection */}
              <FormControl fullWidth>
                <InputLabel>Select Chain *</InputLabel>
                <Select
                  name="chainId"
                  value={formData.chainId}
                  onChange={handleChange}
                  label="Select Chain *"
                  required
                  disabled={!formData.groupId || isLoading}
                >
                  {!formData.groupId ? (
                    <MenuItem disabled>Select a group first</MenuItem>
                  ) : isLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : filteredChains.length === 0 ? (
                    <MenuItem disabled>No chains found for this group</MenuItem>
                  ) : (
                    filteredChains.map(chain => (
                      <MenuItem key={chain.chainId} value={chain.chainId}>
                        {chain.companyName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Brand Selection */}
              <FormControl fullWidth>
                <InputLabel>Select Brand *</InputLabel>
                <Select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  label="Select Brand *"
                  required
                  disabled={!formData.chainId || isLoading}
                >
                  {!formData.chainId ? (
                    <MenuItem disabled>Select a chain first</MenuItem>
                  ) : isLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : filteredBrands.length === 0 ? (
                    <MenuItem disabled>No brands found for this chain</MenuItem>
                  ) : (
                    filteredBrands.map(brand => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.brandName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Zone Selection */}
              <FormControl fullWidth>
                <InputLabel>Select Zone *</InputLabel>
                <Select
                  name="subzoneId"
                  value={formData.subzoneId}
                  onChange={handleChange}
                  label="Select Zone *"
                  required
                  disabled={!formData.brandId || isLoading}
                >
                  {!formData.brandId ? (
                    <MenuItem disabled>Select a brand first</MenuItem>
                  ) : isLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : filteredSubzones.length === 0 ? (
                    <MenuItem disabled>No zones found for this brand</MenuItem>
                  ) : (
                    filteredSubzones.map(subzone => (
                      <MenuItem key={subzone.id} value={subzone.id}>
                        {subzone.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Service Provided */}
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
              {/* Quantity */}
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

              {/* Cost Per Unit */}
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

              {/* Total Amount */}
              <TextField
                label="Estimated Amount (₹)"
                value={totalAmount}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />

              {/* Delivery Date */}
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
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Estimate'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateEstimate;