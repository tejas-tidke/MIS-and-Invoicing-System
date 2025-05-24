import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ChainIcon from "@mui/icons-material/Link";
import BrandIcon from "@mui/icons-material/BrandingWatermark";
import SubzoneIcon from "@mui/icons-material/Map";
import EstimateIcon from "@mui/icons-material/Calculate";
import InvoiceIcon from "@mui/icons-material/Receipt";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const role = authService.getUserRole();
    if (!role) {
      navigate("/login");
      return;
    }
    setUserRole(role);
  }, [navigate]);

  if (!userRole) {
    return <Typography>Loading...</Typography>;
  }

  const dashboardItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Manage Groups", icon: <GroupIcon />, path: "/manage-groups" },
    { text: "Manage Chain", icon: <ChainIcon />, path: "/manage-chain" },
    { text: "Manage Brands", icon: <BrandIcon />, path: "/manage-brands" },
    { text: "Manage SubZones", icon: <SubzoneIcon />, path: "/manage-subzones" },
    { text: "Manage Estimate", icon: <EstimateIcon />, path: "/manage-estimate" },
    { text: "Manage Invoices", icon: <InvoiceIcon />, path: "/manage-invoices" },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "32px 24px",
        background: "linear-gradient(to right, #e3f2fd, #fce4ec)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
      >
        Welcome, {userRole === "ROLE_ADMIN" ? "Admin" : "Salesperson"}!
      </Typography>

      <Grid container spacing={4} sx={{ marginTop: "32px" }}>
        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.text}>
            <Card
              onClick={() => handleCardClick(item.path)}
              sx={{
                height: "100%",
                borderRadius: "16px",
                padding: "20px",
                background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 44,
                      height: 44,
                    }}
                  >
                    {React.cloneElement(item.icon, { fontSize: "medium" })}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                    {item.text}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  Manage {item.text.toLowerCase()} and ensure smooth operations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
