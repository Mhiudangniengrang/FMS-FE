import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { Business as DepartmentIcon } from "@mui/icons-material";

const DepartmentEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <DepartmentIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {t("No departments found")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("Try changing your search keywords")}
      </Typography>
    </Box>
  );
};

export default DepartmentEmptyState;
