import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
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

interface LowStockAlertProps {
  inventoryData: InventoryItem[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ inventoryData }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);

  const lowStockItems = inventoryData.filter(
    (item) => item.stockStatus === "Low"
  );

  if (lowStockItems.length === 0) return null;

  return (
    <Alert
      severity="warning"
      sx={{ mb: 3 }}
      action={
        <IconButton
          color="inherit"
          size="small"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      }
    >
      <AlertTitle>{t("Low Stock Alert")}</AlertTitle>
      {t("You have {{count}} items with low stock levels", {
        count: lowStockItems.length,
      })}

      <Collapse in={expanded}>
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {lowStockItems.map((item, index) => (
            <Chip
              key={index}
              label={`${item.name} (${item.totalQuantity}/${item.minStock})`}
              size="small"
              color="warning"
              variant="outlined"
            />
          ))}
        </Box>
      </Collapse>
    </Alert>
  );
};

export default LowStockAlert;
