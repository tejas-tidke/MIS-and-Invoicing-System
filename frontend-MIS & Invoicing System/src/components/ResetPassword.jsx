import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import Navbar from "./Navbar"; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token"); 

  useEffect(() => {
    if (!isLoggedIn) {
      const searchParams = new URLSearchParams(location.search);
      const extractedToken = searchParams.get("token");
      if (!extractedToken) {
        setError("Invalid or expired reset link.");
      } else {
        setToken(extractedToken); 
      }
    }
  }, [location.search, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const authToken = isLoggedIn ? localStorage.getItem("token") : token;
      if (!authToken) {
        setError("Invalid or expired reset token.");
        setLoading(false);
        return;
      }

      await authService.resetPassword(authToken, newPassword, isLoggedIn);

      setSuccess("Password reset successful! Redirecting...");

      setTimeout(() => {
        navigate(isLoggedIn ? "/dashboard" : "/login"); 
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Include the Navbar component */}
      <Navbar user={isLoggedIn} logout={() => authService.logout()} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)", 
          backgroundColor: "#f0f2f5",
          marginTop: "64px", 
          padding: "24px", 
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
              Reset Password
            </Typography>

            {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ marginBottom: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ marginBottom: "16px" }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ marginBottom: "24px" }}
              />
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
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ResetPassword;