import React, { useState } from "react";
import { Box, Typography, Paper, Container, Tabs, Tab } from "@mui/material";
import { useUserInfo } from "@/hooks/useAuth";
import Internal from "./Internal";
import UserLog from "./UserLog";
import { useTranslation } from "react-i18next";

const User: React.FC = () => {
  const { data: currentUser } = useUserInfo();
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  return (
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

        {/* Tabs for management and logs */}
        {currentUser?.role &&
        ["admin", "manager", "staff"].includes(currentUser.role) ? (
          <>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              indicatorColor="primary"
              textColor="primary"
              sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label={t("userManagement") || "Quản lý"} />
              <Tab label={t("userActivityLogs") || "Lịch sử hoạt động"} />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tab === 0 && <Internal />}
              {tab === 1 && <UserLog />}
            </Box>
          </>
        ) : (
          <Box sx={{ p: 3 }}>
            {/* Add content for other roles here if needed */}
          </Box>
        )}
      </Paper>
  );
};

export default User;
