import React, { useState, useMemo, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Drawer,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useUserManagement } from "@/hooks/useUserManagement";
import type { CreateUserForm, User } from "@/types/user.types";
import { useTranslation } from "react-i18next";

const Internal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  // total sẽ lấy từ hook, không cần state riêng
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const { t } = useTranslation();

  const {
    users,
    isLoading,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } = useUserManagement();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "staff",
    },
  });

  // Filter only internal users (supervisor, manager, staff)
  const internalUsers =
    users?.filter(
      (u: User) =>
        u.role === "manager" || u.role === "supervisor" || u.role === "staff"
    ) || [];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    // Đảm bảo internalUsers là một mảng
    if (!Array.isArray(internalUsers) || internalUsers.length === 0) {
      return [];
    }

    let result = [...internalUsers];

    // Apply role filter
    if (filterRole !== "all") {
      result = result.filter((user: User) => user.role === filterRole);
    }

    // Apply search query
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
      result = result.filter((user: User) => {
        // Kiểm tra null/undefined trước khi gọi toLowerCase()
        const name = user.name ? user.name.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const phone = user.phone ? user.phone.toLowerCase() : "";

        return (
          name.includes(query) || email.includes(query) || phone.includes(query)
        );
      });
    }

    return result;
  }, [internalUsers, searchQuery, filterRole]);

  // Tính toán phân trang nội bộ với dữ liệu đã được lọc
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * limit, page * limit);
  }, [filteredUsers, page, limit]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterRole]);

  const handleClose = () => {
    setOpen(false);
    // Không reset editingUser và formMode khi đóng form
  };

  const handleEdit = (user: User) => {
    // Kiểm tra xem role của user có hợp lệ để edit không
    if (
      user.role !== "manager" &&
      user.role !== "supervisor" &&
      user.role !== "staff"
    ) {
      alert("Cannot edit this user type");
      return;
    }

    setEditingUser(user);
    setFormMode("edit");
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "", // Don't populate password for security
      role: user.role as "supervisor" | "manager" | "staff",
    });
    setOpen(true);
  };

  // Add new function to handle opening the create user form
  const handleOpenCreateForm = () => {
    setEditingUser(null);
    setFormMode("create");
    reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "staff",
    });
    setOpen(true);
  };

  const onSubmit = (data: CreateUserForm) => {
    // Role đã được giới hạn trong form nên không cần kiểm tra nữa
    if (editingUser) {
      // Update user - Cập nhật theo API mới
      updateUserMutation.mutate({
        id: editingUser.id,
        ...data,
        ...(data.password ? { password: data.password } : {}), // Only update password if provided
      });
    } else {
      // Create new user
      createUserMutation.mutate(data);
    }
    handleClose();
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete !== null) {
      deleteUserMutation.mutate(userToDelete);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Create/Edit User Dialog replaced with Drawer
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
            {t("internalAccount")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("internalAccountDescription")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenCreateForm()}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          {t("createNewAccount")}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <PersonAddIcon
              sx={{ fontSize: 40, color: "success.main", mb: 1 }}
            />
            <Typography variant="h4" color="success.main">
              {internalUsers?.filter((u: User) => u.role === "manager")
                .length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("managers")}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <PersonAddIcon sx={{ fontSize: 40, color: "error.main", mb: 1 }} />
            <Typography variant="h4" color="error.main">
              {internalUsers?.filter((u: User) => u.role === "supervisor")
                .length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("supervisors")}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <PersonAddIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
            <Typography variant="h4" color="info.main">
              {internalUsers?.filter((u: User) => u.role === "staff").length ||
                0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("staffs")}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <PersonAddIcon
              sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
            />
            <Typography variant="h4" color="warning.main">
              {internalUsers?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("totalInternalAccounts")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder={t("searchUsers")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton
                    edge="end"
                    onClick={handleClearSearch}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
          }}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <InputLabel id="role-filter-label">Filter by Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            label={t("filterByRole")}
            startAdornment={
              <InputAdornment position="start">
                <FilterIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">{t("allRoles")}</MenuItem>
            <MenuItem value="manager">{t("managers")}</MenuItem>
            <MenuItem value="supervisor">{t("supervisors")}</MenuItem>
            <MenuItem value="staff">{t("staffs")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Users Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t("no")}</TableCell>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("email")}</TableCell>
                <TableCell>{t("phone")}</TableCell>
                <TableCell>{t("role")}</TableCell>
                <TableCell align="center">{t("actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user: User, idx: number) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.role === "supervisor"
                            ? t("supervisors")
                            : user.role === "manager"
                            ? t("managers")
                            : t("staffs")
                        }
                        color={
                          user.role === "supervisor"
                            ? "primary"
                            : user.role === "manager"
                            ? "success"
                            : "info"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(user)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(user.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" py={3}>
                      {searchQuery || filterRole !== "all"
                        ? t("noResultsFound")
                        : t("noUsersAvailable")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={2}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {paginatedUsers.length} of {filteredUsers.length} results
            </Typography>
            <Pagination
              count={Math.ceil(filteredUsers.length / limit) || 1}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Create/Edit User Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "450px" },
            padding: 3,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6">
              {formMode === "edit" ? t("editUser") : t("createNewAccount")}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {(createUserMutation.error || updateUserMutation.error) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(createUserMutation.error as any)?.response?.data?.message ||
                  (updateUserMutation.error as any)?.response?.data?.message ||
                  "An error occurred"}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: t("nameIsRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("name")}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("emailIsRequired"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("email")}
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: t("phoneIsRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("phone")}
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              {/* Only show password field when creating a new user */}
              {formMode === "create" ? (
                <Grid size={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: t("passwordIsRequired") }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("password")}
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                </Grid>
              ) : // <Grid size={12}>
              //   <Controller
              //     name="password"
              //     control={control}
              //     rules={{ required: false }}
              //     render={({ field }) => (
              //       <TextField
              //         {...field}
              //         label="Password (leave blank to keep current)"
              //         type="password"
              //         fullWidth
              //         error={!!errors.password}
              //         helperText={errors.password?.message}
              //         sx={{ mb: 2 }}
              //       />
              //     )}
              //   />
              // </Grid>
              null}

              <Grid size={12}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>{t("role")}</InputLabel>
                      <Select {...field} label={t("role")}>
                        <MenuItem value="staff">{t("staffs")}</MenuItem>
                        <MenuItem value="manager">{t("managers")}</MenuItem>
                        <MenuItem value="supervisor">
                          {t("supervisors")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button onClick={handleClose} variant="outlined">
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
              >
                {createUserMutation.isPending ||
                updateUserMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : formMode === "edit" ? (
                  t("update")
                ) : (
                  t("createAccount")
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>{t("confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>{t("deleteDescription")}</Typography>
          <Typography variant="caption" color="error">
            {t("deleteDescription")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>{t("cancel")}</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              t("delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Internal;
