import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  EmailOutlined,
  PhoneOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerStyles } from "../../styles/register.styles";
import type { RegisterFormData } from "../../types";
import {
  emailValidation,
  passwordValidation,
  phoneValidation,
  confirmPasswordValidation,
} from "../../utils";
import { useRegister } from "../../hooks/useAuth";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const registerMutation = useRegister();

  // Handle success/error responses
  useEffect(() => {
    if (registerMutation.isSuccess) {
      setSnackbar({
        open: true,
        message: "Registration successful!",
        severity: "success",
      });
    }

    if (registerMutation.isError) {
      setSnackbar({
        open: true,
        message:
          (registerMutation.error as any)?.response?.data?.message ||
          "Registration failed. Please try again.",
        severity: "error",
      });
    }
  }, [
    registerMutation.isSuccess,
    registerMutation.isError,
    registerMutation.error,
  ]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreement: false,
    },
  });

  const watchPassword = watch("password");

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    registerMutation.mutate({
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={registerStyles.formContainer}
    >
      <TextField
        fullWidth
        placeholder="Email"
        {...register("email", emailValidation)}
        error={!!errors.email}
        helperText={errors.email?.message || " "}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={registerStyles.inputAdornment}
              >
                <EmailOutlined sx={registerStyles.iconColor(!!errors.email)} />
              </InputAdornment>
            ),
          },
        }}
        sx={registerStyles.inputField}
      />

      <TextField
        fullWidth
        placeholder="Phone Number"
        {...register("phone", phoneValidation)}
        error={!!errors.phone}
        helperText={errors.phone?.message || " "}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={registerStyles.inputAdornment}
              >
                <PhoneOutlined sx={registerStyles.iconColor(!!errors.phone)} />
              </InputAdornment>
            ),
          },
        }}
        sx={registerStyles.inputField}
      />

      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        {...register("password", passwordValidation)}
        error={!!errors.password}
        helperText={errors.password?.message || " "}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={registerStyles.inputAdornment}
              >
                <LockOutlined
                  sx={registerStyles.iconColor(!!errors.password)}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                  sx={registerStyles.iconButton}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={registerStyles.inputField}
      />

      <TextField
        fullWidth
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password"
        {...register(
          "confirmPassword",
          confirmPasswordValidation(watchPassword)
        )}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message || " "}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={registerStyles.inputAdornment}
              >
                <LockOutlined
                  sx={registerStyles.iconColor(!!errors.confirmPassword)}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                  size="small"
                  sx={registerStyles.iconButton}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={registerStyles.inputField}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={registerMutation.isPending}
        sx={registerStyles.registerButton}
      >
        {registerMutation.isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Register"
        )}
      </Button>

      <Box sx={registerStyles.loginContainer}>
        <Typography variant="body2" sx={registerStyles.loginText}>
          Already have an account?{" "}
          <Link to="/" style={registerStyles.loginLink}>
            Login here
          </Link>
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={registerStyles.snackbar}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
