import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useUserManagement } from "../../hooks/useUserManagement";

interface CreateUserForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "administrator" | "manager" | "employee";
}

const Internal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

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
      role: "employee",
    },
  });

  // Filter only internal users (admin, manager, employee)
  const internalUsers =
    users?.filter((user: any) =>
      ["administrator", "manager", "employee"].includes(user.role)
    ) || [];

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    reset();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "", // Don't populate password for security
      role: user.role,
    });
    setOpen(true);
  };

  const onSubmit = (data: CreateUserForm) => {
    if (editingUser) {
      // Update user
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

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Internal Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create accounts and assign permissions for internal staff
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Create Account
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
              {internalUsers?.filter((u: any) => u.role === "manager").length ||
                0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Managers
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <PersonAddIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
            <Typography variant="h4" color="info.main">
              {internalUsers?.filter((u: any) => u.role === "employee")
                .length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employees
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
              Total Internal
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {internalUsers?.map((user: any, idx: number) => (
                <TableRow key={user.id} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.role === "administrator"
                          ? "Administrator"
                          : user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                      }
                      color={
                        user.role === "administrator"
                          ? "primary"
                          : user.role === "manager"
                          ? "success"
                          : "default"
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
                      onClick={() => handleDelete(user.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? "Edit User" : "Create New Account"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
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
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>

              {!editingUser && (
                <Grid size={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Password is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid size={12}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select {...field} label="Role">
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="administrator">Administrator</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createUserMutation.isPending || updateUserMutation.isPending
              }
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? (
                <CircularProgress size={20} />
              ) : editingUser ? (
                "Update"
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Internal;
