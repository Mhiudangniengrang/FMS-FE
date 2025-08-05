import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import type { Asset, NewAssetForm } from "../../types";
import { getCategoryIcon } from "../../utils";

interface UpdateAssetDrawerProps {
  open: boolean;
  asset: Asset | null;
  data: {
    categories: any[];
    departments: any[];
    employees: any[];
    statusOptions: any[];
    conditionOptions: any[];
  } | null;
  onClose: () => void;
  onSubmit: (id: number, formData: Partial<Asset>) => void;
  isUpdating: boolean;
}

const UpdateAssetDrawer: React.FC<UpdateAssetDrawerProps> = ({
  open,
  asset,
  data,
  onClose,
  onSubmit,
  isUpdating,
}) => {
  const [form, setForm] = useState<NewAssetForm>({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    description: "",
    department: "",
    assignedTo: "",
    assigneeId: "",
    status: "",
    condition: "",
    value: "",
    purchaseDate: "",
    warrantyDate: "",
    supplier: "",
    notes: "",
    tags: [],
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when asset changes
  useEffect(() => {
    if (asset) {
      setForm({
        name: asset.name || "",
        category: asset.category || "",
        brand: asset.brand || "",
        model: asset.model || "",
        serialNumber: asset.serialNumber || "",
        description: asset.description || "",
        department: asset.department || "",
        assignedTo: asset.assignedTo || "",
        assigneeId: asset.assigneeId || "",
        status: asset.status || "",
        condition: asset.condition || "",
        value: asset.value?.toString() || "",
        purchaseDate: asset.purchaseDate || "",
        warrantyDate: asset.warrantyDate || "",
        supplier: asset.supplier || "",
        notes: asset.notes || "",
        tags: asset.tags || [],
      });
      setHasChanges(false);
    }
  }, [asset]);

  const handleInputChange = (
    field: keyof NewAssetForm,
    value: string | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleEmployeeChange = (employeeName: string, employeeId: string) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: employeeName,
      assigneeId: employeeId,
    }));
    setHasChanges(true);
  };

  const handleSubmit = () => {
    if (asset) {
      const formData = {
        ...form,
        value: parseFloat(form.value) || 0,
      };
      onSubmit(asset.id, formData);
      setConfirmDialogOpen(false);
      setHasChanges(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setConfirmDialogOpen(true);
    } else {
      onClose();
    }
  };

  //   const handleConfirmClose = () => {
  //     setConfirmDialogOpen(false)
  //     onClose()
  //     setHasChanges(false)
  //   }

  if (!asset || !data) return null;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 600, md: 700 },
            borderRadius: "16px 0 0 16px",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <EditIcon color="primary" />
              Cập nhật tài sản
            </Typography>
            <IconButton onClick={handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Asset Code Display */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Mã tài sản:</strong> {asset.assetCode}
            </Typography>
          </Alert>

          {/* Form Content */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  📋 Thông tin cơ bản
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Tên tài sản *"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Danh mục *</InputLabel>
                    <Select
                      value={form.category}
                      label="Danh mục *"
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      {data.categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getCategoryIcon(category.icon)}
                            {category.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Thương hiệu"
                    value={form.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Model"
                    value={form.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Số serial"
                    value={form.serialNumber}
                    onChange={(e) =>
                      handleInputChange("serialNumber", e.target.value)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Giá trị"
                    type="number"
                    value={form.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Box>
              </Box>

              {/* Status and Condition */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  📊 Trạng thái & Tình trạng
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={form.status}
                      label="Trạng thái"
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      {data.statusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {status.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Tình trạng</InputLabel>
                    <Select
                      value={form.condition}
                      label="Tình trạng"
                      onChange={(e) =>
                        handleInputChange("condition", e.target.value)
                      }
                    >
                      {data.conditionOptions.map((condition) => (
                        <MenuItem key={condition.value} value={condition.value}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {condition.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Department and Assignment */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  📍 Phòng ban & Phân công
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Phòng ban</InputLabel>
                    <Select
                      value={form.department}
                      label="Phòng ban"
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      {data.departments.map((department) => (
                        <MenuItem key={department.id} value={department.name}>
                          {department.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Autocomplete
                    options={data.employees}
                    getOptionLabel={(option) => option.name}
                    value={
                      data.employees.find(
                        (emp) => emp.id === form.assigneeId
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      if (newValue) {
                        handleEmployeeChange(newValue.name, newValue.id);
                      } else {
                        handleEmployeeChange("", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Người quản lý"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Dates */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  📅 Thông tin ngày tháng
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Ngày mua"
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) =>
                      handleInputChange("purchaseDate", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Ngày bảo hành"
                    type="date"
                    value={form.warrantyDate}
                    onChange={(e) =>
                      handleInputChange("warrantyDate", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Box>
              </Box>

              {/* Additional Information */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  📝 Thông tin bổ sung
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Nhà cung cấp"
                    value={form.supplier}
                    onChange={(e) =>
                      handleInputChange("supplier", e.target.value)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả"
                    multiline
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    multiline
                    rows={3}
                    value={form.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={form.tags}
                    onChange={(_, newValue) =>
                      handleInputChange("tags", newValue)
                    }
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Thêm tag..."
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              startIcon={<CancelIcon />}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={() => setConfirmDialogOpen(true)}
              startIcon={
                isUpdating ? <CircularProgress size={20} /> : <SaveIcon />
              }
              disabled={isUpdating || !hasChanges}
            >
              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Xác nhận cập nhật</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn cập nhật thông tin tài sản "{asset.name}"
            không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateAssetDrawer;
