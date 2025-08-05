import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Create as CreateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useUserLogs } from "@/hooks/useUserLogs";
import { useUserManagement } from "@/hooks/useUserManagement";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { User } from "@/types/user.types";
import type { UserLog as UserLogType } from "@/types/userLogs.types";

const UserLog: React.FC = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const { users } = useUserManagement();

  const {
    logs,
    total,
    page,
    pageSize,
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
    formatAction,
    formatTimestamp,
  } = useUserLogs({ page: 1, limit: 10 });

  const handlePageChange = (_: unknown, newPage: number) => {
    updateFilters({ page: newPage + 1 });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFilters({
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const handleUserFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFilters({
      userId: event.target.value ? parseInt(event.target.value, 10) : undefined,
      page: 1,
    });
  };

  const handleActionFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    updateFilters({
      action: event.target.value as string,
      page: 1,
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    updateFilters({
      startDate: date ? date.toISOString() : undefined,
      page: 1,
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    updateFilters({
      endDate: date ? date.toISOString() : undefined,
      page: 1,
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LoginIcon color="primary" />;
      case "logout":
        return <LogoutIcon color="secondary" />;
      case "create":
        return <CreateIcon color="success" />;
      case "update":
        return <EditIcon color="info" />;
      case "delete":
        return <DeleteIcon color="error" />;
      case "view":
        return <ViewIcon color="action" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            {t("userActivityLogs")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("userActivityLogsDescription")}
          </Typography>
        </Box>
        <Box>
          <Tooltip title={t("refresh")}>
            <IconButton
              onClick={() => refetch()}
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("filters")}>
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="user-filter-label">{t("user")}</InputLabel>
                <Select
                  labelId="user-filter-label"
                  value={filters.userId || ""}
                  onChange={handleUserFilterChange as any}
                  label={t("user")}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {users?.map((user: User) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="action-filter-label">{t("action")}</InputLabel>
                <Select
                  labelId="action-filter-label"
                  value={filters.action || ""}
                  onChange={handleActionFilterChange as any}
                  label={t("action")}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  <MenuItem value="login">{t("logActionLogin")}</MenuItem>
                  <MenuItem value="logout">{t("logActionLogout")}</MenuItem>
                  <MenuItem value="create">{t("logActionCreate")}</MenuItem>
                  <MenuItem value="update">{t("logActionUpdate")}</MenuItem>
                  <MenuItem value="delete">{t("logActionDelete")}</MenuItem>
                  <MenuItem value="view">{t("logActionView")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("startDate")}
                  value={filters.startDate ? new Date(filters.startDate) : null}
                  onChange={handleStartDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("endDate")}
                  value={filters.endDate ? new Date(filters.endDate) : null}
                  onChange={handleEndDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      )}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("errorLoadingLogs")}
        </Alert>
      ) : null}

      {/* Users Logs Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>{t("timestamp")}</TableCell>
                <TableCell>{t("user")}</TableCell>
                <TableCell>{t("action")}</TableCell>
                <TableCell>{t("details")}</TableCell>
                <TableCell>{t("role")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">{t("noLogsFound")}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: UserLogType) => {
                  const user = users?.find((u: User) => u.id === log.userId);
                  const role = user?.role || "";
                  return (
                    <TableRow key={log.id} hover>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {getActionIcon(log.action)}
                          <span>{formatAction(log.action)}</span>
                        </Stack>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>
                        {role === "admin"
                          ? "Admin"
                          : role === "manager"
                          ? "Manager"
                          : role === "staff"
                          ? "Staff"
                          : role === "supervisor"
                          ? "Supervisor"
                          : ""}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {logs.length > 0 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={2}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {logs.length} of {total} results
            </Typography>
            <TablePagination
              component="div"
              count={total}
              page={page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              sx={{
                "& .MuiTablePagination-toolbar": {
                  pl: 0,
                },
                "& .MuiTablePagination-spacer": {
                  display: "none",
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};
export default UserLog;
