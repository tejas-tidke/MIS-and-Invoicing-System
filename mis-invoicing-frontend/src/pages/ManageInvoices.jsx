import React, { useState, useEffect } from "react";
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
  TextField,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card, // Added Card component
  CardContent
} from "@mui/material";
import { Search, Edit, Delete, PictureAsPdf, Email, Refresh } from "@mui/icons-material";
import authService from "../services/authService";
import invoiceService from "../services/invoiceService";

const ManageInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [emailToUpdate, setEmailToUpdate] = useState("");
  const [invoiceToUpdate, setInvoiceToUpdate] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await invoiceService.getAllInvoices();
      console.log("API Response Data:", data);

      const validatedInvoices = Array.isArray(data) ? data.map(invoice => ({
        id: invoice.id || '',
        invoice_no: invoice.invoiceNo || 'N/A',
        estimate_id: invoice.estimateId || 'N/A',
        company_name: invoice.chainName || 'N/A',
        amount_payable: invoice.amountPayable ? parseFloat(invoice.amountPayable) : 0,
        status: invoice.status || 'GENERATED',
        created_at: invoice.createdAt || new Date().toISOString(),
        client_email: invoice.clientEmail || '',
        chain_id: invoice.chainId || null,
        gstn: invoice.gstn || '',
        serviceDetails: invoice.serviceDetails || ''
      })) : [];

      console.log("Processed Invoices:", validatedInvoices);
      setInvoices(validatedInvoices);
      setFilteredInvoices(validatedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      showSnackbar(error.message || "Failed to fetch invoices", "error");
      setInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = invoices.filter(invoice => {
      const invoiceNumber = invoice.invoice_no?.toLowerCase() || '';
      const estimateId = invoice.estimate_id?.toString() || '';
      const chainId = invoice.chain_id?.toString() || '';
      const companyName = invoice.company_name?.toLowerCase() || '';
      const gstn = invoice.gstn?.toLowerCase() || '';

      return (
        invoiceNumber.includes(term) ||
        estimateId.includes(term) ||
        chainId.includes(term) ||
        companyName.includes(term) ||
        gstn.includes(term)
      );
    });
    setFilteredInvoices(filtered);
  };

  const handleDownloadPdf = async (id) => {
    console.log('Downloading invoice with ID:', id);
    try {
      const invoice = invoices.find(inv => inv.id === id);

      if (!invoice) {
        throw new Error("Invoice not found");
      }
      const pdfData = await invoiceService.downloadInvoicePdf(id);
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // link.setAttribute('download', `invoice_${id}.pdf`);
      link.setAttribute('download', `${invoice.invoice_no}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showSnackbar(error.message || "Failed to download invoice PDF", "error");
    }
  };

  const handleSendEmail = async (id) => {
    try {
      await invoiceService.sendInvoiceEmail(id);
      showSnackbar("Invoice email sent successfully", "success");
    } catch (error) {
      console.error("Error sending email:", error);
      showSnackbar(error.message || "Failed to send invoice email", "error");
    }
  };

  const handleUpdateEmail = async () => {
    if (!emailToUpdate || !invoiceToUpdate) {
      showSnackbar("Please enter a valid email", "error");
      return;
    }

    try {
      await invoiceService.updateInvoiceEmail(invoiceToUpdate.id, emailToUpdate);
      showSnackbar("Email updated successfully", "success");
      setInvoiceToUpdate(null);
      setEmailToUpdate("");
      fetchInvoices();
    } catch (error) {
      console.error("Error updating email:", error);
      showSnackbar(error.message || "Failed to update email", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await invoiceService.deleteInvoice(invoiceToDelete);
      showSnackbar("Invoice deleted successfully", "success");
      setOpenDeleteDialog(false);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      showSnackbar(error.message || "Failed to delete invoice", "error");
    }
  };

  useEffect(() => {
    const role = authService.getUserRole();
    if (!["ROLE_ADMIN", "ROLE_ACCOUNTANT"].includes(role)) {
      setTimeout(() => navigate("/dashboard"), 2000);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
      fetchInvoices();
    }
  }, [navigate]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, invoices]);

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
            Manage Invoices
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Invoices: {filteredInvoices.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredInvoices.length} of {invoices.length} invoices
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by invoice number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />
              }}
            />
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchInvoices}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Stack>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredInvoices.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body1">
                {searchTerm ? "No matching invoices found" : "No invoices available"}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Estimate ID</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id || Math.random().toString(36).substring(2, 9)}>
                      <TableCell>{invoice.invoice_no}</TableCell>
                      <TableCell>{invoice.estimate_id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body1">{invoice.company_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invoice.gstn}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>₹{(invoice.amount_payable || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Box sx={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: invoice.status === 'PAID' ? "#4caf50" :
                            invoice.status === 'GENERATED' ? "#2196f3" : "#f44336",
                          color: "white",
                          fontWeight: "bold"
                        }}>
                          {invoice.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleDownloadPdf(invoice.id)}
                            title="Download PDF"
                            disabled={!invoice.id}
                          >
                            <PictureAsPdf />
                          </IconButton>
                          {/* <IconButton
                            color="secondary"
                            onClick={() => {
                              setInvoiceToUpdate(invoice);
                              setEmailToUpdate(invoice.client_email || "");
                            }}
                            title="Update Email"
                            disabled={!invoice.id}
                          >
                            <Email />
                          </IconButton> */}
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              console.log('Invoice ID:', invoice.id);
                              if (!invoice.id) {
                                showSnackbar('Cannot update email - missing invoice ID', 'error');
                                return;
                              }
                              navigate(`/update-invoice/${invoice.id}`);
                            }}
                            title="Update Email"
                            disabled={!invoice.id}
                          >
                            <Email />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setInvoiceToDelete(invoice.id);
                              setOpenDeleteDialog(true);
                            }}
                            title="Delete Invoice"
                            disabled={!invoice.id}
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

      <Dialog open={!!invoiceToUpdate} onClose={() => setInvoiceToUpdate(null)}>
        <DialogTitle>Update Client Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Client Email"
            type="email"
            fullWidth
            variant="standard"
            value={emailToUpdate}
            onChange={(e) => setEmailToUpdate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceToUpdate(null)}>Cancel</Button>
          <Button onClick={handleUpdateEmail} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this invoice? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default ManageInvoices;
