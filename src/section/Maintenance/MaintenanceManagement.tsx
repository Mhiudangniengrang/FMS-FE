import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useMaintenanceRequests, useTechnicians, useUpdateMaintenanceRequest } from "../../hooks/useMaintenance";
import type { MaintenanceRequest, UpdateMaintenanceRequest } from "../../types";

const MaintenanceManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<number>(0);

  const filters = {
    ...(filterStatus && { status: filterStatus }),
    ...(filterPriority && { priority: filterPriority }),
  };

  const { data: maintenanceRequests, isLoading, refetch } = useMaintenanceRequests(filters);
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

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleAssignTechnician = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setSelectedTechnician(request.assignedTo || 0);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedRequest || !selectedTechnician) return;

    const updateData: UpdateMaintenanceRequest = {
      id: selectedRequest.id,
      assignedTo: selectedTechnician,
      status: selectedRequest.status === "pending" ? "approved" as const : selectedRequest.status,
    };

    try {
      await updateMaintenance.mutateAsync(updateData);
      setAssignDialogOpen(false);
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterPriority("");
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

          {/* Filters */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <FilterIcon />
                <Typography variant="h6">Bộ lọc</Typography>
              </Box>
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
                <Button variant="outlined" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              </Stack>
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

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết yêu cầu bảo trì</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tài sản</Typography>
                  <Typography variant="body1">{selectedRequest.assetName} ({selectedRequest.assetCode})</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Người yêu cầu</Typography>
                  <Typography variant="body1">{selectedRequest.requestedByName}</Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">Tiêu đề</Typography>
                <Typography variant="body1">{selectedRequest.title}</Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">Mô tả</Typography>
                <Typography variant="body1">{selectedRequest.description}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Mức độ ưu tiên</Typography>
                  <Chip
                    label={priorityLabels[selectedRequest.priority]}
                    sx={{
                      bgcolor: priorityColors[selectedRequest.priority],
                      color: "white",
                    }}
                  />
                </Box>
                <Box>
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
              
              {selectedRequest.notes && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Ghi chú</Typography>
                  <Typography variant="body1">{selectedRequest.notes}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Phân công kỹ thuật viên</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            {selectedRequest && (
              <Stack spacing={2}>
                <Typography variant="body2">
                  <strong>Yêu cầu:</strong> {selectedRequest.title}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Chọn kỹ thuật viên</InputLabel>
                  <Select
                    value={selectedTechnician}
                    label="Chọn kỹ thuật viên"
                    onChange={(e) => setSelectedTechnician(Number(e.target.value))}
                  >
                    <MenuItem value={0}>Chưa phân công</MenuItem>
                    {technicians?.map((tech) => (
                      <MenuItem key={tech.id} value={tech.id}>
                        {tech.name} ({tech.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleAssignSubmit}
            variant="contained"
            disabled={updateMaintenance.isPending}
          >
            {updateMaintenance.isPending ? "Đang cập nhật..." : "Phân công"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceManagement; 