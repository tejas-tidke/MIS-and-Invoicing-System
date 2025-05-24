import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt as InvoiceIcon } from "@mui/icons-material";
import {
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Card,
  CardContent
} from "@mui/material";

import { Add, Edit, Delete, Refresh } from "@mui/icons-material";
import authService from "../services/authService";
import estimateService from "../services/estimateService";
import chainService from "../services/chainService";
import { getAllGroups } from "../services/groupService";
import brandService from "../services/brandService";
import subzoneService from "../services/subzoneService";
import CreateEstimate from "../pageComponents/CreateEstimate";
import EditEstimate from "../pageComponents/EditEstimate";

const ManageEstimates = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [subzones, setSubzones] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredEstimates, setFilteredEstimates] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedChain, setSelectedChain] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSubzone, setSelectedSubzone] = useState("all");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openCreateEstimate, setOpenCreateEstimate] = useState(false);
  const [openEditEstimate, setOpenEditEstimate] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState({
    estimates: false,
    chains: false,
    groups: false,
    brands: false,
    subzones: false,
  });

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const resetFilters = () => {
    setSelectedGroup("all");
    setSelectedChain("all");
    setSelectedBrand("all");
    setSelectedSubzone("all");
    fetchEstimates();
  };

  const handleCreate = async (newEstimate) => {
    try {
      await estimateService.createEstimate(newEstimate);
      showSnackbar("Estimate created successfully", "success");
      setOpenCreateEstimate(false);
      fetchEstimates();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleUpdate = async (updatedEstimate) => {
    try {
      if (!updatedEstimate.id) {
        throw new Error("Estimate ID is missing");
      }
      await estimateService.updateEstimate(updatedEstimate.id, updatedEstimate);
      showSnackbar("Estimate updated successfully", "success");
      setOpenEditEstimate(false);
      fetchEstimates();
    } catch (error) {
      console.error("Update error:", error);
      showSnackbar(error.message || "Failed to update estimate", "error");
    }
  };

  const handleEditClick = (estimate) => {
    console.log("Selected estimate:", estimate);


    if (!estimate?.estimateId) {
      showSnackbar('Selected estimate has no ID', 'error');
      return;
    }

    setSelectedEstimate({
      ...estimate,
      id: estimate.estimateId.toString(),
      groupId: estimate.groupId?.toString() || "",
      chainId: estimate.chainId?.toString() || "",
      brandId: estimate.brandId?.toString() || "",
      subzoneId: estimate.subzoneId?.toString() || ""
    });
    setOpenEditEstimate(true);
  };

  const fetchEstimates = async () => {
    setIsLoading(prev => ({ ...prev, estimates: true }));
    try {
      if (chains.length === 0) {
        console.warn("Chains not loaded yet, delaying fetchEstimates");
        return;
      }

      const data = await estimateService.getEstimates(
        selectedGroup !== "all" ? selectedGroup : null,
        selectedChain !== "all" ? selectedChain : null
      );

      if (!data || data.length === 0) {
        console.warn("No estimates data received");
        setEstimates([]);
        setFilteredEstimates([]);
        return;
      }

      const estimatesWithChain = data.map(estimate => {
        const matchedChain = chains.find(chain =>
          chain.id?.toString() === estimate.chainId?.toString() ||
          chain.chainId?.toString() === estimate.chainId?.toString()
        );

        return {
          ...estimate,
          id: estimate.id?.toString(),
          chainId: estimate.chainId?.toString(),
          chain: matchedChain || null,
          chainName: matchedChain?.companyName || matchedChain?.name || 'N/A'
        };
      });

      setEstimates(estimatesWithChain);
      setFilteredEstimates(estimatesWithChain);
    } catch (error) {
      console.error("Error fetching estimates:", error);
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, estimates: false }));
    }
  };

  const fetchBrands = async () => {
    setIsLoading(prev => ({ ...prev, brands: true }));
    try {
      const data = await brandService.getAllActiveBrands();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, brands: false }));
    }
  };

  const fetchSubzones = async () => {
    setIsLoading(prev => ({ ...prev, subzones: true }));
    try {
      const data = await subzoneService.getAllActiveSubzones();
      setSubzones(data);
    } catch (error) {
      console.error("Error fetching subzones:", error);
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, subzones: false }));
    }
  };

  const fetchChains = async () => {
    setIsLoading(prev => ({ ...prev, chains: true }));
    try {
      const data = await chainService.getAllChains();
      setChains(data);
    } catch (error) {
      console.error("Error fetching chains:", error);
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, chains: false }));
    }
  };

  const fetchGroups = async () => {
    setIsLoading(prev => ({ ...prev, groups: true }));
    try {
      const data = await getAllGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, groups: false }));
    }
  };

  const handleDelete = async (estimateId) => {
    if (!window.confirm("Are you sure you want to delete this estimate?")) return;
    try {
      await estimateService.deleteEstimate(estimateId);
      showSnackbar("Estimate deleted successfully", "success");
      fetchEstimates();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = estimates;

    if (selectedBrand !== "all") {
      filtered = filtered.filter(est =>
        est.brandName?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (selectedSubzone !== "all") {
      filtered = filtered.filter(est =>
        est.zoneName?.toLowerCase() === selectedSubzone.toLowerCase()
      );
    }

    setFilteredEstimates(filtered);
  }, [estimates, selectedBrand, selectedSubzone]);

  useEffect(() => {
    const role = authService.getUserRole();
    if (!["ROLE_ADMIN", "ROLE_SALES_PERSON"].includes(role)) {
      setTimeout(() => navigate("/dashboard"), 2000);
      setIsAuthorized(false);
    } else {
      const loadData = async () => {
        try {
          setIsAuthorized(true);
          await fetchChains();
          await Promise.all([fetchGroups(), fetchBrands(), fetchSubzones()]);
          fetchEstimates();
        } catch (error) {
          console.error("Initial data loading error:", error);
          showSnackbar("Failed to load initial data", "error");
        }
      };
      loadData();
    }
  }, [navigate]);

  useEffect(() => {
    if (chains.length > 0) {
      fetchEstimates();
    }
  }, [selectedGroup, selectedChain, chains]);

  useEffect(() => {
    applyFilters();
  }, [estimates, selectedBrand, selectedSubzone, applyFilters]);

  if (isAuthorized === null) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </Box>;
  }

  if (!isAuthorized) {
    return <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: "80px", padding: "24px" }}>
        <Typography variant="h6" sx={{ color: "error.main", fontWeight: "bold" }}>
          Access Denied
        </Typography>
        <Typography variant="body1">
          You do not have permission to access this page. Redirecting to dashboard...
        </Typography>
      </Box>
    </Container>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: "40px", padding: "24px" }}>
        <Paper elevation={3} sx={{ padding: "32px", borderRadius: "8px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
            Manage Estimates
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Estimates
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {filteredEstimates.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Showing {filteredEstimates.length} of {estimates.length} estimates
                </Typography>
              </CardContent>
            </Card>
            </Box>

            {/* Filter Section */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
              <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Filter by Group</InputLabel>
                <Select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  label="Filter by Group"
                >
                  <MenuItem value="all">All Groups</MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Filter by Chain</InputLabel>
                <Select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  label="Filter by Chain"
                >
                  <MenuItem value="all">All Chains</MenuItem>
                  {chains.map((chain) => (
                    <MenuItem key={chain.chainId} value={chain.chainId}>
                      {chain.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Filter by Brand</InputLabel>
                <Select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  label="Filter by Brand"
                  disabled={isLoading.brands}
                >
                  <MenuItem value="all">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.brandName}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Filter by Zone</InputLabel>
                <Select
                  value={selectedSubzone}
                  onChange={(e) => setSelectedSubzone(e.target.value)}
                  label="Filter by Zone"
                  disabled={isLoading.subzones}
                >
                  <MenuItem value="all">All Zones</MenuItem>
                  {subzones.map((subzone) => (
                    <MenuItem key={subzone.id} value={subzone.name}>
                      {subzone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={resetFilters}
                sx={{ mb: 2, height: '56px' }}
              >
                Reset Filters
              </Button>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenCreateEstimate(true)}
                sx={{ mb: 2, ml: "auto", height: '56px' }}
              >
                Create Estimate
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  fetchChains().then(fetchEstimates);
                }}
                sx={{ mb: 2, height: '56px' }}
              >
                Refresh Data
              </Button>
            </Stack>

            {/* Estimates Table */}
            {isLoading.estimates ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Loading estimates...
                </Typography>
              </Box>
            ) : filteredEstimates.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  No estimates found.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={fetchEstimates}
                  startIcon={<Refresh />}
                >
                  Retry Loading
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr.No</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Chain</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Zone</TableCell>
                      <TableCell>Service Details</TableCell>
                      <TableCell align="right">Units</TableCell>
                      <TableCell align="right">Price/Unit</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEstimates.map((estimate, index) => (
                      <TableRow key={estimate.id ? `estimate-${estimate.id}` : `fallback-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{estimate.groupName}</TableCell>
                        <TableCell>{estimate.chainName}</TableCell>
                        <TableCell>{estimate.brandName}</TableCell>
                        <TableCell>{estimate.zoneName}</TableCell>
                        <TableCell>{estimate.service}</TableCell>
                        <TableCell align="right">{estimate.qty}</TableCell>
                        <TableCell align="right">₹{estimate.costPerUnit.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{estimate.totalCost.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(estimate)}
                              title="Edit Estimate"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(estimate.estimateId)}
                              title="Delete Estimate"
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              color="success"
                              onClick={() => {
                                if (!estimate.estimateId) {
                                  showSnackbar('Cannot generate invoice - missing estimate ID', 'error');
                                  return;
                                }
                                navigate(`generate-invoice/${estimate.estimateId}`);
                              }}
                              title="Generate Invoice"
                            >
                              <InvoiceIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </Paper>
      </Box>

      {/* Create Estimate Dialog */}
      <CreateEstimate
        open={openCreateEstimate}
        onClose={() => setOpenCreateEstimate(false)}
        onAdd={handleCreate}
        showSnackbar={showSnackbar}
        groups={groups}
        chains={chains}
        brands={brands}
        subzones={subzones}
      />

      {/* Edit Estimate Dialog */}
      <EditEstimate
        open={openEditEstimate}
        onClose={() => setOpenEditEstimate(false)}
        estimate={selectedEstimate || {}}
        onUpdate={handleUpdate}
        showSnackbar={showSnackbar}
        groups={groups}
        chains={chains}
        brands={brands}
        subzones={subzones}
      />

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageEstimates;


