import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import estimateService from "../services/estimateService";
import invoiceService from "../services/invoiceService";

const GenerateInvoice = () => {
  const { estimateId } = useParams();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchEstimate = async () => {
      setIsLoading(true);
      try {
        const data = await estimateService.getEstimateById(estimateId);
        setEstimate(data);
        setEmail(data.clientEmail || "");
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/estimates"), 2000);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEstimate();
  }, [estimateId, navigate]);
  
  const handleGenerateInvoice = async () => {
    if (!email) {
      setSnackbarMessage("Please enter client email");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  
    setIsLoading(true);
    try {
      const invoiceData = {
        estimateId: Number(estimateId),
        clientEmail: email,
        amountPaid: estimate.totalCost,
        paymentDate: new Date().toISOString(),
      };
  

      const createdInvoice = await invoiceService.createInvoice(invoiceData);
      
      const completeInvoice = await invoiceService.getInvoiceById(createdInvoice.id);
      
  
      const pdfData = await invoiceService.downloadInvoicePdf(completeInvoice.id);
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
 
      link.setAttribute('download', `${completeInvoice.invoiceNo}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setSnackbarMessage("Invoice generated and downloaded successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/manage-invoices"), 2000);
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to generate invoice");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !estimate) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: "80px", padding: "24px" }}>
        <Paper elevation={3} sx={{ padding: "32px", borderRadius: "8px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Generate Invoice
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Estimate Details</Typography>
            <Typography>Company: {estimate.companyName}</Typography>
            <Typography>Service: {estimate.service}</Typography>
            <Typography>Quantity: {estimate.qty}</Typography>
            <Typography>Amount: ₹{estimate.totalCost.toFixed(2)}</Typography>
          </Box>

          <TextField
            fullWidth
            label="Client Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            required
            error={!email}
            helperText={!email ? "Email is required" : ""}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/manage-estimate")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateInvoice}
              disabled={isLoading || !email}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Generate Invoice'}
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

export default GenerateInvoice;
