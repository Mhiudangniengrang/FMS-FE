import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

const Loading: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      padding: 6,
      userSelect: "none",
    }}
  >
    <CircularProgress size={60} />
    <Typography variant="body1" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

export default Loading;
