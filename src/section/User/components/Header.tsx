import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onCreateUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateUser }) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          {t("internalAccount")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("internalAccountDescription")}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateUser}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 3,
        }}
      >
        {t("createNewAccount")}
      </Button>
    </Box>
  );
};

export default Header;
