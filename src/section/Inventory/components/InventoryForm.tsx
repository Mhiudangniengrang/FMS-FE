import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Drawer,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import {
  useStatusTranslation,
  useConditionTranslation,
} from "../../Asset/utils/constants";

// Types
interface InventoryFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editingAsset?: any | null;
  isLoading: boolean;
  categories: Array<{ id: number; name: string }>;
  statusOptions: Array<{ value: string; label: string; color: string }>;
  conditionOptions: Array<{ value: string; label: string; color: string }>;
  departments: Array<{ id: number; name: string; description: string }>;
  employees: Array<{
    id: string;
    name: string;
    position: string;
    department: string;
  }>;
}

// Validation schema
const validationSchema = yup.object({
  assetCode: yup.string().required("Asset code is required"),
  name: yup.string().required("Asset name is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Status is required"),
  condition: yup.string().required("Condition is required"),
  department: yup.string().required("Department is required"),
  value: yup
    .number()
    .min(0, "Value must be positive")
    .required("Value is required"),
  quantity: yup
    .number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  purchaseDate: yup.string().required("Purchase date is required"),
  warrantyDate: yup.string(),
  serialNumber: yup.string().required("Serial number is required"),
  brand: yup.string().required("Brand is required"),
  model: yup.string().required("Model is required"),
  supplier: yup.string(),
  description: yup.string(),
  notes: yup.string(),
});

