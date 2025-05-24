import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  CssBaseline,
  Alert,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const ResendVerificationPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [message, setMessage] = useState("");

  const handleResendVerification = async () => {
    try {
      await authService.resendVerificationEmail(email);
      setMessage("Verification email sent. Please check your inbox.");
    } catch (error) {
      setMessage("Failed to resend verification email. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: "40px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            textAlign: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "#1976d2",
              width: 56,
              height: 56,
              margin: "0 auto 16px",
            }}
          >
            <EmailOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: 2 }}>
            Resend Verification Email
          </Typography>

          {message && (
            <Alert severity={message.includes("sent") ? "success" : "error"} sx={{ marginBottom: 2 }}>
              {message}
            </Alert>
          )}

          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleResendVerification}
            sx={{
              marginTop: "16px",
              textTransform: "none",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Resend Verification Email
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResendVerificationPage;