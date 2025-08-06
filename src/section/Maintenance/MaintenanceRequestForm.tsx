import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import {
  Build as BuildIcon,
  Send as SendIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAssets, useCreateMaintenanceRequest, useSaveDraftMaintenanceRequest } from "../../hooks/useMaintenance";
import type { MaintenanceFormData, Asset } from "../../types";
import Cookies from "js-cookie";

const MaintenanceRequestForm: React.FC = () => {
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const createMaintenanceMutation = useCreateMaintenanceRequest();
  const saveDraftMutation = useSaveDraftMaintenanceRequest();
  
  // States for auto-save draft functionality
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

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
  
  // Watch all form fields for changes
  const watchedFields = watch();
  
  // Track form changes
  useEffect(() => {
    const hasData = watchedFields.assetId || watchedFields.title || watchedFields.description || watchedFields.priority || watchedFields.expectedCompletionTime;
    setHasFormChanges(!!hasData);
  }, [watchedFields]);
  
  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormChanges && !isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasFormChanges]);

  // Handle route changes within the app
  useEffect(() => {
    // This is a simplified version - in a real app you'd use react-router's blocker
    // For now, the beforeunload event will handle most cases
    return () => {
      // Cleanup
    };
  }, [location, hasFormChanges]);

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      isSubmittingRef.current = true;
      const userId = Cookies.get("__userId");
      await createMaintenanceMutation.mutateAsync({
        ...data,
        isDraft: false,
        // Note: In real app, requestedBy should be set by backend from auth token
        requestedBy: userId ? parseInt(userId) : undefined,
      });
      reset();
      setHasFormChanges(false);
    } catch {
      // Error is handled in the hook
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const onSaveDraft = async (data: MaintenanceFormData) => {
    try {
      isSubmittingRef.current = true;
      const userId = Cookies.get("__userId");
      await saveDraftMutation.mutateAsync({
        ...data,
        isDraft: true,
        // Note: In real app, requestedBy should be set by backend from auth token
        requestedBy: userId ? parseInt(userId) : undefined,
      });
      reset();
      setHasFormChanges(false);
    } catch {
      // Error is handled in the hook
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Handle auto-save draft dialog
  const handleSaveAsDraft = async () => {
    const formData = watchedFields as MaintenanceFormData;
    if (formData.assetId || formData.title || formData.description) {
      await onSaveDraft(formData);
    }
    setShowDraftDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleDiscardChanges = () => {
    setShowDraftDialog(false);
    setHasFormChanges(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
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
                      onChange={(_, newValue: Asset | null) => field.onChange(newValue?.id || "")}
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
                      renderOption={(props, option: Asset) => (
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

            {/* Expected Completion Time */}
            <Box sx={{ maxWidth: { xs: "100%", md: "50%" } }}>
              <TextField
                {...register("expectedCompletionTime")}
                label="Thời Gian Mong Muốn Hoàn Thành"
                type="datetime-local"
                variant="outlined"
                fullWidth
                error={!!errors.expectedCompletionTime}
                helperText={errors.expectedCompletionTime?.message || "Thời gian mong muốn bảo trì được hoàn thành"}
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
                onClick={() => reset()}
                disabled={createMaintenanceMutation.isPending || saveDraftMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={
                  saveDraftMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />
                }
                onClick={handleSubmit(onSaveDraft)}
                disabled={createMaintenanceMutation.isPending || saveDraftMutation.isPending}
                sx={{ minWidth: 140 }}
              >
                {saveDraftMutation.isPending ? "Đang lưu..." : "Lưu Bản Nháp"}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  createMaintenanceMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />
                }
                disabled={createMaintenanceMutation.isPending || saveDraftMutation.isPending}
                sx={{ minWidth: 140 }}
              >
                {createMaintenanceMutation.isPending ? "Đang gửi..." : "Gửi Yêu Cầu"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>

    {/* Auto-save Draft Dialog */}
    <Dialog open={showDraftDialog} onClose={() => {}}>
      <DialogTitle>Lưu thay đổi?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có những thay đổi chưa được lưu. Bạn có muốn lưu vào bản nháp để hoàn thành sau không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDiscardChanges} color="inherit">
          Không lưu
        </Button>
        <Button 
          onClick={handleSaveAsDraft} 
          variant="contained" 
          disabled={saveDraftMutation.isPending}
        >
          {saveDraftMutation.isPending ? "Đang lưu..." : "Lưu bản nháp"}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default MaintenanceRequestForm; 