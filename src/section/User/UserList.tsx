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
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useUserManagement } from "../../hooks/useUserManagement";
import type { User } from "../../types/user.types";

const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const { users, isLoading, deleteUserMutation } = useUserManagement();

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Filter only regular users
  const regularUsers = users?.filter((user: User) => user.role === "user") || [];

  const filteredUsers = regularUsers.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  // Phân trang trên UI
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  const getInitials = (name: string) => {
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
          User List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View information of all users in the system
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
                    Total Users
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
                        new Date(u.createdAt) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New Users (30 days)
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
                    Search Results
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
          placeholder="Search by name, email or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
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
                <TableCell width="5%">No.</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell width="10%" align="center">
                  Actions
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
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa người dùng">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
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

      <Box display="flex" justifyContent="center" alignItems="center" py={2}>
        <Pagination
          count={Math.ceil((filteredUsers.length || 0) / limit)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default UserList;
