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
} from "@mui/icons-material";
import { useMaintenanceRequests, useTechnicians, useUpdateMaintenanceRequest } from "../../hooks/useMaintenance";
import type { MaintenanceRequest, UpdateMaintenanceRequest } from "../../types";

const MaintenanceManagement: React.FC = () => {
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
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<number>(0);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editedStatus, setEditedStatus] = useState<string>("");

  // Get all maintenance requests without any backend filtering
  const { data: allMaintenanceRequests, isLoading, refetch } = useMaintenanceRequests();
  
  // Apply all filters on frontend for better control
  const maintenanceRequests = useMemo(() => {
    if (!allMaintenanceRequests) return [];
    
    return allMaintenanceRequests.filter(request => {
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
  }, [allMaintenanceRequests, appliedFilters]);
  const { data: technicians } = useTechnicians();
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

  // Search and filter handlers
  const handleSearch = () => {
    setAppliedFilters({
      status: filterStatus,
      priority: filterPriority,
      assetName: searchAssetName,
    });
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
  };

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setViewDrawerOpen(true);
  };

  const handleAssignTechnician = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setSelectedTechnician(request.assignedTo || 0);
    setAssignDrawerOpen(true);
  };

  const handleCloseViewDrawer = () => {
    setViewDrawerOpen(false);
    setSelectedRequest(null);
    setIsEditingStatus(false);
    setEditedStatus("");
  };

  const handleCloseAssignDrawer = () => {
    setAssignDrawerOpen(false);
    setSelectedRequest(null);
    setSelectedTechnician(0);
  };

  const handleAssignSubmit = async () => {
    if (!selectedRequest) return;

    // Determine new status based on action
    let newStatus = selectedRequest.status;
    if (selectedTechnician === 0) {
      // Hủy phân công - chuyển về chờ duyệt
      newStatus = "pending";
    } else if (selectedRequest.status === "pending") {
      // Phân công lần đầu - chuyển thành đã duyệt
      newStatus = "approved";
    }

    const updateData: UpdateMaintenanceRequest = {
      id: selectedRequest.id,
      assignedTo: selectedTechnician === 0 ? null : selectedTechnician,
      status: newStatus as "pending" | "approved" | "in_progress" | "completed" | "cancelled",
    };

    try {
      await updateMaintenance.mutateAsync(updateData);
      handleCloseAssignDrawer();
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  const handleStatusEdit = () => {
    if (!selectedRequest) return;
    setEditedStatus(selectedRequest.status);
    setIsEditingStatus(true);
  };

  const handleStatusCancel = () => {
    setIsEditingStatus(false);
    setEditedStatus("");
  };

  const handleStatusSubmit = async () => {
    if (!selectedRequest || !editedStatus || editedStatus === selectedRequest.status) return;

    const updateData: UpdateMaintenanceRequest = {
      id: selectedRequest.id,
      status: editedStatus as "pending" | "approved" | "in_progress" | "completed" | "cancelled",
    };

    try {
      await updateMaintenance.mutateAsync(updateData);
      setIsEditingStatus(false);
      setEditedStatus("");
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  // Determine if status can be edited
  const canEditStatus = (status: string) => {
    // Không thể sửa nếu đã hoàn thành hoặc đã hủy
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
              Quản Lý Yêu Cầu Bảo Trì
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
                      <MenuItem value="pending">Chờ duyệt</MenuItem>
                      <MenuItem value="approved">Đã duyệt</MenuItem>
                      <MenuItem value="in_progress">Đang xử lý</MenuItem>
                      <MenuItem value="completed">Hoàn thành</MenuItem>
                      <MenuItem value="cancelled">Đã hủy</MenuItem>
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
                  <TableCell><strong>Được giao</strong></TableCell>
                  <TableCell><strong>Ngày tạo</strong></TableCell>
                  <TableCell><strong>Thao tác</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceRequests?.map((request) => (
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
                      {request.assignedToName ? (
                        <Typography variant="body2">{request.assignedToName}</Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Chưa phân công
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={() => handleViewDetails(request)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Phân công kỹ thuật viên">
                          <IconButton 
                            size="small" 
                            onClick={() => handleAssignTechnician(request)}
                            disabled={request.status === "completed" || request.status === "cancelled"}
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

          {(!maintenanceRequests || maintenanceRequests.length === 0) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Không có yêu cầu bảo trì nào
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
                      {isEditingStatus ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={editedStatus}
                              onChange={(e) => setEditedStatus(e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="pending">Chờ duyệt</MenuItem>
                              <MenuItem value="approved">Đã duyệt</MenuItem>
                              <MenuItem value="in_progress">Đang xử lý</MenuItem>
                              <MenuItem value="completed">Hoàn thành</MenuItem>
                              <MenuItem value="cancelled">Đã hủy</MenuItem>
                            </Select>
                          </FormControl>
                          <IconButton 
                            size="small" 
                            onClick={handleStatusSubmit}
                            disabled={updateMaintenance.isPending}
                            color="primary"
                          >
                            ✓
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={handleStatusCancel}
                            disabled={updateMaintenance.isPending}
                          >
                            ✕
                          </IconButton>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={statusLabels[selectedRequest.status]}
                            sx={{
                              bgcolor: statusColors[selectedRequest.status],
                              color: "white",
                            }}
                          />
                          {canEditStatus(selectedRequest.status) && (
                            <IconButton 
                              size="small" 
                              onClick={handleStatusEdit}
                              sx={{ ml: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      )}
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

              {/* Assignment Info */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Thông tin phân công
                </Typography>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Kỹ thuật viên được phân công</Typography>
                  <Typography variant="body1">
                    {selectedRequest.assignedToName || "Chưa phân công"}
                  </Typography>
                </Box>
              </Box>

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
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCloseViewDrawer();
                      handleAssignTechnician(selectedRequest);
                    }}
                    disabled={selectedRequest.status === "completed" || selectedRequest.status === "cancelled"}
                    fullWidth
                  >
                    Phân công kỹ thuật viên
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>

      {/* Assign Technician Drawer */}
      <Drawer
        anchor="right"
        open={assignDrawerOpen}
        onClose={handleCloseAssignDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Phân công & Cập nhật trạng thái</Typography>
            <IconButton onClick={handleCloseAssignDrawer}>
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

              {/* Current Assignment & Status */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Phân công hiện tại:
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedRequest.assignedToName || "Chưa phân công"}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Trạng thái hiện tại:
                </Typography>
                <Chip 
                  label={
                    selectedRequest.status === "pending" ? "Chờ duyệt" :
                    selectedRequest.status === "approved" ? "Đã duyệt" :
                    selectedRequest.status === "in_progress" ? "Đang thực hiện" :
                    selectedRequest.status === "completed" ? "Hoàn thành" :
                    selectedRequest.status === "cancelled" ? "Đã hủy" : selectedRequest.status
                  }
                  color={
                    selectedRequest.status === "pending" ? "warning" :
                    selectedRequest.status === "approved" ? "info" :
                    selectedRequest.status === "in_progress" ? "primary" :
                    selectedRequest.status === "completed" ? "success" :
                    selectedRequest.status === "cancelled" ? "error" : "default"
                  }
                  size="small"
                />
              </Box>

              <Divider />

              {/* Technician Selection */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Chọn kỹ thuật viên mới</InputLabel>
                  <Select
                    value={selectedTechnician}
                    label="Chọn kỹ thuật viên mới"
                    onChange={(e) => setSelectedTechnician(Number(e.target.value))}
                  >
                    <MenuItem value={0}>Hủy phân công</MenuItem>
                    {technicians?.map((tech) => (
                      <MenuItem key={tech.id} value={tech.id}>
                        <Box>
                          <Typography variant="body1">{tech.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tech.role}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Status Info */}
              {selectedTechnician === 0 && (
                <Box sx={{ p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.contrastText">
                  Khi hủy phân công, trạng thái sẽ tự động chuyển về "Chờ duyệt"
                  </Typography>
                </Box>
              )}
              {selectedRequest && selectedRequest.status === "pending" && selectedTechnician !== 0 && (
                <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                  <Typography variant="body2" color="info.contrastText">
                  Khi phân công, trạng thái sẽ tự động chuyển thành "Đã duyệt"
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ pt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseAssignDrawer}
                    fullWidth
                    disabled={updateMaintenance.isPending}
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleAssignSubmit}
                    variant="contained"
                    disabled={updateMaintenance.isPending}
                    fullWidth
                  >
                    {updateMaintenance.isPending 
                      ? "Đang cập nhật..." 
                      : selectedTechnician === 0 
                        ? "Hủy phân công" 
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

export default MaintenanceManagement; 