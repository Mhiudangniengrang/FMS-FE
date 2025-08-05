import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type {
  CreateEmployeeData,
  Employee,
  DepartmentStats,
} from "@/types/employeeType";

interface Department {
  id: number;
  name: string;
  description: string;
  employees?: { id: string; name: string }[];
}

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeData) => void;
  formMode: "create" | "edit";
  editingEmployee?: Employee | null;
  departmentStats?: DepartmentStats;
  departments?: Department[];
  isSubmitting: boolean;
  error: any;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  onSubmit,
  formMode,
  editingEmployee,
  departmentStats,
  departments,
  isSubmitting,
  error,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeData>();

  // Generate unique employee ID
  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-1);
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    return `NV${timestamp}${random}`;
  };

  // Reset form when dialog opens/closes or editing employee changes
  useEffect(() => {
    if (open) {
      if (formMode === "edit" && editingEmployee) {
        reset({
          id: editingEmployee.id,
          name: editingEmployee.name,
          position: editingEmployee.position,
          department: editingEmployee.department,
          email: editingEmployee.email,
        });
      } else {
        // Auto-generate ID for create mode
        const newId = generateEmployeeId();
        reset({
          id: newId,
          name: "",
          position: "",
          department: "",
          email: "",
        });
      }
    }
  }, [open, formMode, editingEmployee, reset]);

  const handleFormSubmit = (data: CreateEmployeeData) => {
    // Ensure ID is present for both create and edit
    if (formMode === "create" && !data.id) {
      data.id = generateEmployeeId();
    }
    onSubmit(data);
  };

  const departmentNames = departmentStats
    ? Object.keys(departmentStats)
    : departments?.map((dept) => dept.name) || [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400, md: 500 },
          padding: 0,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">
            {formMode === "edit" ? t("editEmployee") : t("createEmployee")}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ p: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error?.response?.data?.message || t("errorOccurred")}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="id"
                  control={control}
                  rules={{ required: t("employeeIdRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("employeeId")}
                      error={!!errors.id}
                      helperText={errors.id?.message}
                      disabled={true}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  rules={{ required: t("nameRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("name")}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  name="position"
                  control={control}
                  rules={{ required: t("positionRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("position")}
                      error={!!errors.position}
                      helperText={errors.position?.message}
                    />
                  )}
                />

                <Controller
                  name="department"
                  control={control}
                  rules={{ required: t("departmentRequired") }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.department}>
                      <InputLabel>{t("department")}</InputLabel>
                      <Select
                        {...field}
                        label={t("department")}
                        value={field.value || ""}
                      >
                        {departmentNames.map((deptName) => (
                          <MenuItem key={deptName} value={deptName}>
                            {deptName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.department && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5 }}
                        >
                          {errors.department.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: t("emailRequired"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("invalidEmail"),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("email")}
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Form Actions */}
            <Divider />
            <Box
              sx={{
                p: 2,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={onClose} disabled={isSubmitting}>
                {t("cancel")}
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? t("submitting")
                  : formMode === "edit"
                  ? t("update")
                  : t("create")}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Drawer>
  );
};
