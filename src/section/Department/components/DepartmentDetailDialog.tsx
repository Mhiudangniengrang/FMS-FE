import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Business as DepartmentIcon,
  Inventory as InventoryIcon,
  LaptopMac as LaptopIcon,
  Print as PrintIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import type { Asset } from "../../Asset/types";
import {
  useStatusTranslation,
  statusColors,
} from "../../Asset/utils/constants";

interface DepartmentSummary {
  department: string;
  assetCount: number;
  assets: Asset[];
  totalValue: number;
  categories: { [key: string]: number };
}

interface DepartmentDetailDialogProps {
  open: boolean;
  selectedDepartment: DepartmentSummary | null;
  formatCurrency: (value: number) => string;
  onClose: () => void;
}

const DepartmentDetailDialog: React.FC<DepartmentDetailDialogProps> = ({
  open,
  selectedDepartment,
  formatCurrency,
  onClose,
}) => {
  const { t } = useTranslation();

  const getAssetIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "máy tính":
      case "computer":
        return <LaptopIcon />;
      case "máy in":
      case "printer":
        return <PrintIcon />;
      case "điện thoại":
      case "phone":
        return <PhoneIcon />;
      default:
        return <InventoryIcon />;
    }
  };
  const { getStatusText } = useStatusTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <DepartmentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedDepartment?.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDepartment?.assetCount} {t("assets")} •{" "}
                {formatCurrency(selectedDepartment?.totalValue || 0)}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {selectedDepartment && (
          <Box>
            {/* Categories Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t("Asset Categories")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(selectedDepartment.categories).map(
                  ([category, count]) => (
                    <Chip
                      key={category}
                      label={`${category} (${count})`}
                      color="primary"
                      variant="outlined"
                    />
                  )
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Asset List */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t("Asset List")} ({selectedDepartment.assets.length} {t("items")}
              )
            </Typography>

            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {selectedDepartment.assets.map((asset) => (
                <ListItem
                  key={asset.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "grey.100" }}>
                      {getAssetIcon(asset.category)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="subtitle2" fontWeight="medium">
                            {asset.name}
                          </Typography>
                          <Chip
                            label={`${t("Qty")}: ${asset.quantity || 1}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="bold"
                        >
                          {formatCurrency(
                            (Number(asset.value) || 0) * (asset.quantity || 1)
                          )}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" display="block">
                          <strong>{t("Category")}:</strong> {asset.category} •{" "}
                          <strong>{t("unitPrice")}:</strong>{" "}
                          {formatCurrency(Number(asset.value) || 0)}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          <strong>{t("Status")}:</strong>{" "}
                          <Chip
                            label={getStatusText(asset.status)}
                            size="small"
                            color={statusColors[asset.status] || "default"}
                            sx={{ height: 16, fontSize: "0.6rem" }}
                          />
                        </Typography>
                        {asset.brand && (
                          <Typography variant="caption" display="block">
                            <strong>{t("Brand")}:</strong> {asset.brand}
                            {asset.model && ` • ${t("Model")}: ${asset.model}`}
                          </Typography>
                        )}
                        {asset.serialNumber && (
                          <Typography variant="caption" display="block">
                            <strong>{t("Serial")}:</strong> {asset.serialNumber}
                          </Typography>
                        )}
                        {asset.assignedTo && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="primary"
                          >
                            <strong>{t("Assigned to")}:</strong>{" "}
                            {asset.assignedTo}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentDetailDialog;
