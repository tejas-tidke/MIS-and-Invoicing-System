import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group"; 
import ChainIcon from "@mui/icons-material/Link"; 
import BrandIcon from "@mui/icons-material/BrandingWatermark"; 
import SubzoneIcon from "@mui/icons-material/Map"; 
import EstimateIcon from "@mui/icons-material/Calculate";
import InvoiceIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset"; 
import authService from "../services/authService";

const Navbar = ({ user, logout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const userRole = user ? authService.getUserRole() : null;

  const sidebarItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
    {
      text: "Manage Groups",
      icon: <GroupIcon />,
      path: "/dashboard",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
    {
      text: "Manage Chain",
      icon: <ChainIcon />,
      path: "/manage-chain",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
    {
      text: "Manage Brands",
      icon: <BrandIcon />,
      path: "/manage-brands",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
    {
      text: "Manage SubZones",
      icon: <SubzoneIcon />,
      path: "/manage-subzones",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
    {
      text: "Manage Estimate",
      icon: <EstimateIcon />,
      path: "/manage-estimate",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
    {
      text: "Manage Invoices",
      icon: <InvoiceIcon />,
      path: "/manage-invoices",
      roles: ["ROLE_ADMIN", "ROLE_SALES_PERSON"],
    },
  ];

  const filteredSidebarItems = sidebarItems.filter((item) => item.roles.includes(userRole));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleResetPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      {/* Enhanced AppBar with gradient background */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          zIndex: 1300, 
          height: 64,
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.3)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
          {/* Left side - Menu button (mobile) and Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && user && (
              <IconButton 
                color="inherit" 
                edge="start" 
                onClick={toggleDrawer(true)} 
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo and Title */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src="/public/logo.svg"
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
                  fontSize: isMobile ? "1rem" : "1.25rem",
                  display: { xs: "none", sm: "block" },
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                MIS SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Right side - User actions */}
          {!isMobile && (
            <Box>
              {user ? (
                <>
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
                    onClick={logout}
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
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ 
                      textTransform: "none", 
                      padding: "8px 16px", 
                      marginRight: 1,
                      borderRadius: "20px",
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/register"
                    sx={{
                      textTransform: "none",
                      padding: "8px 16px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "20px",
                      "&:hover": { 
                        backgroundColor: "rgba(255,255,255,0.3)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile menu for authenticated users */}
          {isMobile && user && (
            <Box>
              <Button
                color="inherit"
                onClick={logout}
                sx={{ 
                  textTransform: "none", 
                  minWidth: "auto", 
                  p: 1,
                  borderRadius: "50%",
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <LogoutIcon />
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Enhanced Sidebar Drawer */}
      {user && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 260,
              background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
              padding: "16px 0",
              position: "fixed",
              zIndex: 1200,
              borderRight: "1px solid #dee2e6",
              boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
            },
          }}
        >
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

          {/* Enhanced Navigation List */}
          <List sx={{ padding: "8px" }}>
            {filteredSidebarItems.map((item, index) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={toggleDrawer(false)}
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

          {/* Enhanced Divider and Footer */}
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
      )}
    </>
  );
};

export default Navbar;