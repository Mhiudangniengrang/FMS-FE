import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginStyles } from "@/styles/login.styles";
import type { LoginFormData } from "@/types";
import { emailValidation, passwordValidation } from "@/utils";
import { useLogin } from "@/hooks/useAuth";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={loginStyles.formContainer}
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
              <InputAdornment position="start" sx={loginStyles.inputAdornment}>
                <EmailOutlined sx={loginStyles.iconColor(!!errors.email)} />
              </InputAdornment>
            ),
          },
        }}
        sx={loginStyles.inputField}
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
              <InputAdornment position="start" sx={loginStyles.inputAdornment}>
                <LockOutlined sx={loginStyles.iconColor(!!errors.password)} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                  sx={loginStyles.iconButton}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={loginStyles.inputField}
      />

      <Box sx={loginStyles.rememberForgotContainer}>
        <FormControlLabel
          control={
            <Checkbox
              {...register("remember")}
              size="small"
              sx={loginStyles.checkbox}
            />
          }
          label={
            <Typography variant="body2" sx={loginStyles.rememberText}>
              Remember me
            </Typography>
          }
        />
        <Link to="#" style={loginStyles.forgotPasswordLink}>
          Forgot password
        </Link>
      </Box>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loginMutation.isPending}
        sx={loginStyles.loginButton}
      >
        {loginMutation.isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Login"
        )}
      </Button>
      <Box sx={loginStyles.registerContainer}>
        <Typography variant="body2" sx={loginStyles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={loginStyles.registerLink}>
            Register here
          </Link>
        </Typography>

        {/* <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Test accounts:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@example.com / 123456
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User: user@example.com / 123456
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Login;
