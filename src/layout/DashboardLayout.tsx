import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  PersonAdd as PersonAddIcon,
  LaptopMac as LaptopMacIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Logout as LogoutIcon,
  History as HistoryIcon,
  LocationOn as LocationOnIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  CssBaseline,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/unit-corp-logo.webp";
import { dashboardStyles } from "@/styles/dashboard.styles";
import type { MenuItemType, DashboardLayoutProps } from "@/types";
import { createMenuItem } from "@/utils";
import { useUserInfo, useLogout } from "@/hooks/useAuth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Cookies from "js-cookie";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] =
    useState<null | HTMLElement>(null);
  const location = useLocation();
  const { t } = useTranslation();
  const userRole = Cookies.get("__role") || "guest";

  // Menu items for admin
  const adminMenuItems: MenuItemType[] = [
    createMenuItem(t("overview"), "1", <HomeIcon />, "/overview"),
    createMenuItem(
      t("accountManagement"),
      "2",
      <PersonAddIcon />,
      "/user/view"
    ),
    createMenuItem(
      t("departmentManagement"),
      "3",
      <LocationOnIcon />,
      "/departments/view"
    ),
    createMenuItem(
      t("inventoryManagement"),
      "4",
      <InventoryIcon />, // Thay thế ở đây
      "/inventory/view"
    ),

    createMenuItem(t("assetManagement"), "5", <LaptopMacIcon />, "/asset/view"),
    createMenuItem(
      "Maintenance Management",
      "6",
      <SettingsIcon />,
      "/maintenance/management"
    ),
  ];

  // Menu items for staff
  const staffMenuItems: MenuItemType[] = [
    createMenuItem(
      t("staffMaintenance"),
      "1",
      <SettingsIcon />,
      "/staff/maintenance"
    ),
  ];

  const items: MenuItemType[] =
    userRole === "admin" || userRole === "manager"
      ? adminMenuItems
      : staffMenuItems;

  // React Query for user data
  const { data: infoUser } = useUserInfo();
  const logoutMutation = useLogout();

  // Handle overflow issues when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600 && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  // React Query tự động fetch user info khi có token
  // Không cần manual useEffect nữa

  const selectedKey =
    items.find((item) => {
      return item.path === location.pathname;
    })?.key || "1";

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleUserMenuClick = (key: string) => {
    handleCloseUserMenu();
    if (key === "logout") {
      logoutMutation.mutate();
    }
  };

  const drawerWidth = collapsed ? 70 : 250;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={dashboardStyles.drawerStyles(drawerWidth)}
        open={!collapsed}
      >
        {/* Logo */}
        <Box sx={dashboardStyles.logoContainer}>
          <Box sx={dashboardStyles.logoBox}>
            <Box
              sx={{
                flexShrink: 0,
                width: 36,
                height: 36,
                bgcolor: "#f0f7ff",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0, 115, 230, 0.08)",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "70%", height: "70%", objectFit: "contain" }}
              />
            </Box>
            <Box sx={dashboardStyles.logoTextContainer(collapsed)}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.5px",
                }}
              >
                FMS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  opacity: 0.8,
                  fontSize: "0.7rem",
                }}
              >
                {t("facilityManagementSystem")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ px: 1.5, mt: 1.5, overflowY: "auto" }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.5px",
              pl: 2,
              display: collapsed ? "none" : "block",
            }}
          >
            {t("mainMenu")}
          </Typography>
          <List sx={{ pt: 0.5 }}>
            {items.map((item) => (
              <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selectedKey === item.key}
                  sx={dashboardStyles.listItemButton(selectedKey, item.key)}
                >
                  <ListItemIcon
                    sx={dashboardStyles.listItemIcon(
                      selectedKey,
                      item.key,
                      collapsed
                    )}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      noWrap: true,
                    }}
                    sx={{
                      opacity: collapsed ? 0 : 1,
                      display: collapsed ? "none" : "block",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Layout */}
      <Box
        sx={{
          flexGrow: 1,
          width: { xs: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header - Fixed position */}
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={dashboardStyles.appBar}
        >
          <Toolbar sx={dashboardStyles.toolbar}>
            {/* Left side of header */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                onClick={() => setCollapsed(!collapsed)}
                edge="start"
                sx={dashboardStyles.menuIconButton}
              >
                {collapsed ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
            </Box>

            {/* Right side of header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LanguageSwitcher />
              <IconButton
                color="inherit"
                onClick={handleOpenNotificationMenu}
                sx={dashboardStyles.iconButton}
              >
                <Badge
                  badgeContent={2}
                  color="primary"
                  sx={dashboardStyles.badge}
                >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              <Menu
                id="notification-menu"
                anchorEl={anchorElNotification}
                keepMounted
                open={Boolean(anchorElNotification)}
                onClose={handleCloseNotificationMenu}
                PaperProps={dashboardStyles.menuPaperProps}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box
                  sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t("notifications")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("unreadMessages", { count: 2 })}
                  </Typography>
                </Box>
                <MenuItem onClick={handleCloseNotificationMenu} sx={{ py: 2 }}>
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {t("systemUpdate")}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        {t("hoursAgo", { count: 1 })}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.85rem",
                        color: "text.secondary",
                        mt: 0.5,
                      }}
                    >
                      {t("newVersionReleased")}
                    </Typography>
                  </Box>
                </MenuItem>
                <Box
                  sx={{
                    p: 1,
                    textAlign: "center",
                    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                  >
                    {t("viewAll")}
                  </Typography>
                </Box>
              </Menu>

              <Box
                onClick={handleOpenUserMenu}
                sx={dashboardStyles.userMenuBox}
              >
                <Avatar
                  src="https://i.pinimg.com/474x/90/57/0a/90570addee2645866a597530721f37fd.jpg"
                  sx={dashboardStyles.avatar}
                />
                <Box sx={{ display: { xs: "none", lg: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {infoUser?.name || "Admin"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {infoUser?.role || "Administrator"}
                  </Typography>
                </Box>
              </Box>
              <Menu
                id="user-menu"
                anchorEl={anchorElUser}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={dashboardStyles.menuPaperProps}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box
                  sx={{
                    p: 2,
                    pb: 1.5,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {infoUser?.name || "Admin"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {infoUser?.email || "admin@example.com"}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => handleUserMenuClick("profile")}
                  sx={{
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "text.secondary" }}>
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("userProfile")} />
                </MenuItem>
                <MenuItem
                  onClick={() => handleUserMenuClick("settings")}
                  sx={{
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "text.secondary" }}>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("settings")} />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={() => handleUserMenuClick("logout")}
                  sx={{
                    py: 1.5,
                    color: "#f44336",
                    "&:hover": { bgcolor: "rgba(244, 67, 54, 0.04)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "#f44336" }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("logout")} />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content with auto overflow */}
        <Box
          component="main"
          sx={{
            ...dashboardStyles.contentBox,
            p: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Paper elevation={0} sx={dashboardStyles.contentPaper}>
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
