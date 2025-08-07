import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  TableSortLabel,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  getCategoryIcon,
  statusColors,
  conditionColors,
  formatCurrency,
  getAssetAssignmentStats,
  getAssetStatusByUsage,
} from "../../utils";

import type { AssetTableProps } from "../../types";

const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  data,
  sortBy,
  sortOrder,
  page,
  rowsPerPage,
  totalCount,
  onSort,
  onViewDetail,
  onUpdate,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => {
  if (!data) return null;

  return (
    <Paper sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "assetCode"}
                  direction={sortBy === "assetCode" ? sortOrder : "asc"}
                  onClick={() => onSort("assetCode")}
                >
                  Mã tài sản
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortOrder : "asc"}
                  onClick={() => onSort("name")}
                >
                  Tên tài sản
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              {/* <TableCell>Quantity</TableCell> */}
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset.id}
                hover
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {asset.assetCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={
                        asset.thumbnail || "/placeholder.svg?height=40&width=40"
                      }
                      alt={asset.name}
                      sx={{ width: 48, height: 48, borderRadius: 2 }}
                      variant="rounded"
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asset.brand} {asset.model}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getCategoryIcon(
                      data.categories.find((c) => c.name === asset.category)
                        ?.icon || "computer"
                    )}
                    label={asset.category}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </TableCell>
                {/* <TableCell>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" fontWeight="medium">
                      {asset.quantity || 1}
                    </Typography>
                  </Box>
                </TableCell> */}
                <TableCell>
                  {(() => {
                    const stats = getAssetAssignmentStats(asset);
                    const status = getAssetStatusByUsage(asset);

                    return (
                      <Box sx={{ minWidth: 50 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {stats.activeQuantity}/{stats.totalQuantity}
                          </Typography>
                          {/* <Chip
                            // label={status === "fully_used" ? "Hết" : status === "limited" ? "Gần hết" : "Còn trống"}
                            size="small"
                            color={status === "fully_used" ? "error" : status === "limited" ? "warning" : "success"}
                            sx={{ borderRadius: 1, fontSize: "0.7rem" }}
                          /> */}
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: 4,
                            backgroundColor: "#e0e0e0",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${stats.usagePercentage}%`,
                              height: "100%",
                              backgroundColor:
                                status === "fully_used"
                                  ? "#f44336"
                                  : status === "limited"
                                  ? "#ff9800"
                                  : "#4caf50",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </Box>
                        {stats.returnedQuantity > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            Đã trả: {stats.returnedQuantity}
                          </Typography>
                        )}
                      </Box>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={asset.status}
                    size="small"
                    color={statusColors[asset.status]}
                    sx={{ borderRadius: 2 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={asset.condition}
                    size="small"
                    color={conditionColors[asset.condition]}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </TableCell>
                <TableCell>{asset.department}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="primary"
                  >
                    {formatCurrency(asset.value)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetail(asset)}
                        sx={{ borderRadius: 2 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cập nhật">
                      <IconButton
                        size="small"
                        onClick={() => onUpdate(asset)}
                        sx={{ borderRadius: 2, color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => {
          onRowsPerPageChange(Number.parseInt(e.target.value, 10));
        }}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count}`
        }
      />
    </Paper>
  );
};

export default AssetTable;
