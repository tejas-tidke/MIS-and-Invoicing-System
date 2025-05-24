import React, { useState, useEffect } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CssBaseline,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserEmail();
    }
  }, []);

  // Fetch the logged-in user's email
  const fetchUserEmail = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setEmail(userData.email);
    } catch (error) {
      console.error("Failed to fetch user email", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setMessage("Password reset email sent! Check your inbox.");

      if (isLoggedIn) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setMessage("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
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
            <LockResetIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: 2 }}>
            {isLoggedIn ? "Reset Password" : "Forgot Password"}
          </Typography>

          {message && <Alert severity="success" sx={{ marginBottom: 2 }}>{message}</Alert>}

          <form onSubmit={handleSubmit}>
            {!isLoggedIn && (
              <TextField
                label="Email"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: "16px" }}
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                marginTop: "16px",
                textTransform: "none",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;