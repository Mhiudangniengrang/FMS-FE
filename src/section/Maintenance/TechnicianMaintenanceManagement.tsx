import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
  TextField,
  Drawer,
  Divider,
  TablePagination,
  Alert,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  CheckCircle as CompleteIcon,
  PlayArrow as StartIcon,
} from "@mui/icons-material";
import { useAssignedMaintenanceRequests, useUpdateMaintenanceRequest } from "../../hooks/useMaintenance";
import useMaintenancePagination from "../../hooks/useMaintenancePagination";
import type { MaintenanceRequest, UpdateMaintenanceRequest } from "../../types";

const TechnicianMaintenanceManagement: React.FC = () => {
  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [searchAssetName, setSearchAssetName] = useState<string>("");
  
  // Applied filters (only applied when search button is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    priority: "",
    assetName: "",
  });

  // Drawer states
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [statusUpdateDrawerOpen, setStatusUpdateDrawerOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updateNotes, setUpdateNotes] = useState<string>("");

  // Get assigned maintenance requests
  const { data: allAssignedRequests, isLoading, refetch } = useAssignedMaintenanceRequests();
  
  // Apply all filters on frontend
  const filteredRequests = useMemo(() => {
    if (!allAssignedRequests) return [];
    
    return allAssignedRequests.filter(request => {
      // Filter by status
      if (appliedFilters.status && appliedFilters.status.trim() !== "") {
        if (request.status !== appliedFilters.status) {
          return false;
        }
      }
      
      // Filter by priority
      if (appliedFilters.priority && appliedFilters.priority.trim() !== "") {
        if (request.priority !== appliedFilters.priority) {
          return false;
        }
      }
      
      // Filter by asset name
      if (appliedFilters.assetName && appliedFilters.assetName.trim() !== "") {
        if (!request.assetName.toLowerCase().includes(appliedFilters.assetName.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  }, [allAssignedRequests, appliedFilters]);

  // Use pagination hook
  const {
    page,
    rowsPerPage,
    paginatedRequests,
    paginationConfig,
    handlePageChange,
    handleRowsPerPageChange,
    totalCount,
    resetPagination,
  } = useMaintenancePagination(filteredRequests);

  const updateMaintenance = useUpdateMaintenanceRequest();

  const statusColors: Record<string, string> = {
    pending: "#f57c00",
    approved: "#1976d2",
    in_progress: "#9c27b0",
    completed: "#388e3c",
    cancelled: "#d32f2f",
  };

  const priorityColors: Record<string, string> = {
    low: "#4caf50",
    medium: "#ff9800",
    high: "#f44336",
    urgent: "#9c27b0",
  };

  const statusLabels: Record<string, string> = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    in_progress: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const priorityLabels: Record<string, string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    urgent: "Khẩn cấp",
  };

  // Available status options for technician
  const getAvailableStatusOptions = (currentStatus: string) => {
    const statusOptions = [
      { value: "approved", label: "Đã duyệt" },
      { value: "in_progress", label: "Đang xử lý" },
      { value: "completed", label: "Hoàn thành" },
    ];

    return statusOptions.filter(option => {
      // Technician can only move forward in workflow
      if (currentStatus === "approved") {
        return ["in_progress", "completed"].includes(option.value);
      }
      if (currentStatus === "in_progress") {
        return ["completed"].includes(option.value);
      }
      if (currentStatus === "completed") {
        return false; // Can't change completed status
      }
      return false;
    });
  };

  // Search and filter handlers
  const handleSearch = () => {
    setAppliedFilters({
      status: filterStatus,
      priority: filterPriority,
      assetName: searchAssetName,
    });
    resetPagination();
  };

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterPriority("");
    setSearchAssetName("");
    setAppliedFilters({
      status: "",
      priority: "",
      assetName: "",
    });
    resetPagination();
  };

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setViewDrawerOpen(true);
  };

  const handleStartMaintenance = (request: MaintenanceRequest) => {
    if (request.status === "approved") {
      updateStatusDirectly(request, "in_progress");
    }
  };

  const handleCompleteMaintenance = (request: MaintenanceRequest) => {
    if (request.status === "in_progress") {
      updateStatusDirectly(request, "completed");
    }
  };

  const handleUpdateStatus = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setUpdateNotes("");
    setStatusUpdateDrawerOpen(true);
  };

  const updateStatusDirectly = async (request: MaintenanceRequest, status: string) => {
    const updateData: UpdateMaintenanceRequest = {
      id: request.id,
      status: status as "pending" | "approved" | "in_progress" | "completed" | "cancelled",
    };

    try {
      await updateMaintenance.mutateAsync(updateData);
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  const handleCloseViewDrawer = () => {
    setViewDrawerOpen(false);
    setSelectedRequest(null);
  };

  const handleCloseStatusUpdateDrawer = () => {
    setStatusUpdateDrawerOpen(false);
    setSelectedRequest(null);
    setNewStatus("");
    setUpdateNotes("");
  };

  const handleStatusSubmit = async () => {
    if (!selectedRequest || !newStatus || newStatus === selectedRequest.status) return;

    const updateData: UpdateMaintenanceRequest = {
      id: selectedRequest.id,
      status: newStatus as "pending" | "approved" | "in_progress" | "completed" | "cancelled",
      notes: updateNotes.trim() || undefined,
    };

    try {
      await updateMaintenance.mutateAsync(updateData);
      handleCloseStatusUpdateDrawer();
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  const canUpdateStatus = (status: string) => {
    return status !== "completed" && status !== "cancelled";
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" component="h1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AssignmentIcon color="primary" />
              Các Yêu Cầu Bảo Trì Được Giao
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Làm mới
            </Button>
          </Box>

          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 3 }}>
            Đây là danh sách các yêu cầu bảo trì được admin giao cho bạn. Bạn có thể cập nhật trạng thái tiến độ thực hiện.
          </Alert>

          {/* Search and Filters */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <FilterIcon />
                <Typography variant="h6">Tìm kiếm và Bộ lọc</Typography>
              </Box>
              
              <Stack spacing={3}>
                {/* Search by Asset Name */}
                <TextField
                  fullWidth
                  label="Tìm kiếm theo tên tài sản"
                  value={searchAssetName}
                  onChange={(e) => setSearchAssetName(e.target.value)}
                  placeholder="Nhập tên tài sản..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />

                {/* Filters Row */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Trạng thái"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="approved">Đã duyệt</MenuItem>
                      <MenuItem value="in_progress">Đang xử lý</MenuItem>
                      <MenuItem value="completed">Hoàn thành</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Mức độ ưu tiên</InputLabel>
                    <Select
                      value={filterPriority}
                      label="Mức độ ưu tiên"
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="low">Thấp</MenuItem>
                      <MenuItem value="medium">Trung bình</MenuItem>
                      <MenuItem value="high">Cao</MenuItem>
                      <MenuItem value="urgent">Khẩn cấp</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={handleSearch}
                    >
                      Tìm kiếm
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ClearIcon />}
                      onClick={handleClearFilters}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Stack>
                </Stack>
              </Stack>

              {/* Active Filters Display */}
              {(appliedFilters.status || appliedFilters.priority || appliedFilters.assetName) && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Bộ lọc đang áp dụng:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {appliedFilters.status && (
                      <Chip
                        label={`Trạng thái: ${statusLabels[appliedFilters.status]}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {appliedFilters.priority && (
                      <Chip
                        label={`Ưu tiên: ${priorityLabels[appliedFilters.priority]}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {appliedFilters.assetName && (
                      <Chip
                        label={`Tài sản: ${appliedFilters.assetName}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Summary info */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {paginatedRequests?.length || 0} trong tổng số {totalCount} yêu cầu được giao
            </Typography>
            {totalCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                Trang {page + 1} / {Math.ceil(totalCount / rowsPerPage)}
              </Typography>
            )}
          </Box>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Tài sản</strong></TableCell>
                  <TableCell><strong>Tiêu đề</strong></TableCell>
                  <TableCell><strong>Người yêu cầu</strong></TableCell>
                  <TableCell><strong>Ưu tiên</strong></TableCell>
                  <TableCell><strong>Trạng thái</strong></TableCell>
                  <TableCell><strong>Ngày tạo</strong></TableCell>
                  <TableCell><strong>Thao tác</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests?.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{request.assetName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.assetCode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {request.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{request.requestedByName}</TableCell>
                    <TableCell>
                      <Chip
                        label={priorityLabels[request.priority]}
                        size="small"
                        sx={{
                          bgcolor: priorityColors[request.priority],
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[request.status]}
                        size="small"
                        sx={{
                          bgcolor: statusColors[request.status],
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={() => handleViewDetails(request)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {/* Quick action buttons */}
                        {request.status === "approved" && (
                          <Tooltip title="Bắt đầu xử lý">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleStartMaintenance(request)}
                              disabled={updateMaintenance.isPending}
                            >
                              <StartIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {request.status === "in_progress" && (
                          <Tooltip title="Hoàn thành">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleCompleteMaintenance(request)}
                              disabled={updateMaintenance.isPending}
                            >
                              <CompleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {canUpdateStatus(request.status) && (
                          <Tooltip title="Cập nhật trạng thái">
                            <IconButton 
                              size="small" 
                              onClick={() => handleUpdateStatus(request)}
                              disabled={updateMaintenance.isPending}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={paginationConfig.rowsPerPageOptions}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />

          {(!filteredRequests || filteredRequests.length === 0) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Không có yêu cầu bảo trì nào được giao cho bạn
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* View Details Drawer */}
      <Drawer
        anchor="right"
        open={viewDrawerOpen}
        onClose={handleCloseViewDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 500 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Chi tiết yêu cầu bảo trì</Typography>
            <IconButton onClick={handleCloseViewDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedRequest && (
            <Stack spacing={3}>
              {/* Basic Info */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  #{selectedRequest.id} - {selectedRequest.title}
                </Typography>
              </Box>

              <Divider />

              {/* Asset Info */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Thông tin tài sản
                </Typography>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tên tài sản</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedRequest.assetName}</Typography>
                  <Typography variant="body2" color="text.secondary">Mã tài sản</Typography>
                  <Typography variant="body1">{selectedRequest.assetCode}</Typography>
                </Box>
              </Box>

              {/* Request Info */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Thông tin yêu cầu
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Người yêu cầu</Typography>
                    <Typography variant="body1">{selectedRequest.requestedByName}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Mô tả chi tiết</Typography>
                    <Typography variant="body1">{selectedRequest.description}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Mức độ ưu tiên</Typography>
                      <Chip
                        label={priorityLabels[selectedRequest.priority]}
                        sx={{
                          bgcolor: priorityColors[selectedRequest.priority],
                          color: "white",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Trạng thái</Typography>
                      <Chip
                        label={statusLabels[selectedRequest.status]}
                        sx={{
                          bgcolor: statusColors[selectedRequest.status],
                          color: "white",
                        }}
                      />
                    </Box>
                  </Box>

                  {selectedRequest.expectedCompletionTime && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">Thời gian mong muốn hoàn thành</Typography>
                      <Typography variant="body1">
                        {new Date(selectedRequest.expectedCompletionTime).toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Timeline */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Thời gian
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Ngày tạo:</Typography>
                    <Typography variant="body2">
                      {new Date(selectedRequest.createdAt).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Cập nhật lần cuối:</Typography>
                    <Typography variant="body2">
                      {new Date(selectedRequest.updatedAt).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>
                  {selectedRequest.completedAt && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Ngày hoàn thành:</Typography>
                      <Typography variant="body2">
                        {new Date(selectedRequest.completedAt).toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {selectedRequest.notes && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Ghi chú
                  </Typography>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                    <Typography variant="body1">{selectedRequest.notes}</Typography>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ pt: 2 }}>
                <Stack direction="row" spacing={2}>
                  {canUpdateStatus(selectedRequest.status) && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleCloseViewDrawer();
                        handleUpdateStatus(selectedRequest);
                      }}
                      fullWidth
                    >
                      Cập nhật trạng thái
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>

      {/* Status Update Drawer */}
      <Drawer
        anchor="right"
        open={statusUpdateDrawerOpen}
        onClose={handleCloseStatusUpdateDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Cập nhật trạng thái</Typography>
            <IconButton onClick={handleCloseStatusUpdateDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedRequest && (
            <Stack spacing={3}>
              {/* Request Summary */}
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1 }}>
                  #{selectedRequest.id}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedRequest.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedRequest.assetName} ({selectedRequest.assetCode})
                </Typography>
              </Box>

              <Divider />

              {/* Current Status */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Trạng thái hiện tại:
                </Typography>
                <Chip 
                  label={statusLabels[selectedRequest.status]}
                  color={
                    selectedRequest.status === "approved" ? "info" :
                    selectedRequest.status === "in_progress" ? "primary" :
                    selectedRequest.status === "completed" ? "success" : "default"
                  }
                  size="small"
                />
              </Box>

              <Divider />

              {/* New Status Selection */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái mới</InputLabel>
                  <Select
                    value={newStatus}
                    label="Trạng thái mới"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {getAvailableStatusOptions(selectedRequest.status).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Notes */}
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Ghi chú (tùy chọn)"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Thêm ghi chú về tiến độ hoặc kết quả bảo trì..."
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ pt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseStatusUpdateDrawer}
                    fullWidth
                    disabled={updateMaintenance.isPending}
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleStatusSubmit}
                    variant="contained"
                    disabled={updateMaintenance.isPending || !newStatus || newStatus === selectedRequest.status}
                    fullWidth
                  >
                    {updateMaintenance.isPending 
                      ? "Đang cập nhật..." 
                      : "Cập nhật"
                    }
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default TechnicianMaintenanceManagement;
