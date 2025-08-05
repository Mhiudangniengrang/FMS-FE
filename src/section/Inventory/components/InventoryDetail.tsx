import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,

} from "@mui/material";
import {
  Close as CloseIcon,

} from "@mui/icons-material";
import {

  statusColors,
  conditionColors,
} from "../../Asset/utils/constants";

interface InventoryDetailProps {
  open: boolean;
  onClose: () => void;
  asset: any;
  onEdit?: (asset: any) => void;
  onDelete?: (asset: any) => void;
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({
  open,
  onClose,
  asset,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!asset) return null;

  // Format date based on current locale
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    return new Date(dateString).toLocaleDateString(locale);
  };

  // Format currency based on current locale
  const formatCurrency = (value: number): string => {
    if (!value && value !== 0) return "-";
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    const currency = i18n.language === "vi" ? "VND" : "USD";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Header with Avatar and Title */}
          <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "grey.300",
                color: "text.primary",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {asset.name?.charAt(0) || "M"}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {asset.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asset.assetCode || asset.code}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{ color: "text.secondary" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Basic Information Section */}
          <Box mb={3}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              {t("basicInformation")}
            </Typography>

            <Grid container spacing={3}>
              {/* Left Column - Basic Info */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("category")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.category || t("inventory.defaultCategory")}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("brand")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.brand || "Canon"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("model")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.model || "LBP2900"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("serialNumber")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.serialNumber || "CNL290822001"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Right Column - Status & Location */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("status._label")}
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                      mt={0.5}
                    >
                      <Chip
                        label={t(`status.${asset?.status}`)}
                        size="small"
                        color={statusColors[asset?.status] || "default"}
                        sx={{ width: "fit-content", fontSize: "0.75rem" }}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("condition._label")}
                    </Typography>
                    <Chip
                      label={t(`condition.${asset?.condition}`)}
                      size="small"
                      color={conditionColors[asset?.condition] || "default"}
                      sx={{ mt: 0.5, fontSize: "0.75rem" }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("department")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.department || t("inventory.defaultLocation")}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("Assigned to")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.assignedTo || t("notAssigned")}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Financial Information Section */}
          <Box mb={3}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              {t("financialInformation")}
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 4 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t("value")}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {formatCurrency(asset.value || 3500000)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }} >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t("purchaseDate")}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(asset.purchaseDate) || "20/8/2022"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t("warrantyDate")}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(asset.warrantyDate) || "20/8/2024"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Additional Information */}
          <Box mb={3}>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                {t("description")}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {asset.description || t("inventory.defaultDescription")}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                {t("notes")}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {asset.notes || t("inventory.defaultNotes")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            minWidth: 80,
          }}
        >
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDetail;
