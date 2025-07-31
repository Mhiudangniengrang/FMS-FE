import React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Autocomplete,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Build as BuildIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAssets, useCreateMaintenanceRequest } from "../../hooks/useMaintenance";
import type { MaintenanceFormData, Asset } from "../../types";

const MaintenanceRequestForm: React.FC = () => {
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const createMaintenanceMutation = useCreateMaintenanceRequest();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MaintenanceFormData>();

  const selectedAssetId = watch("assetId");
  const selectedAsset = assets?.find((asset) => asset.id === selectedAssetId);

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      await createMaintenanceMutation.mutateAsync(data);
      reset();
    } catch {
      // Error is handled in the hook
    }
  };

  const priorityOptions = [
    { value: "low", label: "Thấp", color: "#4caf50" },
    { value: "medium", label: "Trung bình", color: "#ff9800" },
    { value: "high", label: "Cao", color: "#f44336" },
    { value: "urgent", label: "Khẩn cấp", color: "#9c27b0" },
  ];

  if (assetsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BuildIcon color="primary" />
            Gửi Yêu Cầu Bảo Trì
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Điền thông tin chi tiết về sự cố cần bảo trì
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            {/* Asset Selection */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="assetId"
                  control={control}
                  rules={{ required: "Vui lòng chọn tài sản" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={assets || []}
                      getOptionLabel={(option: Asset) => `${option.name} (${option.code})`}
                      value={assets?.find((asset) => asset.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chọn Tài Sản *"
                          error={!!errors.assetId}
                          helperText={errors.assetId?.message}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="subtitle2">{option.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.code} - {option.location}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  )}
                />
              </Box>

              {/* Asset Details Display */}
              {selectedAsset && (
                <Box sx={{ flex: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Thông tin tài sản:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tên:</strong> {selectedAsset.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mã:</strong> {selectedAsset.code}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Vị trí:</strong> {selectedAsset.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Trạng thái:</strong>{" "}
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: selectedAsset.status === "available" ? "success.light" : "warning.light",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    >
                      {selectedAsset.status === "available" && "Khả dụng"}
                      {selectedAsset.status === "in_use" && "Đang sử dụng"}
                      {selectedAsset.status === "maintenance" && "Bảo trì"}
                      {selectedAsset.status === "broken" && "Hỏng"}
                    </Box>
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Title */}
            <TextField
              {...register("title", {
                required: "Vui lòng nhập tiêu đề",
                minLength: { value: 5, message: "Tiêu đề phải có ít nhất 5 ký tự" },
              })}
              label="Tiêu Đề Yêu Cầu *"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="VD: Máy in bị kẹt giấy"
            />

            {/* Priority */}
            <Box sx={{ maxWidth: { xs: "100%", md: "50%" } }}>
              <FormControl fullWidth variant="outlined" error={!!errors.priority}>
                <InputLabel>Mức Độ Ưu Tiên *</InputLabel>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: "Vui lòng chọn mức độ ưu tiên" }}
                  render={({ field }) => (
                    <Select {...field} label="Mức Độ Ưu Tiên *">
                      {priorityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: option.color,
                              }}
                            />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.priority && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.priority.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Description */}
            <TextField
              {...register("description", {
                required: "Vui lòng mô tả chi tiết sự cố",
                minLength: { value: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
              })}
              label="Mô Tả Chi Tiết *"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              placeholder="Mô tả chi tiết về sự cố, triệu chứng, thời điểm xảy ra..."
            />

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => reset()}
                disabled={createMaintenanceMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  createMaintenanceMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />
                }
                disabled={createMaintenanceMutation.isPending}
                sx={{ minWidth: 140 }}
              >
                {createMaintenanceMutation.isPending ? "Đang gửi..." : "Gửi Yêu Cầu"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MaintenanceRequestForm; 