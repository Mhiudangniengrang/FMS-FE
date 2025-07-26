import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

interface RegisterStyles {
  formContainer: SxProps<Theme>;
  inputField: SxProps<Theme>;
  inputFieldWithError: (hasError: boolean) => SxProps<Theme>;
  inputAdornment: SxProps<Theme>;
  iconColor: (hasError: boolean) => SxProps<Theme>;
  iconButton: SxProps<Theme>;
  registerButton: SxProps<Theme>;
  loginContainer: SxProps<Theme>;
  loginText: SxProps<Theme>;
  loginLink: React.CSSProperties;
  snackbar: SxProps<Theme>;
  checkbox: SxProps<Theme>;
  agreementText: SxProps<Theme>;
  agreementLink: React.CSSProperties;
  agreementError: SxProps<Theme>;
}

export const registerStyles: RegisterStyles = {
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    maxHeight: "100%",
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

  inputFieldWithError: (hasError: boolean): SxProps<Theme> => ({
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

  iconColor: (hasError: boolean): SxProps<Theme> => ({
    color: hasError ? "#d32f2f" : "rgba(0, 0, 0, 0.6)",
  }),

  iconButton: {
    color: "rgba(0, 0, 0, 0.6)",
  },

  registerButton: {
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
    "&:disabled": {
      bgcolor: "rgba(0, 0, 0, 0.12)",
      color: "rgba(0, 0, 0, 0.26)",
    },
  },

  loginContainer: {
    textAlign: "center",
    mt: 2,
  },

  loginText: {
    fontSize: "0.875rem",
    color: "rgba(0, 0, 0, 0.6)",
  },

  loginLink: {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: 500,
  },

  snackbar: {
    width: "100%",
    borderRadius: 2,
  },

  checkbox: {
    color: "#1976d2",
    "&.Mui-checked": {
      color: "#1976d2",
    },
    p: 0,
    mr: 1,
  },

  agreementText: {
    fontSize: "0.875rem",
    color: "rgba(0, 0, 0, 0.6)",
    lineHeight: "1.4",
  },

  agreementLink: {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: 500,
  },

  agreementError: {
    color: "#d32f2f",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 3,
  },
};
