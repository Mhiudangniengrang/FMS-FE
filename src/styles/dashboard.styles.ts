import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

interface DashboardStyles {
  drawerStyles: (drawerWidth: number) => SxProps<Theme>;
  logoContainer: SxProps<Theme>;
  logoBox: SxProps<Theme>;
  logoTextContainer: (collapsed: boolean) => SxProps<Theme>;
  appBar: SxProps<Theme>;
  toolbar: SxProps<Theme>;
  menuIconButton: SxProps<Theme>;
  iconButton: SxProps<Theme>;
  badge: SxProps<Theme>;
  contentBox: SxProps<Theme>;
  contentPaper: SxProps<Theme>;
  menuPaperProps: {
    elevation: number;
    sx: SxProps<Theme>;
  };
  listItemButton: (selectedKey: string, itemKey: string) => SxProps<Theme>;
  listItemIcon: (
    selectedKey: string,
    itemKey: string,
    collapsed: boolean
  ) => SxProps<Theme>;
  userMenuBox: SxProps<Theme>;
  avatar: SxProps<Theme>;
}

// Dashboard styles
export const dashboardStyles: DashboardStyles = {
  drawerStyles: (drawerWidth: number) => ({
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      borderRight: "none",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
      bgcolor: "#ffffff",
      transition: "width 0.2s ease-in-out",
      overflowX: "hidden",
      backgroundImage: "linear-gradient(to bottom, #ffffff, #f9fbfd)",
    },
  }),

  logoContainer: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2,
    borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
  },

  logoTextContainer: (collapsed: boolean) => ({
    ml: 1.5,
    opacity: collapsed ? 0 : 1,
    width: collapsed ? 0 : "auto",
    overflow: "hidden",
    transition: "all 0.2s ease-in-out",
  }),

  appBar: {
    width: "100%",
    bgcolor: "#ffffff",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  },

  toolbar: {
    justifyContent: "space-between",
    height: 64,
    px: { xs: 1, sm: 2 },
  },

  menuIconButton: {
    color: "text.secondary",
    borderRadius: "8px",
    "&:hover": {
      bgcolor: "rgba(25, 118, 210, 0.04)",
    },
  },

  iconButton: {
    color: "text.secondary",
    bgcolor: "#f5f7fa",
    borderRadius: "8px",
    width: 36,
    height: 36,
    "&:hover": {
      bgcolor: "#f0f2f5",
    },
  },

  badge: {
    "& .MuiBadge-badge": {
      bgcolor: "#1976d2",
      fontWeight: "bold",
    },
  },

  contentBox: {
    flexGrow: 1,
    overflow: "auto",
    height: "calc(100vh - 64px)",
    bgcolor: "#f8fafc",
  },

  contentPaper: {
    borderRadius: 3,
    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0, 0, 0, 0.03)",
    background: "linear-gradient(to bottom right, #ffffff, #fafcff)",
    minHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 24px)" },
    overflow: "hidden",
  },

  // Menu styles
  menuPaperProps: {
    elevation: 3,
    sx: {
      borderRadius: 2,
      minWidth: 280,
      maxWidth: "90vw",
      overflow: "visible",
      mt: 1.5,
      "& .MuiAvatar-root": {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      "&:before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: "background.paper",
        transform: "translateY(-50%) rotate(45deg)",
        zIndex: 0,
      },
    },
  },

  // List item styles
  listItemButton: (selectedKey: string, itemKey: string) => ({
    minHeight: 44,
    px: 1.5,
    py: 0.75,
    borderRadius: "8px",
    bgcolor: selectedKey === itemKey ? "#e3f2fd" : "transparent",
    color: selectedKey === itemKey ? "#1976d2" : "inherit",
    "&.Mui-selected": {
      bgcolor: "#e3f2fd",
      color: "#1976d2",
      "&:hover": {
        bgcolor: "#e3f2fd",
      },
      "& .MuiListItemIcon-root": {
        color: "#1976d2",
      },
    },
    "&:hover": {
      bgcolor: selectedKey === itemKey ? "#e3f2fd" : "rgba(25, 118, 210, 0.04)",
    },
  }),

  listItemIcon: (selectedKey: string, itemKey: string, collapsed: boolean) => ({
    minWidth: 0,
    mr: collapsed ? "auto" : 2.5,
    justifyContent: collapsed ? "center" : "flex-start",
    color: selectedKey === itemKey ? "#1976d2" : "text.secondary",
  }),

  userMenuBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    cursor: "pointer",
    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
    borderRadius: 2,
    px: { xs: 1, sm: 1.5 },
    py: 0.75,
    ml: 0.5,
  },

  avatar: {
    width: 36,
    height: 36,
    border: "2px solid rgba(25, 118, 210, 0.1)",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};
