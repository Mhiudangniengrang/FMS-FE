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
import { useTranslation } from "react-i18next";
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { t } = useTranslation();
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
        placeholder={t("email")}
        {...register("email", emailValidation(t))}
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
        placeholder={t("password")}
        {...register("password", passwordValidation(t))}
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
              {t("rememberMe")}
            </Typography>
          }
        />
        <Link to="#" style={loginStyles.forgotPasswordLink}>
          {t("forgotPassword")}
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
          t("login")
        )}
      </Button>
    </Box>
  );
};

export default Login;
