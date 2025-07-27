import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "./routes/section";
import React from "react";
import { Snackbar, Alert, Box, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

// Hàm global để show snackbar
export const showSnackbar = (
  message: string,
  severity: "success" | "error" = "success"
) => {
  window.dispatchEvent(
    new CustomEvent("show-snackbar", { detail: { message, severity } })
  );
};

function App() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState<"success" | "error">(
    "success"
  );

  React.useEffect(() => {
    const handler = (e: any) => {
      setMessage(e.detail.message);
      setSeverity(e.detail.severity);
      setOpen(true);
    };
    window.addEventListener("show-snackbar", handler);
    return () => window.removeEventListener("show-snackbar", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <HelmetProvider>
      <div>
        <Router />
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {severity === "success" ? (
            <Box
              sx={{
                backgroundColor: "#2e7d32",
                color: "white",
                display: "flex",
                alignItems: "center",
                padding: "16px",
                borderRadius: "4px",
                width: "100%",
                boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
              }}
            >
              <CheckCircleIcon sx={{ marginRight: 1 }} />
              <Box sx={{ flexGrow: 1 }}>{message}</Box>
              <IconButton
                size="small"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Alert 
              severity={severity} 
              sx={{ width: "100%" }}
              onClose={handleClose}
            >
              {message}
            </Alert>
          )}
        </Snackbar>
      </div>
    </HelmetProvider>
  );
}

export default App;
