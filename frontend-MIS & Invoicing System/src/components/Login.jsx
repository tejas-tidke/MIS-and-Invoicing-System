import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const token = response.data;
      localStorage.setItem("token", token);

      setUser({ token });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        console.log("Response Data:", err.response.data);
        console.log("Response Status:", err.response.status);

        switch (err.response.status) {
          case 403:
            setError("Email not verified. Please check your email for the verification link.");
            setTimeout(() => {
              navigate("/resend-verification", { state: { email } });
            }, 3000);
            break;
          case 401:
            setError("Invalid email or password.");
            break;
          default:
            setError("An error occurred. Please try again later.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
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
          <Avatar sx={{ backgroundColor: "#1976d2", width: 56, height: 56, margin: "0 auto 16px" }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: 2 }}>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2, padding: "10px" }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: "16px" }}
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
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
          <Typography variant="body2" sx={{ marginTop: "16px", fontSize: "14px" }}>
            <Link to="/forgot-password" style={{ textDecoration: "none", color: "#1976d2" }}>
              Forgot Password?
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;