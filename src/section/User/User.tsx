import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper, Container } from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import UserList from "./UserList";
import { useUserInfo } from "@/hooks/useAuth";
import Internal from "./Internal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  };
}

const User: React.FC = () => {
  const [value, setValue] = useState(0);
  const { data: currentUser } = useUserInfo();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            User account and permission management system
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="user management tabs"
          >
            {/* Tab 1: Internal Management (admin, manager, staff only) */}
            {currentUser?.role &&
              ["admin", "manager", "staff"].includes(currentUser.role) && (
                <Tab
                  icon={<AdminIcon />}
                  iconPosition="start"
                  label="Internal Management"
                  {...a11yProps(0)}
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    minHeight: 64,
                  }}
                />
              )}

            {/* Tab 2: User List */}
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="User List"
              {...a11yProps(
                currentUser?.role &&
                  ["admin", "manager", "staff"].includes(currentUser.role)
                  ? 1
                  : 0
              )}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                minHeight: 64,
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {currentUser?.role &&
          ["admin", "manager", "staff"].includes(currentUser.role) && (
            <TabPanel value={value} index={0}>
              <Internal />
            </TabPanel>
          )}

        <TabPanel
          value={value}
          index={
            currentUser?.role &&
            ["admin", "manager", "staff"].includes(currentUser.role)
              ? 1
              : 0
          }
        >
          <UserList />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default User;
