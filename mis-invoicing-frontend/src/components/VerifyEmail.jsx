import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/authService"; // Import the service
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
  Paper,
  CssBaseline,
} from "@mui/material";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link. Please check your email.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const verifyUserEmail = async () => {
      try {
        await authService.verifyEmail(token); // Use service function
        setMessage("Email verified successfully! Redirecting to login...");
        setIsError(false);
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        console.error("Verification error:", error);
        const errorMessage =
          error.response?.data || "Invalid or expired verification link.";
        if (errorMessage.includes("already verified")) {
          setMessage("Your email is already verified. Please log in.");
        } else if (errorMessage.includes("expired")) {
          setMessage("Your verification link has expired. Request a new one.");
        } else {
          setMessage(errorMessage);
        }
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  const handleResendVerification = () => {
    navigate("/resend-verification");
  };

  const handleGoToLogin = () => {
    navigate("/login");
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
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: 2 }}>
            Email Verification
          </Typography>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>
                {message}
              </Alert>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                {isError && (
                  <Button variant="contained" color="primary" onClick={handleResendVerification}>
                    Resend Verification Email
                  </Button>
                )}
                <Button variant="outlined" color="primary" onClick={handleGoToLogin}>
                  Go to Login
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyEmail;
