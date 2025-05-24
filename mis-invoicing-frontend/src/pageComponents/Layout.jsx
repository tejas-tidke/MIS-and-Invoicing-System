import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  CssBaseline,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ChainIcon from "@mui/icons-material/Link";
import BrandIcon from "@mui/icons-material/BrandingWatermark";
import SubzoneIcon from "@mui/icons-material/Map";
import EstimateIcon from "@mui/icons-material/Calculate";
import InvoiceIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";

const Layout = ({ logout }) => {
  const navigate = useNavigate();
  const userRole = authService.getUserRole();

  const sidebarItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Manage Groups", icon: <GroupIcon />, path: "/manage-groups" },
    { text: "Manage Chain", icon: <ChainIcon />, path: "/manage-chain" },
    { text: "Manage Brands", icon: <BrandIcon />, path: "/manage-brands" },
    { text: "Manage SubZones", icon: <SubzoneIcon />, path: "/manage-subzones" },
    { text: "Manage Estimate", icon: <EstimateIcon />, path: "/manage-estimate" },
    { text: "Manage Invoices", icon: <InvoiceIcon />, path: "/manage-invoices" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleResetPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* Enhanced App Bar with gradient background */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1300, 
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          height: 64,
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: "100%" }}>
          {/* Left side - Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src="public/logo.svg"
              alt="MIS Logo"
              sx={{
                height: 40,
                width: 40,
                marginRight: 2,
                filter: "brightness(0) invert(1)",
                transition: "transform 0.2s ease-in-out",
                '&:hover': {
                  transform: "scale(1.1)",
                }
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold",
                fontSize: "1.25rem",
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              MIS SYSTEM
            </Typography>
          </Box>

          {/* Right side - User actions */}
          <Box>
            <Button
              color="inherit"
              onClick={handleResetPassword}
              startIcon={<LockResetIcon />}
              sx={{ 
                textTransform: "none", 
                marginRight: 2,
                borderRadius: "20px",
                padding: "8px 16px",
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Reset Password
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                textTransform: "none",
                borderRadius: "20px",
                padding: "8px 16px",
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          "& .MuiDrawer-paper": { 
            width: 260, 
            boxSizing: "border-box", 
            background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
            padding: "16px 0",
            position: "fixed", 
            zIndex: 1200,
            borderRight: "1px solid #dee2e6",
            boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Toolbar />
        
        {/* Enhanced User Profile Section */}
        <Box sx={{ 
          textAlign: "center", 
          padding: "20px 16px",
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          marginBottom: "8px",
        }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "3px solid rgba(255,255,255,0.3)",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {userRole === "ROLE_ADMIN" ? "A" : "S"}
          </Avatar>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            marginTop: 2,
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}>
            {userRole === "ROLE_ADMIN" ? "Admin Panel" : "Sales Dashboard"}
          </Typography>
          <Typography variant="body2" sx={{ 
            opacity: 0.9,
            fontSize: "0.875rem",
          }}>
            Welcome back!
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: "#dee2e6" }} />
        
        {/* Enhanced Navigation List */}
        <List sx={{ padding: "8px" }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                margin: "4px 8px",
                borderRadius: "12px",
                padding: "12px 16px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  transform: "translateX(8px)",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: "40px", 
                color: "#1976d2",
                transition: "color 0.2s ease-in-out",
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: "medium",
                  fontSize: "0.95rem",
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Enhanced Footer */}
        <Box sx={{ marginTop: "auto", padding: "16px" }}>
          <Divider sx={{ marginBottom: "16px", backgroundColor: "#dee2e6" }} />
          <Typography 
            variant="caption" 
            sx={{ 
              color: "#6c757d",
              textAlign: "center",
              display: "block",
              fontSize: "0.75rem",
            }}
          >
            MIS v2.0 © 2024
          </Typography>
        </Box>
      </Drawer>

      {/* Enhanced Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: "260px",
          padding: "24px",
          paddingTop: "88px", // Increased to account for new header height
          background: "linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)",
          minHeight: "calc(100vh - 64px)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;