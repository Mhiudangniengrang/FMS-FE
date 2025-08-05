import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onCreateEmployee: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateEmployee }) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          {t("employeeManagement")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("employeeManagementDescription")}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateEmployee}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 3,
        }}
      >
        {t("addEmployee")}
      </Button>
    </Box>
  );
};
