import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Pagination,
  CircularProgress,
  Container,
  Drawer,
  Stack,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useMyMaintenanceRequests } from "../../hooks/useMaintenance";
import type { MaintenanceRequest } from "../../types";
import DraftEditForm from "./DraftEditForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MyMaintenanceHistory: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const itemsPerPage = 10;

  const { data: allMyRequests, isLoading: requestsLoading } = useMyMaintenanceRequests();
  
  // Filter requests vs drafts from the same data source
  const myRequests = allMyRequests?.filter(request => request.status !== "draft" && !request.isDraft) || [];
  const myDrafts = allMyRequests?.filter(request => request.status === "draft" || request.isDraft) || [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reset page to 1 when switching tabs
    setPage(1);
    setDraftPage(1);
  };

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setViewDrawerOpen(true);
  };

  const handleEditDraft = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setEditDrawerOpen(true);
  };

  const handleCloseViewDrawer = () => {
    setViewDrawerOpen(false);
    setSelectedRequest(null);
  };

  const handleCloseEditDrawer = () => {
    setEditDrawerOpen(false);
    setSelectedRequest(null);
  };

  const handleEditSuccess = () => {
    setEditDrawerOpen(false);
    setSelectedRequest(null);
    // Refresh data to update the lists
    // The hook will automatically refetch and the draft will be removed/moved to submitted
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "warning";
      case "approved": return "info";
      case "in_progress": return "primary";
      case "completed": return "success";
      case "cancelled": return "error";
      case "draft": return "default";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Chờ duyệt";
      case "approved": return "Đã duyệt";
      case "in_progress": return "Đang xử lý";
      case "completed": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      case "draft": return "Bản nháp";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "#4caf50";
      case "medium": return "#ff9800";
      case "high": return "#f44336";
      case "urgent": return "#9c27b0";
      default: return "#757575";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low": return "Thấp";
      case "medium": return "Trung bình";
      case "high": return "Cao";
      case "urgent": return "Khẩn cấp";
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Pagination for requests
  const paginatedRequests = myRequests?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ) || [];

  // Pagination for drafts
  const paginatedDrafts = myDrafts?.slice(
    (draftPage - 1) * itemsPerPage,
    draftPage * itemsPerPage
  ) || [];

  const RequestsTable = ({ 
    requests, 
    loading, 
    isDraftTable = false 
  }: { 
    requests: MaintenanceRequest[], 
    loading: boolean,
    isDraftTable?: boolean 
  }) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (!requests || requests.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            Không có yêu cầu nào
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Tài sản</TableCell>
              <TableCell>Mức độ ưu tiên</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Typography variant="subtitle2">{request.title}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {request.assetName} ({request.assetCode})
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: getPriorityColor(request.priority),
                      }}
                    />
                    {getPriorityLabel(request.priority)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(request.status)}
                    color={getStatusColor(request.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(request.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(request)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {isDraftTable && (
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={() => handleEditDraft(request)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Card elevation={0}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon color="primary" />
              Lịch Sử Yêu Cầu Bảo Trì
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem lại các yêu cầu bảo trì đã gửi và bản nháp
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Yêu cầu đã gửi (${myRequests?.length || 0})`} />
              <Tab label={`Bản nháp (${myDrafts?.length || 0})`} />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <RequestsTable requests={paginatedRequests} loading={requestsLoading} />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil((myRequests.length || 0) / itemsPerPage) || 1}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <RequestsTable requests={paginatedDrafts} loading={requestsLoading} isDraftTable={true} />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil((myDrafts.length || 0) / itemsPerPage) || 1}
                page={draftPage}
                onChange={(_, newPage) => setDraftPage(newPage)}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      {/* View Detail Drawer */}
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
              <Typography variant="h6" gutterBottom>
                {selectedRequest.title}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tài sản:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest.assetName} ({selectedRequest.assetCode})
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mô tả:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest.description}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mức độ ưu tiên:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: getPriorityColor(selectedRequest.priority),
                      }}
                    />
                    {getPriorityLabel(selectedRequest.priority)}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedRequest.status)}
                    color={getStatusColor(selectedRequest.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                    size="small"
                  />
                </Box>
              </Box>

              {selectedRequest.expectedCompletionTime && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Thời gian mong muốn hoàn thành:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedRequest.expectedCompletionTime)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày tạo:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedRequest.createdAt)}
                </Typography>
              </Box>

              {selectedRequest.assignedToName && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Kỹ thuật viên được phân công:
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.assignedToName}
                  </Typography>
                </Box>
              )}

              {selectedRequest.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú:
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.notes}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Drawer>

      {/* Edit Draft Drawer */}
      <Drawer
        anchor="right"
        open={editDrawerOpen}
        onClose={handleCloseEditDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 600 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Chỉnh sửa bản nháp</Typography>
            <IconButton onClick={handleCloseEditDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {selectedRequest && (
            <DraftEditForm
              draft={selectedRequest}
              onSubmitSuccess={handleEditSuccess}
              onCancel={handleCloseEditDrawer}
            />
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default MyMaintenanceHistory;