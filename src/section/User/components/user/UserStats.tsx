import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
} from "@mui/material";
import {
  Person as ManagerIcon,
} from "@mui/icons-material";
import type { User } from "@/types/user.types";
import { useTranslation } from "react-i18next";

interface UserStatsProps {
  internalUsers: User[];
}

const UserStats: React.FC<UserStatsProps> = ({ internalUsers }) => {
  const { t } = useTranslation();

  // Calculate user statistics
  const managersCount =
    internalUsers?.filter((u: User) => u.role === "manager").length || 0;
  const supervisorsCount =
    internalUsers?.filter((u: User) => u.role === "supervisor").length || 0;
  const staffCount =
    internalUsers?.filter((u: User) => u.role === "staff").length || 0;
  const totalUsers = internalUsers?.length || 0;

  const cards = [
    {
      title: t("managers"),
      value: managersCount,
      icon: <ManagerIcon />,
      color: "success.main",
      bgcolor: "success.light",
    },
    {
      title: t("supervisors"),
      value: supervisorsCount,
      icon: <ManagerIcon />,
      color: "error.main",
      bgcolor: "error.light",
    },
    {
      title: t("staffs"),
      value: staffCount,
      icon: <ManagerIcon />,
      color: "info.main",
      bgcolor: "info.light",
    },
    {
      title: t("totalInternalAccounts"),
      value: totalUsers,
      icon: <ManagerIcon />,
      color: "warning.main",
      bgcolor: "warning.light",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: card.bgcolor,
                    color: card.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {card.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStats;
