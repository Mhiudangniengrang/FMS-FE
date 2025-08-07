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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import type { Asset, NewAssetForm } from "../../types";
import {
  getCategoryIcon,
  statusColors,
  getAssetAssignmentStats,
  canAssignMore,
} from "../../utils";

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
    quantity: "1",
    purchaseDate: "",
    warrantyDate: "",
    supplier: "",
    notes: "",
    tags: [],
    assignments: [],
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    departmentId: "",
    departmentName: "",
    assignedTo: "",
    assigneeId: "",
    quantity: "1",
    assignedDate: new Date().toISOString().split("T")[0],
    expectedReturnDate: "",
  });

  // Calculate available quantity
  const stats = asset
    ? getAssetAssignmentStats(asset)
    : { totalQuantity: 0, availableQuantity: 0, activeQuantity: 0 };
  const canAddMore = asset ? canAssignMore(asset) : false;

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
        quantity: asset.quantity?.toString() || "1",
        purchaseDate: asset.purchaseDate || "",
        warrantyDate: asset.warrantyDate || "",
        supplier: asset.supplier || "",
        notes: asset.notes || "",
        tags: asset.tags || [],
        assignments: asset.assignments || [],
      });
      setHasChanges(false);
    }
  }, [asset]);

  const handleInputChange = (
    field: keyof NewAssetForm,
    value: string | string[] | boolean
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

  const handleAddAssignment = () => {
    const requestedQuantity = parseInt(newAssignment.quantity) || 0;

    if (
      newAssignment.departmentId &&
      newAssignment.assignedTo &&
      requestedQuantity > 0
    ) {
      // Double check if we can still assign this quantity
      if (requestedQuantity > stats.availableQuantity) {
        alert(
          `Không thể phân công ${requestedQuantity} chiếc. Chỉ còn ${stats.availableQuantity} chiếc trong kho.`
        );
        return;
      }

      const assignment = {
        id: `assign_${Date.now()}`,
        departmentId: parseInt(newAssignment.departmentId),
        departmentName: newAssignment.departmentName,
        assignedTo: newAssignment.assignedTo,
        assigneeId: newAssignment.assigneeId,
        quantity: requestedQuantity,
        assignedDate: newAssignment.assignedDate,
        expectedReturnDate: newAssignment.expectedReturnDate,
        actualReturnDate: null,
        isReturned: false,
      };

      setForm((prev) => ({
        ...prev,
        assignments: [...(prev.assignments || []), assignment],
      }));
      setHasChanges(true);
      setShowNewAssignmentForm(false);

      // Reset new assignment form
      setNewAssignment({
        departmentId: "",
        departmentName: "",
        assignedTo: "",
        assigneeId: "",
        quantity: "1",
        assignedDate: new Date().toISOString().split("T")[0],
        expectedReturnDate: "",
      });
    }
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    setForm((prev) => ({
      ...prev,
      assignments: prev.assignments?.filter((a) => a.id !== assignmentId) || [],
    }));
    setHasChanges(true);
  };

  const handleSubmit = () => {
    if (asset) {
      const formData = {
        ...form,
        value: parseFloat(form.value) || 0,
        quantity: parseInt(form.quantity) || 1,
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
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#666" }}>Danh mục *</InputLabel>
                    <Select
                      value={form.category}
                      label="Danh mục *"
                      disabled
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                        "& .MuiSelect-icon": {
                          color: "#666",
                        },
                      }}
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
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Model"
                    value={form.model}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Số serial"
                    value={form.serialNumber}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Giá trị"
                    type="number"
                    value={form.value}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Số lượng"
                    type="number"
                    disabled
                    value={form.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
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
                      onChange={(e) => {
                        const newDepartment = e.target.value;
                        handleInputChange("department", newDepartment);
                        // Reset assignee when department changes
                        if (newDepartment !== form.department) {
                          handleEmployeeChange("", "");
                        }
                      }}
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
                    options={
                      form.department
                        ? data.departments.find(
                            (dept) => dept.name === form.department
                          )?.employees || []
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    value={
                      form.department
                        ? data.departments
                            .find((dept) => dept.name === form.department)
                            ?.employees.find(
                              (emp: any) => emp.id === form.assigneeId
                            ) || null
                        : null
                    }
                    onChange={(_, newValue) => {
                      if (newValue) {
                        handleEmployeeChange(newValue.name, newValue.id);
                      } else {
                        handleEmployeeChange("", "");
                      }
                    }}
                    disabled={!form.department}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Người quản lý"
                        placeholder={
                          form.department
                            ? "Chọn nhân viên..."
                            : "Vui lòng chọn phòng ban trước"
                        }
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Assignment Management */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    📋 Quản lý phân công
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setShowNewAssignmentForm(!showNewAssignmentForm)
                    }
                    disabled={!canAddMore}
                    sx={{ borderRadius: 2 }}
                  >
                    {showNewAssignmentForm
                      ? "Ẩn form"
                      : `Thêm phân công${!canAddMore ? " (Hết)" : ""}`}
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Alert
                  severity={canAddMore ? "info" : "warning"}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2">
                    Tổng số lượng: {form.quantity} | Đang sử dụng:{" "}
                    {stats.activeQuantity} | Còn trống:{" "}
                    {stats.availableQuantity} | Đã trả:{" "}
                    {form.assignments?.filter((a) => a.isReturned).length || 0}{" "}
                    phòng ban
                  </Typography>
                  {!canAddMore && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, fontWeight: "medium" }}
                    >
                      ⚠️ Không thể thêm phân công mới vì đã hết số lượng trong
                      kho.
                    </Typography>
                  )}
                </Alert>

                {form.assignments && form.assignments.length > 0 ? (
                  <Box>
                    {/* Active Assignments */}
                    {form.assignments.filter((a) => !a.isReturned).length >
                      0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          color="primary"
                        >
                          Đang sử dụng:
                        </Typography>
                        <List
                          sx={{
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                          }}
                        >
                          {form.assignments
                            .filter((a) => !a.isReturned)
                            .map((assignment, index) => (
                              <ListItem
                                key={assignment.id}
                                divider={
                                  index <
                                  form.assignments!.filter((a) => !a.isReturned)
                                    .length -
                                    1
                                }
                              >
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="medium"
                                      >
                                        {assignment.departmentName}
                                      </Typography>
                                      <Chip
                                        label={`${assignment.quantity} chiếc`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Người sử dụng: {assignment.assignedTo}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Ngày phân công:{" "}
                                        {assignment.assignedDate} | Dự kiến trả:{" "}
                                        {assignment.expectedReturnDate}
                                      </Typography>
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleRemoveAssignment(assignment.id)
                                    }
                                    color="error"
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    )}

                    {/* Returned Assignments */}
                    {form.assignments.filter((a) => a.isReturned).length >
                      0 && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          color="text.secondary"
                        >
                          Đã trả:
                        </Typography>
                        <List
                          sx={{
                            bgcolor: "#f5f5f5",
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                          }}
                        >
                          {form.assignments
                            .filter((a) => a.isReturned)
                            .map((assignment, index) => (
                              <ListItem
                                key={assignment.id}
                                divider={
                                  index <
                                  form.assignments!.filter((a) => a.isReturned)
                                    .length -
                                    1
                                }
                              >
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="medium"
                                        color="text.secondary"
                                      >
                                        {assignment.departmentName}
                                      </Typography>
                                      <Chip
                                        label={`${assignment.quantity} chiếc`}
                                        size="small"
                                        color="default"
                                        variant="outlined"
                                      />
                                      <Chip
                                        label="Đã trả"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Người sử dụng: {assignment.assignedTo}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Ngày phân công:{" "}
                                        {assignment.assignedDate} | Ngày trả:{" "}
                                        {assignment.actualReturnDate || "N/A"}
                                      </Typography>
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleRemoveAssignment(assignment.id)
                                    }
                                    color="error"
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Card sx={{ bgcolor: "#f5f5f5" }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        Chưa có phân công nào. Nhấn "Thêm phân công" để bắt đầu.
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* New Assignment Form */}
                {showNewAssignmentForm && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      border: 1,
                      borderColor: "primary.main",
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      📝 Thêm phân công mới
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 3,
                        }}
                      >
                        <FormControl fullWidth>
                          <InputLabel>Phòng ban *</InputLabel>
                          <Select
                            value={newAssignment.departmentId}
                            label="Phòng ban *"
                            onChange={(e) => {
                              const newDeptId = e.target.value;
                              const dept = data.departments.find(
                                (d) => d.id === parseInt(newDeptId)
                              );
                              setNewAssignment((prev) => ({
                                ...prev,
                                departmentId: newDeptId,
                                departmentName: dept?.name || "",
                                // Reset assignee when department changes
                                assignedTo: "",
                                assigneeId: "",
                              }));
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            {data.departments.map((department) => (
                              <MenuItem
                                key={department.id}
                                value={department.id}
                              >
                                {department.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Autocomplete
                          options={
                            newAssignment.departmentId
                              ? data.departments.find(
                                  (dept) =>
                                    dept.id ===
                                    parseInt(newAssignment.departmentId)
                                )?.employees || []
                              : []
                          }
                          getOptionLabel={(option) => option.name}
                          value={
                            newAssignment.departmentId
                              ? data.departments
                                  .find(
                                    (dept) =>
                                      dept.id ===
                                      parseInt(newAssignment.departmentId)
                                  )
                                  ?.employees.find(
                                    (emp: any) =>
                                      emp.id === newAssignment.assigneeId
                                  ) || null
                              : null
                          }
                          onChange={(_, newValue) => {
                            setNewAssignment((prev) => ({
                              ...prev,
                              assignedTo: newValue?.name || "",
                              assigneeId: newValue?.id || "",
                            }));
                          }}
                          disabled={!newAssignment.departmentId}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Người sử dụng *"
                              placeholder={
                                newAssignment.departmentId
                                  ? "Chọn nhân viên..."
                                  : "Vui lòng chọn phòng ban trước"
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 3,
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Số lượng *"
                          type="number"
                          value={newAssignment.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const maxQuantity = Math.min(
                              stats.availableQuantity,
                              value
                            );
                            setNewAssignment((prev) => ({
                              ...prev,
                              quantity: maxQuantity.toString(),
                            }));
                          }}
                          inputProps={{
                            min: 1,
                            max: stats.availableQuantity,
                          }}
                          helperText={`Tối đa: ${stats.availableQuantity} chiếc còn trống`}
                          error={
                            parseInt(newAssignment.quantity) >
                            stats.availableQuantity
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Ngày phân công"
                          type="date"
                          value={newAssignment.assignedDate}
                          onChange={(e) =>
                            setNewAssignment((prev) => ({
                              ...prev,
                              assignedDate: e.target.value,
                            }))
                          }
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Ngày dự kiến trả"
                          type="date"
                          value={newAssignment.expectedReturnDate}
                          onChange={(e) =>
                            setNewAssignment((prev) => ({
                              ...prev,
                              expectedReturnDate: e.target.value,
                            }))
                          }
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => setShowNewAssignmentForm(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleAddAssignment}
                          variant="contained"
                          color="primary"
                          disabled={
                            !newAssignment.departmentId ||
                            !newAssignment.assignedTo ||
                            !newAssignment.quantity ||
                            parseInt(newAssignment.quantity) >
                              stats.availableQuantity ||
                            parseInt(newAssignment.quantity) <= 0
                          }
                        >
                          Thêm phân công
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Dates */}
              <Box>
                <Typography variant="h6" sx={{ color: "#666" }} gutterBottom>
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
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Ngày bảo hành"
                    type="date"
                    value={form.warrantyDate}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Additional Information */}
              <Box>
                <Typography variant="h6" sx={{ color: "#666" }} gutterBottom>
                  📝 Thông tin bổ sung
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Nhà cung cấp"
                    value={form.supplier}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả"
                    multiline
                    rows={3}
                    value={form.description}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    multiline
                    rows={3}
                    value={form.notes}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                      },
                    }}
                  />
                  {/* <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={form.tags}
                    disabled
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
                        disabled
                        sx={{ 
                          "& .MuiOutlinedInput-root": { 
                            borderRadius: 2,
                            backgroundColor: "#f5f5f5"
                          },
                          "& .MuiInputLabel-root": {
                            color: "#666"
                          }
                        }}
                      />
                    )}
                  /> */}
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
