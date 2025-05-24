import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  Grid,
  Divider,
  IconButton
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import invoiceService from "../services/invoiceService";

const UpdateInvoice = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const data = await invoiceService.getInvoiceById(invoiceId);
        setInvoice(data);
        setEmail(data.clientEmail || "");
      } catch (error) {
        handleError(error, "Failed to load invoice");
        navigate("/manage-invoices");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, navigate]);

  const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || error.message || defaultMessage;
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    if (!email) {
      setSnackbarMessage("Client email is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    try {
      await invoiceService.updateInvoiceEmail(invoiceId, email);
      setSnackbarMessage("Email updated successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/manage-invoices"), 1000);
    } catch (error) {
      handleError(error, "Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !invoice) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: "40px", padding: "24px" }}>
        <Paper elevation={3} sx={{ padding: "32px", borderRadius: "8px" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <IconButton onClick={() => navigate("/manage-invoices")}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Invoice #{invoice.invoiceNo}
            </Typography>
          </Stack>

          <Grid container spacing={2} mb={3}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Invoice No:</Typography>
              <Typography variant="body1">{invoice.invoiceNo}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Estimate ID:</Typography>
              <Typography variant="body1">{invoice.estimateId}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Chain Name:</Typography>
              <Typography variant="body1">{invoice.chainName}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Service Provided</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cost per Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{invoice.serviceDetails}</TableCell>
                  <TableCell>{invoice.quantity}</TableCell>
                  <TableCell>₹{invoice.costPerUnit?.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} mb={3}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">Amount Payable:</Typography>
              <Typography variant="body1">₹{invoice.amountPayable?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">Amount Paid:</Typography>
              <Typography variant="body1">₹{invoice.amountPayable?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">Balance:</Typography>
              <Typography variant="body1">₹0.00</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">Delivery Date:</Typography>
              <Typography variant="body1">
                {invoice.serviceDate ? new Date(invoice.serviceDate).toLocaleDateString() : "Not specified"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">Other Delivery Details:</Typography>
              <Typography variant="body1">{invoice.deliveryDetails || "N/A"}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">Client Email:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter client email"
              type="email"
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/manage-invoices")}
              sx={{ minWidth: 120 }}
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "UPDATE EMAIL"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateInvoice;