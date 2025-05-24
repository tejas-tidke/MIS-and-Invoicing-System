import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import authService from "../services/authService";
import subzoneService from "../services/subzoneService";
import brandService from "../services/brandService";
import chainService from "../services/chainService";
import { getAllGroups } from "../services/groupService";
import AddSubzone from "../pageComponents/AddSubzone";
import EditSubzone from "../pageComponents/EditSubzone";

const ManageSubzones = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [subzones, setSubzones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredSubzones, setFilteredSubzones] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openAddSubzone, setOpenAddSubzone] = useState(false);
  const [openEditSubzone, setOpenEditSubzone] = useState(false);
  const [selectedSubzone, setSelectedSubzone] = useState(null);
  const [isLoading, setIsLoading] = useState({
    subzones: false,
    brands: false,
    chains: false,
    groups: false,
  });

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const fetchSubzones = async () => {
    setIsLoading(prev => ({ ...prev, subzones: true }));
    try {
      const data = await subzoneService.getAllActiveSubzones();
      setSubzones(data);
      setFilteredSubzones(data);
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, subzones: false }));
    }
  };

  const fetchBrands = async () => {
    setIsLoading(prev => ({ ...prev, brands: true }));
    try {
      const data = await brandService.getAllActiveBrands();
      setBrands(data);
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, brands: false }));
    }
  };

  const fetchChains = async () => {
    setIsLoading(prev => ({ ...prev, chains: true }));
    try {
      const data = await chainService.getAllChains();
      setChains(data);
    } catch (error) {
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
      showSnackbar(error.message, "error");
    } finally {
      setIsLoading(prev => ({ ...prev, groups: false }));
    }
  };

  const handleDelete = async (subzoneId) => {
    if (!window.confirm("Are you sure you want to delete this subzone?")) return;
    
    try {
      await subzoneService.deleteSubzone(subzoneId);
      showSnackbar("Subzone deleted successfully", "success");
      fetchSubzones();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = subzones;

    if (selectedBrand && selectedBrand !== "all") {
      filtered = filtered.filter(
        (subzone) => subzone.brand?.id === selectedBrand
      );
    }

    if (selectedCompany && selectedCompany !== "all") {
      filtered = filtered.filter(
        (subzone) => subzone.brand?.chain?.chainId === selectedCompany
      );
    }

    if (selectedGroup && selectedGroup !== "all") {
      filtered = filtered.filter(
        (subzone) => subzone.brand?.chain?.group?.id === selectedGroup
      );
    }

    setFilteredSubzones(filtered);
  }, [subzones, selectedBrand, selectedCompany, selectedGroup]);

  useEffect(() => {
    const role = authService.getUserRole();
    if (role !== "ROLE_ADMIN") {
      setTimeout(() => navigate("/dashboard"), 2000);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
      fetchSubzones();
      fetchBrands();
      fetchChains();
      fetchGroups();
    }
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [selectedBrand, selectedCompany, selectedGroup, applyFilters]);

  const handleUpdate = (updatedSubzone) => {
    setSubzones(prevSubzones =>
      prevSubzones.map(subzone =>
        subzone.id === updatedSubzone.id ? updatedSubzone : subzone
      )
    );
    applyFilters();
  };

  if (isAuthorized === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", marginTop: "80px", padding: "24px" }}>
          <Typography variant="h6" sx={{ color: "error.main", fontWeight: "bold" }}>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You do not have permission to access this page. Redirecting to dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: "40px", padding: "24px" }}>
        <Paper elevation={3} sx={{ padding: "32px", borderRadius: "8px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
            Manage Subzones
          </Typography>

          {/* Summary Cards */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Paper elevation={2} sx={{ padding: "16px", flex: 1 }}>
              <Typography variant="subtitle1">Total Groups</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {groups.length}
              </Typography>
            </Paper>
            <Paper elevation={2} sx={{ padding: "16px", flex: 1 }}>
              <Typography variant="subtitle1">Total Chains</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {chains.length}
              </Typography>
            </Paper>
            <Paper elevation={2} sx={{ padding: "16px", flex: 1 }}>
              <Typography variant="subtitle1">Total Brands</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {brands.length}
              </Typography>
            </Paper>
            <Paper elevation={2} sx={{ padding: "16px", flex: 1 }}>
              <Typography variant="subtitle1">Total Subzones</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {subzones.length}
              </Typography>
            </Paper>
          </Stack>

          {/* Filter Section */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Brand</InputLabel>
              <Select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                label="Filter by Brand"
              >
                <MenuItem value="all">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Company</InputLabel>
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                label="Filter by Company"
              >
                <MenuItem value="all">All Companies</MenuItem>
                {chains.map((chain) => (
                  <MenuItem key={chain.chainId} value={chain.chainId}>
                    {chain.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
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

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddSubzone(true)}
              sx={{ ml: "auto" }}
            >
              Add Subzone
            </Button>
          </Stack>

          {/* Subzones Table */}
          {isLoading.subzones ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredSubzones.length === 0 ? (
            <Typography variant="body1" sx={{ py: 4, textAlign: "center" }}>
              No subzones found. Try adjusting your filters or add a new subzone.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Subzone Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Group</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubzones.map((subzone, index) => (
                    <TableRow key={subzone.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{subzone.name}</TableCell>
                      <TableCell>{subzone.brand?.brandName || "N/A"}</TableCell>
                      <TableCell>{subzone.brand?.chain?.companyName || "N/A"}</TableCell>
                      <TableCell>{subzone.brand?.chain?.group?.name || "N/A"}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedSubzone(subzone);
                              setOpenEditSubzone(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(subzone.id)}
                          >
                            <Delete />
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

      {/* Add Subzone Dialog */}
      <AddSubzone
        open={openAddSubzone}
        onClose={() => setOpenAddSubzone(false)}
        onAdd={fetchSubzones}
        showSnackbar={showSnackbar}
        brands={brands}
      />

      {/* Edit Subzone Dialog */}
      <EditSubzone
        open={openEditSubzone}
        onClose={() => setOpenEditSubzone(false)}
        subzone={selectedSubzone}
        onUpdate={handleUpdate}
        showSnackbar={showSnackbar}
        brands={brands}
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

export default ManageSubzones;