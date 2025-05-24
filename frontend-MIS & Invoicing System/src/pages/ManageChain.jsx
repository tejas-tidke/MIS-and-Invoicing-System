import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import authService from "../services/authService";
import chainService from "../services/chainService";
import { getAllGroups } from "../services/groupService"; 
import AddChain from "../pageComponents/AddChain";
import EditChain from "../pageComponents/EditChain";

const ManageChain = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [chains, setChains] = useState([]);
  const [filteredChains, setFilteredChains] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openAddChain, setOpenAddChain] = useState(false);
  const [openEditChain, setOpenEditChain] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);
  const [groups, setGroups] = useState([]); 

  useEffect(() => {
    const role = authService.getUserRole();
    if (role !== "ROLE_ADMIN") {
      setTimeout(() => navigate("/dashboard"), 2000);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
      fetchChains();
      fetchGroups(); 
    }
  }, [navigate]);

  const fetchChains = async () => {
    try {
      const data = await chainService.getChainsByGroup(selectedGroup || "all");
      const activeChains = data.filter((chain) => chain.active === true || chain.active === "true" || chain.active === 1);
      setChains(activeChains);
      setFilteredChains(activeChains);
    } catch (error) {
      showSnackbar("Failed to fetch chains", "error");
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await getAllGroups(); 
      setGroups(data); 
    } catch (error) {
      showSnackbar("Failed to fetch groups", "error");
    }
  };

  const handleDelete = async (chainId) => {
    try {
      await chainService.deleteChain(chainId);
      showSnackbar("Chain deleted successfully", "success");
      fetchChains();
    } catch (error) {
      showSnackbar("Failed to delete chain", "error");
    }
  };

  const handleFilterChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
    if (groupId === "all") {
      setFilteredChains(chains);
    } else {
      setFilteredChains(chains.filter((chain) => chain.group.id === groupId));
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        <Box sx={{ textAlign: "center", marginTop: "20px", padding: "24px" }}>
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
    <Container maxWidth="md">
      <Box sx={{ marginTop: "80px", padding: "24px" }}>
        <Paper elevation={3} sx={{ padding: "32px", borderRadius: "8px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Manage Chain
          </Typography>

          {/* Total Groups and Chains Boxes */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: "24px" }}>
            <Paper elevation={2} sx={{ padding: "16px", flex: 1, textAlign: "center" }}>
              <Typography variant="h6">Total Groups</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                {groups.length}
              </Typography>
            </Paper>
            <Paper elevation={2} sx={{ padding: "16px", flex: 1, textAlign: "center" }}>
              <Typography variant="h6">Total Chains</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                {chains.length}
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
            <FormControl sx={{ minWidth: "200px" }}>
              <InputLabel>Filter by Group</InputLabel>
              <Select value={selectedGroup} onChange={handleFilterChange} label="Filter by Group">
                <MenuItem value="all">All Groups</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => setOpenAddChain(true)}>
              Add Chain
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr.No</TableCell>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>GSTN</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChains.map((chain, index) => (
                  <TableRow key={chain.chainId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{chain.group ? chain.group.name : "N/A"}</TableCell>
                    <TableCell>{chain.companyName}</TableCell>
                    <TableCell>{chain.gstnNo}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedChain(chain);
                          setOpenEditChain(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(chain.chainId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <AddChain
        open={openAddChain}
        onClose={() => setOpenAddChain(false)}
        onAdd={fetchChains}
        showSnackbar={showSnackbar}
        groups={groups} 
      />

      <EditChain
        open={openEditChain}
        onClose={() => setOpenEditChain(false)}
        chain={selectedChain}
        onUpdate={fetchChains}
        showSnackbar={showSnackbar}
        groups={groups} 
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageChain;