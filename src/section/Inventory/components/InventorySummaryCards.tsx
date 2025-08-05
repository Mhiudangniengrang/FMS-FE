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
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

interface InventoryItem {
  id: number;
  name: string;
  model: string;
  category: string;
  brand: string;
  location: string;
  totalQuantity: number;
  totalValue: number;
  averageValue: number;
  minStock: number;
  stockStatus: "Low" | "Normal";
}

interface InventorySummaryCardsProps {
  inventoryData: InventoryItem[];
  formatCurrency: (value: number) => string;
}

const InventorySummaryCards: React.FC<InventorySummaryCardsProps> = ({
  inventoryData,
  formatCurrency,
}) => {
  const { t } = useTranslation();

  const totalItems = inventoryData.length;
  const totalQuantity = inventoryData.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );
  const totalValue = inventoryData.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  const lowStockItems = inventoryData.filter(
    (item) => item.stockStatus === "Low"
  ).length;

  const cards = [
    {
      title: t("Total Item Types"),
      value: totalItems,
      icon: <InventoryIcon />,
      color: "primary.main",
      bgcolor: "primary.light",
    },
    {
      title: t("Total Quantity"),
      value: totalQuantity,
      icon: <TrendingUpIcon />,
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
      title: t("Low Stock Items"),
      value: lowStockItems,
      icon: <WarningIcon />,
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

export default InventorySummaryCards;
