import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

interface LoginStyles {
  formContainer: SxProps<Theme>;
  inputField: SxProps<Theme>;
  inputFieldWithError: (hasError: boolean) => SxProps<Theme>;
  inputAdornment: SxProps<Theme>;
  iconColor: (hasError: boolean) => SxProps<Theme>;
  iconButton: SxProps<Theme>;
  rememberForgotContainer: SxProps<Theme>;
  checkbox: SxProps<Theme>;
  rememberText: SxProps<Theme>;
  forgotPasswordLink: React.CSSProperties;
  loginButton: SxProps<Theme>;
  registerContainer: SxProps<Theme>;
  registerText: SxProps<Theme>;
  registerLink: React.CSSProperties;
}

export const loginStyles: LoginStyles = {
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      bgcolor: "#fff",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.38)",
      },
    },
    "& .MuiInputBase-input": {
      p: "12px 14px",
      pl: "44px",
    },
    mb: 0.5,
    "& .MuiFormHelperText-root": {
      m: 0,
      minHeight: "20px",
      display: "block",
      fontSize: "0.75rem",
      lineHeight: "20px",
      mt: 0.5,
      mb: 1,
    },
  } as SxProps<Theme>,

  inputFieldWithError: (hasError: boolean) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: hasError ? "#d32f2f" : "rgba(0, 0, 0, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: hasError ? "#d32f2f" : "rgba(0, 0, 0, 0.38)",
      },
    },
  }),

  inputAdornment: {
    position: "absolute",
    ml: 1.5,
  },

  iconColor: (hasError: boolean) => ({
    color: hasError ? "#d32f2f" : "rgba(0, 0, 0, 0.6)",
  }),

  iconButton: {
    color: "rgba(0, 0, 0, 0.6)",
  },

  rememberForgotContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
    mt: 1,
  },

  checkbox: {
    color: "#1976d2",
    "&.Mui-checked": {
      color: "#1976d2",
    },
  },

  rememberText: {
    fontSize: "0.875rem",
    color: "rgba(0, 0, 0, 0.6)",
  },

  forgotPasswordLink: {
    color: "#1976d2",
    textDecoration: "none",
    fontSize: "0.875rem",
  },

  loginButton: {
    py: 1.5,
    textTransform: "none",
    borderRadius: 1,
    fontWeight: 500,
    boxShadow: "none",
    bgcolor: "#1976d2",
    "&:hover": {
      bgcolor: "#1565c0",
      boxShadow: "none",
    },
  },

  registerContainer: {
    textAlign: "center",
    mt: 2,
  },

  registerText: {
    fontSize: "0.875rem",
    color: "rgba(0, 0, 0, 0.6)",
  },

  registerLink: {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: 500,
  },
};