const InventoryForm: React.FC<InventoryFormDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  categories,
  departments,
}) => {
  const { t } = useTranslation();
  const { getStatusText } = useStatusTranslation();
  const { getConditionText } = useConditionTranslation();
  const [tags, setTags] = useState<string[]>([]);
  const [isFormReady, setIsFormReady] = useState(false);
  // Loại bỏ logic edit - chỉ có create mode
  const formTitle = t("addNewAsset");
  const submitButtonText = t("createAsset");
  const loadingText = t("creating...");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      assetCode: "",
      name: "",
      category: "",
      status: "available",
      condition: "new",
      department: "",
      assignedTo: "",
      assigneeId: "",
      value: 0,
      quantity: 1,
      purchaseDate: "",
      warrantyDate: "",
      serialNumber: "",
      brand: "",
      model: "",
      supplier: "",
      description: "",
      notes: "",
    },
  });

  // Filter options based on create/edit mode
  const getFilteredStatusOptions = () => {
    return [{ value: "available", label: getStatusText("available") }];
  };

  const getFilteredConditionOptions = () => {
    return [
      { value: "new", label: getConditionText("new") },
      { value: "good", label: getConditionText("good") },
      { value: "fair", label: getConditionText("fair") },
    ];
  };

  // Reset form when drawer opens/closes or editing asset changes
  useEffect(() => {
    if (open) {
      setIsFormReady(false);
      const today = new Date().toISOString().split("T")[0];

      setTimeout(() => {
        reset({
          assetCode: `TS${Date.now().toString().slice(-3)}`,
          name: "",
          category: "",
          status: "available",
          condition: "new",
          department: "",
          assignedTo: "",
          assigneeId: "",
          value: 0,
          quantity: 1,
          purchaseDate: today,
          warrantyDate: "",
          serialNumber: "",
          brand: "",
          model: "",
          supplier: "",
          description: "",
          notes: "",
        });
        setTags([]);
        setIsFormReady(true);
      }, 100);
    }
  }, [open, reset]);

  // Đơn giản hóa form submission - chỉ có create
  const onFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      tags,
      value: Number(data.value),
      quantity: Number(data.quantity),
    };

    onSubmit(formattedData);
  };

  // Handle close with confirmation if form is dirty
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 640, md: 800 },
          bgcolor: "#f8f9fa",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Form Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            bgcolor: "white",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            {formTitle}
          </Typography>
          <IconButton onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Body */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {!isFormReady ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Fade in={isFormReady}>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  {/* Basic Info Section */}
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {t("basicInformation")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Box>

                  {/* Asset Code - luôn có thể chỉnh sửa */}
                  <Box>
                    <Controller
                      name="assetCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("assetCode")}
                          error={!!errors.assetCode}
                          helperText={errors.assetCode?.message?.toString()}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Asset Name */}
                  <Box>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("assetName")}
                          error={!!errors.name}
                          helperText={errors.name?.message?.toString()}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Category */}
                  <Box>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.category}
                          required
                        >
                          <InputLabel>{t("category")}</InputLabel>
                          <Select
                            {...field}
                            label={t("category")}
                            sx={{ borderRadius: 2 }}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.name}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.category && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, ml: 1 }}
                            >
                              {errors.category.message?.toString()}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Status */}
                  <Box>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.status} required>
                          <InputLabel>{t("status._label")}</InputLabel>
                          <Select
                            {...field}
                            label={t("status._label")}
                            sx={{ borderRadius: 2 }}
                          >
                            {getFilteredStatusOptions().map((status) => (
                              <MenuItem key={status.value} value={status.value}>
                                {status.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.status && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, ml: 1 }}
                            >
                              {errors.status.message?.toString()}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Condition */}
                  <Box>
                    <Controller
                      name="condition"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.condition}
                          required
                        >
                          <InputLabel>{t("condition._label")}</InputLabel>
                          <Select
                            {...field}
                            label={t("condition._label")}
                            sx={{ borderRadius: 2 }}
                          >
                            {getFilteredConditionOptions().map((condition) => (
                              <MenuItem
                                key={condition.value}
                                value={condition.value}
                              >
                                {condition.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.condition && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, ml: 1 }}
                            >
                              {errors.condition.message?.toString()}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Department */}
                  <Box>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.department}
                          required
                        >
                          <InputLabel>{t("department")}</InputLabel>
                          <Select
                            {...field}
                            label={t("department")}
                            sx={{ borderRadius: 2 }}
                          >
                            {departments?.map((department) => (
                              <MenuItem
                                key={department.id}
                                value={department.name}
                              >
                                {department.name}
                                {department.description && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                  ></Typography>
                                )}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.department && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, ml: 1 }}
                            >
                              {errors.department.message?.toString()}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Financial Information */}
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ mt: 2 }}
                    >
                      {t("financialInformation")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Box>

                  {/* Value */}
                  <Box>
                    <Controller
                      name="value"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("value")}
                          error={!!errors.value}
                          helperText={errors.value?.message?.toString()}
                          type="number"
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                đ
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Quantity */}
                  <Box>
                    <Controller
                      name="quantity"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("quantity")}
                          error={!!errors.quantity}
                          helperText={errors.quantity?.message?.toString()}
                          type="number"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Purchase Date */}
                  <Box>
                    <Controller
                      name="purchaseDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("purchaseDate")}
                          error={!!errors.purchaseDate}
                          helperText={errors.purchaseDate?.message?.toString()}
                          type="date"
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Warranty Date */}
                  <Box>
                    <Controller
                      name="warrantyDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("warrantyDate")}
                          error={!!errors.warrantyDate}
                          helperText={errors.warrantyDate?.message?.toString()}
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Technical Information */}
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ mt: 2 }}
                    >
                      {t("technicalInformation")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Box>

                  {/* Serial Number */}
                  <Box>
                    <Controller
                      name="serialNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("serialNumber")}
                          error={!!errors.serialNumber}
                          helperText={errors.serialNumber?.message?.toString()}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Brand */}
                  <Box>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("brand")}
                          error={!!errors.brand}
                          helperText={errors.brand?.message?.toString()}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Model */}
                  <Box>
                    <Controller
                      name="model"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("model")}
                          error={!!errors.model}
                          helperText={errors.model?.message?.toString()}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Supplier */}
                  <Box>
                    <Controller
                      name="supplier"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("supplier")}
                          error={!!errors.supplier}
                          helperText={errors.supplier?.message?.toString()}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Description */}
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("Description")}
                          multiline
                          rows={2}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Additional Notes */}
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ mt: 2 }}
                    >
                      {t("additionalNotes")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Box>

                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("notes")}
                          multiline
                          rows={3}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>

                {/* Fixed Footer */}
                <Box
                  sx={{
                    p: 3,
                    mt: 3,
                    borderTop: "1px solid #e0e0e0",
                    bgcolor: "white",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={handleClose}
                        disabled={isLoading}
                        startIcon={<CloseIcon />}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={isLoading}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          backgroundColor: "#2196F3",
                          "&:hover": {
                            backgroundColor: "#1976D2",
                          },
                          px: 3,
                        }}
                      >
                        {isLoading ? loadingText : submitButtonText}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </form>
            </Fade>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default InventoryForm;
