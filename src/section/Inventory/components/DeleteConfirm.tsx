import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// Types - Sửa lại type cho asset
interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  asset: any | null; // Thay InventoryAsset thành any để tương thích
  isLoading: boolean;
}

const DeleteConfirm: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  asset,
  isLoading,
}) => {
  const { t } = useTranslation(); // Thêm dòng này vào

  if (!asset) return null;

  // Xử lý click confirm - đảm bảo gọi async function đúng cách
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : undefined} // Không cho đóng khi đang loading
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WarningIcon color="error" sx={{ fontSize: 32 }} />
          <Typography variant="h6" color="error">
            {t("Delete Asset")}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t(
            "This action cannot be undone. The asset will be permanently deleted from the system."
          )}
        </Alert>

        <Typography variant="body1" gutterBottom>
          {t("Are you sure you want to delete this asset?")}
        </Typography>

        {/* Asset Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("Asset Details")}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {t("Asset Code")}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {asset.assetCode || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {t("Name")}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {asset.name || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {t("Brand/Model")}:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {asset.brand || "N/A"} {asset.model || ""}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {t("Category")}:
              </Typography>
              <Chip label={asset.category || "N/A"} size="small" />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {t("Value")}:
              </Typography>
              <Typography
                variant="body2"
                fontWeight="medium"
                color="success.main"
              >
                {asset.value
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(asset.value))
                  : "N/A"}
              </Typography>
            </Box>

            {asset.assignedTo && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("Assigned To")}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {asset.assignedTo}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontStyle: "italic" }}
        >
          {t("Please confirm that you want to permanently delete this asset.")}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} disabled={isLoading} variant="outlined">
          {t("Cancel")}
        </Button>
        <Button
          onClick={handleConfirm} // Sử dụng handleConfirm thay vì onConfirm trực tiếp
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
          disabled={isLoading}
        >
          {isLoading ? t("Deleting...") : t("Delete Asset")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirm;
