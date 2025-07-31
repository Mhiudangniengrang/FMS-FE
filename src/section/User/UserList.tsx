import React, { useState, useMemo, useEffect } from "react";
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
  Pagination,
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useUserManagement } from "@/hooks/useUserManagement";
import type { User } from "@/types/user.types";
import { useTranslation } from "react-i18next";

const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const { users, isLoading, deleteUserMutation } = useUserManagement();

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
    setSearchTerm("");
  };

  // Filter only regular users
  const regularUsers =
    users?.filter((user: User) => user.role === "user") || [];

  // Cải thiện chức năng tìm kiếm với useMemo và xử lý null/undefined
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(regularUsers) || regularUsers.length === 0) {
      return [];
    }

    if (!searchTerm.trim()) {
      return regularUsers;
    }

    const query = searchTerm.toLowerCase().trim();
    return regularUsers.filter((user: User) => {
      const name = user.name ? user.name.toLowerCase() : "";
      const email = user.email ? user.email.toLowerCase() : "";
      const phone = user.phone ? user.phone : "";

      return (
        name.includes(query) || email.includes(query) || phone.includes(query)
      );
    });
  }, [regularUsers, searchTerm]);

  // Phân trang trên UI với useMemo
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * limit, page * limit);
  }, [filteredUsers, page, limit]);

  // Reset page khi thay đổi tìm kiếm
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t("userAccounts")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("userDecription")}
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {regularUsers.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("totalUsers")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {regularUsers.filter(
                      (u: User) =>
                        u.createdAt &&
                        new Date(u.createdAt) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("newUsers")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {filteredUsers.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("searchResults")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t("searchUsers")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
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
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Users Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">{t("no")}</TableCell>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("email")}</TableCell>
                <TableCell>{t("phone")}</TableCell>
                <TableCell>{t("joinDate")}</TableCell>
                <TableCell width="10%" align="center">
                  {t("actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user: User, index: number) => (
                <TableRow key={user.id} hover>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{getInitials(user.name)}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{user.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa người dùng">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(user.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box textAlign="center">
                      <PersonIcon
                        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        {searchTerm ? "No users found" : "No users yet"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm
                          ? "Try searching with different keywords"
                          : "User list will appear here"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
            count={Math.ceil((filteredUsers.length || 0) / limit)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

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

export default UserList;
