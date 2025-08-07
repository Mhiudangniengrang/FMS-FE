import React from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import {
  Business as DepartmentIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import type { Asset } from "../../Asset/types";

interface DepartmentSummary {
  department: string;
  assetCount: number;
  assets: Asset[];
  totalValue: number;
  categories: { [key: string]: number };
}

interface DepartmentSummaryCardsProps {
  filteredDepartments: DepartmentSummary[];
  assets: Asset[];
  formatCurrency: (value: number) => string;
}

const DepartmentSummaryCards: React.FC<DepartmentSummaryCardsProps> = ({
  filteredDepartments,
  assets,
  formatCurrency,
}) => {
  const { t } = useTranslation();

  // Calculate summary statistics
  const totalDepartments = filteredDepartments.length;
  const totalAssets = filteredDepartments.reduce((sum, dept) => {
    return (
      sum +
      dept.assets.reduce(
        (assetSum, asset) => assetSum + (asset.quantity || 1),
        0
      )
    );
  }, 0);
  const totalValue = filteredDepartments.reduce(
    (sum, dept) => sum + dept.totalValue,
    0
  );
  const totalCategories = new Set(assets.map((asset) => asset.category)).size;

  const cards = [
    {
      title: t("totalDepartments"),
      value: totalDepartments,
      icon: <DepartmentIcon />,
      color: "primary.main",
      bgcolor: "primary.light",
    },
    {
      title: t("Total Assets"),
      value: totalAssets,
      icon: <InventoryIcon />,
      color: "success.main",
      bgcolor: "success.light",
    },
    {
      title: t("Total Value"),
      value: formatCurrency(totalValue),
      icon: <MoneyIcon />,
      color: "info.main",
      bgcolor: "info.light",
    },
    {
      title: t("Asset Categories"),
      value: totalCategories,
      icon: <CategoryIcon />,
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

export default DepartmentSummaryCards;
