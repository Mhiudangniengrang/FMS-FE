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
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Employee, DepartmentStats } from "@/types/employeeType";

// ✅ Sửa interface để khớp với db.json structure
interface Department {
  id: number;
  name: string;
  description: string;
  employees?: { id: string; name: string }[];
}

interface EmployeeStatsProps {
  employees: Employee[];
  departmentStats?: DepartmentStats;
  departments?: Department[];
  isLoading: boolean;
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({
  employees,
  departmentStats,
  departments,
  isLoading,
}) => {
  const { t } = useTranslation();

  const totalEmployees = employees?.length || 0;
  const totalDepartments = departmentStats
    ? Object.keys(departmentStats).length
    : 0;

  // Tính số position khác nhau
  const uniquePositions = employees
    ? new Set(employees.map((emp) => emp.position)).size
    : 0;

  const stats = [
    {
      title: t("totalEmployees"),
      value: totalEmployees,
      icon: <PeopleIcon />,
      color: "primary.main",
      bgcolor: "primary.light",
    },
    {
      title: t("totalDepartments"),
      value: totalDepartments,
      icon: <BusinessIcon />,
      color: "success.main",
      bgcolor: "success.light",
    },
    {
      title: t("totalPositions"),
      value: uniquePositions,
      icon: <WorkIcon />,
      color: "info.main",
      bgcolor: "info.light",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.bgcolor,
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? "..." : stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
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
