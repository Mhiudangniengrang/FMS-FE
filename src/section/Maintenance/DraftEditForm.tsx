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
  Autocomplete,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAssets, useCreateMaintenanceRequest, useUpdateDraftMaintenanceRequest } from "../../hooks/useMaintenance";
import type { MaintenanceFormData, Asset, MaintenanceRequest } from "../../types";
import * as Cookies from "js-cookie";

interface DraftEditFormProps {
  draft: MaintenanceRequest;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const DraftEditForm: React.FC<DraftEditFormProps> = ({ draft, onSubmitSuccess, onCancel }) => {
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const createMaintenanceMutation = useCreateMaintenanceRequest();
  const updateDraftMutation = useUpdateDraftMaintenanceRequest();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MaintenanceFormData>({
    defaultValues: {
      assetId: draft.assetId,
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      expectedCompletionTime: draft.expectedCompletionTime || "",
    }
  });

  const selectedAssetId = watch("assetId");
  const selectedAsset = assets?.find((asset) => asset.id === selectedAssetId);

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      const userId = Cookies.get("__userId");
      const payload = {
        id: draft.id,
        data: {
          assetId: data.assetId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          expectedCompletionTime: data.expectedCompletionTime,
          isDraft: false,
          status: "pending" as const, // Set status to pending when submitted
          requestedBy: userId ? parseInt(userId) : undefined,
        }
      };
      
      console.log("Submitting draft ID:", draft.id, "with isDraft:", false);
      
      // Update the existing draft to convert it to a submitted request
      await updateDraftMutation.mutateAsync(payload);
      onSubmitSuccess();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      // Error is handled in the hook
    }
  };

  const onSaveDraft = async (data: MaintenanceFormData) => {
    try {
      const userId = Cookies.get("__userId");
      await updateDraftMutation.mutateAsync({
        id: draft.id,
        data: {
          assetId: data.assetId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          expectedCompletionTime: data.expectedCompletionTime,
          isDraft: true,
          requestedBy: userId ? parseInt(userId) : undefined,
        }
      });
      onSubmitSuccess();
    } catch {
      // Error is handled in the hook
    }
  };

  // Helper functions for asset status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available": return "Có sẵn";
      case "in_use": return "Đang sử dụng";
      case "broken": return "Hỏng";
      case "maintenance": return "Bảo trì";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "in_use": return "warning";  // Màu cam/vàng như trong ảnh
      case "broken": return "error";
      case "maintenance": return "info";
      default: return "default";
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Asset Selection */}
        <Box>
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
                onChange={(_, newValue: Asset | null) => field.onChange(newValue?.id || "")}
                renderOption={(props, option: Asset) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.code} - {option.location}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn tài sản"
                    error={!!errors.assetId}
                    helperText={errors.assetId?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                loading={assetsLoading}
              />
            )}
          />
        </Box>

        {/* Asset Details */}
        {selectedAsset && (
          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">
                <strong>Trạng thái:</strong>
              </Typography>
              <Chip 
                label={getStatusLabel(selectedAsset.status)}
                color={getStatusColor(selectedAsset.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                size="small"
              />
            </Box>
          </Box>
        )}

        {/* Title */}
        <TextField
          label="Tiêu đề yêu cầu"
          {...register("title", { required: "Vui lòng nhập tiêu đề" })}
          error={!!errors.title}
          helperText={errors.title?.message}
          InputLabelProps={{ shrink: true }}
        />

        {/* Description */}
        <TextField
          label="Mô tả chi tiết"
          multiline
          rows={4}
          {...register("description", { required: "Vui lòng nhập mô tả" })}
          error={!!errors.description}
          helperText={errors.description?.message}
          InputLabelProps={{ shrink: true }}
        />

        {/* Priority */}
        <Box>
          <Controller
            name="priority"
            control={control}
            rules={{ required: "Vui lòng chọn mức độ ưu tiên" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel shrink>Mức độ ưu tiên</InputLabel>
                <Select
                  {...field}
                  label="Mức độ ưu tiên"
                  notched
                >
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
                {errors.priority && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.priority.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Box>

        {/* Expected Completion Time */}
        <Box>
          <TextField
            label="Thời gian mong muốn hoàn thành"
            type="datetime-local"
            {...register("expectedCompletionTime")}
            error={!!errors.expectedCompletionTime}
            helperText={errors.expectedCompletionTime?.message || "Tùy chọn - có thể để trống"}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {/* Submit Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={createMaintenanceMutation.isPending || updateDraftMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="outlined"
            startIcon={
              updateDraftMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />
            }
            onClick={handleSubmit(onSaveDraft)}
            disabled={createMaintenanceMutation.isPending || updateDraftMutation.isPending}
            sx={{ minWidth: 140 }}
          >
            {updateDraftMutation.isPending ? "Đang lưu..." : "Lưu Bản Nháp"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={
              createMaintenanceMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />
            }
            disabled={createMaintenanceMutation.isPending || updateDraftMutation.isPending}
            sx={{ minWidth: 140 }}
          >
            {createMaintenanceMutation.isPending ? "Đang gửi..." : "Gửi Yêu Cầu"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default DraftEditForm;