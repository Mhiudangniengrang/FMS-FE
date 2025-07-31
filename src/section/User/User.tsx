import React from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import { useUserInfo } from "@/hooks/useAuth";
import Internal from "./Internal";
import { useTranslation } from "react-i18next";

const User: React.FC = () => {
  // Tabs removed, no need for value state
  const { data: currentUser } = useUserInfo();
  const { t } = useTranslation();

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Paper elevation={0} sx={{ width: "100%", bgcolor: "background.paper" }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {t("accountManagement")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("userManagementDescription")}
          </Typography>
        </Box>

        {/* Tabs removed since only one tab is present for this role */}

        {/* Show Internal directly if only one tab would be present */}
        {currentUser?.role &&
        ["admin", "manager", "staff"].includes(currentUser.role) ? (
          <Box sx={{ p: 3 }}>
            <Internal />
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            {/* Add content for other roles here if needed */}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default User;
