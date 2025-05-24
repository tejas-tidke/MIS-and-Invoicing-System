import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SALES_PERSON");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(name, email, password, role);
      alert("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
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
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: 2 }}>
            Register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2, padding: "10px" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              required
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
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
              sx={{ marginBottom: "24px" }}
            />

            {/* Role toggles */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                marginBottom: "24px",
              }}
            >
              {["ADMIN", "SALES_PERSON"].map((r) => (
                <Button
                  key={r}
                  variant={role === r ? "contained" : "outlined"}
                  onClick={() => setRole(r)}
                  sx={{
                    minWidth: 120,
                    fontWeight: "bold",
                    textTransform: "none",
                    borderColor: role === r ? "#1976d2" : "rgba(0, 0, 0, 0.23)",
                    color: role === r ? "#fff" : "rgba(0, 0, 0, 0.87)",
                    backgroundColor: role === r ? "#1976d2" : "transparent",
                    "&:hover": {
                      borderColor: "#1976d2",
                      backgroundColor: role === r ? "#1565c0" : "rgba(25, 118, 210, 0.08)",
                      color: role === r ? "#fff" : "rgba(25, 118, 210, 1)",
                    },
                  }}
                >
                  {r === "ADMIN" ? "Admin" : "Sales Person"}
                </Button>
              ))}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: "16px",
                textTransform: "none",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
