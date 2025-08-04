import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import type { CreateUserForm, User } from "@/types/user.types";
import { useTranslation } from "react-i18next";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserForm) => void;
  formMode: "create" | "edit";
  editingUser: User | null;
  isSubmitting: boolean;
  error: any;
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  formMode,
  editingUser,
  isSubmitting,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

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

  // Reset form values when editingUser or formMode changes
  useEffect(() => {
    if (formMode === "edit" && editingUser) {
      reset({
        name: editingUser.name || "",
        email: editingUser.email || "",
        phone: editingUser.phone || "",
        password: "",
        role:
          (editingUser.role as "supervisor" | "manager" | "staff") || "staff",
      });
    } else if (formMode === "create") {
      reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "staff",
      });
    }
  }, [editingUser, formMode, reset]);

  const submitHandler = (data: CreateUserForm) => {
    onSubmit(data);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
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
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(submitHandler)}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.response?.data?.message || "An error occurred"}
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
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword
                                  ? t("hidePassword")
                                  : t("showPassword")
                              }
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            ) : (
              <Grid size={12}>
                <TextField
                  label={t("password")}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={editingUser?.password || ""}
                  disabled
                  sx={{ mb: 2 }}
                  helperText={t("passwordNotEditable")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? t("hidePassword") : t("showPassword")
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

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
                      <MenuItem value="supervisor">{t("supervisors")}</MenuItem>
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
            <Button onClick={onClose} variant="outlined">
              {t("cancel")}
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? (
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
  );
};

export default UserForm;
