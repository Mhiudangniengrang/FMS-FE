import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import {
  useStatusTranslation,
  useConditionTranslation,
  statusColors,
  conditionColors,
} from "../../Asset/utils/constants";

interface InventoryTableProps {
  inventoryData: any[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  formatCurrency: (value: number) => string;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: "name" | "quantity" | "value" | "status";
  sortOrder: "asc" | "desc";
  onSortChange: (
    field: "name" | "quantity" | "value" | "status",
    order: "asc" | "desc"
  ) => void;
  onView?: (asset: any) => void;
  onEdit?: (asset: any) => void;
  onDelete?: (asset: any) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventoryData,
  totalCount,
  page,
  rowsPerPage,
  formatCurrency,
  onPageChange,
  onRowsPerPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  onView,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { getStatusText } = useStatusTranslation();
  const { getConditionText } = useConditionTranslation();

  const handleSort = (field: typeof sortBy) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    onSortChange(field, isAsc ? "desc" : "asc");
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                {t("assetCode")}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                >
                  {t("assetDetails")}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("Category")}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortOrder : "asc"}
                  onClick={() => handleSort("status")}
                >
                  {t("Status")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("conditions")}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {t("department")}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={sortBy === "quantity"}
                  direction={sortBy === "quantity" ? sortOrder : "asc"}
                  onClick={() => handleSort("quantity")}
                >
                  {t("quantity")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={sortBy === "value"}
                  direction={sortBy === "value" ? sortOrder : "asc"}
                  onClick={() => handleSort("value")}
                >
                  {t("value")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((asset) => (
              <TableRow key={asset.id} hover>
                {/* Asset Code */}
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {asset.assetCode || asset.code}
                  </Typography>
                </TableCell>

                {/* Asset Details */}
                <TableCell>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {asset.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {asset.brand} {asset.model}
                    </Typography>
                    {asset.serialNumber && (
                      <>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          SN: {asset.serialNumber}
                        </Typography>
                      </>
                    )}
                  </Box>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Chip
                    label={asset.category}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Chip
                    label={getStatusText(asset.status)}
                    size="small"
                    color={statusColors[asset.status] || "default"}
                  />
                </TableCell>

                {/* Condition */}
                <TableCell align="center">
                  <Chip
                    label={getConditionText(asset.condition)}
                    variant="outlined"
                    size="small"
                    color={conditionColors[asset.condition] || "default"}
                  />
                </TableCell>

                {/* Location */}
                <TableCell>
                  <Typography variant="body2">{asset.department}</Typography>
                  {asset.assignedTo && (
                    <Typography variant="caption" color="text.secondary">
                      {t("Assigned to")}: {asset.assignedTo}
                    </Typography>
                  )}
                </TableCell>

                {/* Quantity */}
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="medium">
                    {asset.quantity || 1}
                  </Typography>
                </TableCell>

                {/* Value */}
                <TableCell align="right">
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="success.main"
                    >
                      {formatCurrency(asset.value || 0)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("Total")}:{" "}
                      {formatCurrency(
                        (asset.value || 0) * (asset.quantity || 1)
                      )}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {onView && (
                      <IconButton size="small" onClick={() => onView(asset)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(asset)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {/* Empty State */}
            {inventoryData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    {t("No assets found")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={t("rowsPerPage")}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${t("of")} ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Paper>
  );
};

export default InventoryTable;
