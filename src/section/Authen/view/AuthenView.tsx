import React from "react";
import {
  Typography,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
  CssBaseline,
} from "@mui/material";
import Register from "../Register";
import { useLocation } from "react-router-dom";
import Login from "../Login";
import { useTranslation } from "react-i18next";

const AuthenView: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isRegister: boolean = location.pathname === "/register";
  const { t } = useTranslation();
  return (
    <Box
      className="mui-background"
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        p: { xs: 1, sm: 2 },
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <CssBaseline />
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: { xs: 2, sm: 3 },
          minHeight: {
            md: "500px",
          },
          maxHeight: {
            xs: "100%",
            md: "800px",
          },
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            maxHeight: {
              xs: isRegister ? "calc(100vh - 40px)" : "auto",
              md: "850px",
            },
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {isRegister ? t("register") : t("login")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: { xs: 1, sm: 1.5 },
                fontSize: "0.875rem",
              }}
            >
              {isRegister ? t("registerDescription") : t("loginDescription")}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            {isRegister ? <Register /> : <Login />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthenView;
