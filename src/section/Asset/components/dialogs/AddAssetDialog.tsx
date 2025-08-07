import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Autocomplete,
} from "@mui/material"
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from "@mui/icons-material"

import type { NewAssetForm } from '../../types'
import { getCategoryIcon, statusColors, conditionColors } from "../../utils"

import type { AddAssetDialogProps } from '../../types'

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({
  open,
  data,
  form,
  onFormChange,
  onClose,
  onSubmit,
}) => {
  if (!data) return null

  const handleInputChange = (field: keyof NewAssetForm, value: string) => {
    onFormChange({ ...form, [field]: value })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AddIcon color="primary" />
          Thêm tài sản mới
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mt: 1 }}>
          {/* Basic Information */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              📋 Thông tin cơ bản
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Tên tài sản *"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>Danh mục *</InputLabel>
              <Select
                value={form.category}
                label="Danh mục *"
                onChange={(e) => handleInputChange("category", e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {data.categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getCategoryIcon(category.icon)}
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Thương hiệu"
              value={form.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Model"
              value={form.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Số serial"
              value={form.serialNumber}
              onChange={(e) => handleInputChange("serialNumber", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Nhà cung cấp"
              value={form.supplier}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          {/* Department & Assignment */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              📍 Phòng ban & Phân công
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>Phòng ban</InputLabel>
              <Select
                value={form.department}
                label="Phòng ban"
                onChange={(e) => handleInputChange("department", e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {data.departments.map((department) => (
                  <MenuItem key={department.id} value={department.name}>
                    {department.name} - {department.building}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Autocomplete
              options={data.employees}
              getOptionLabel={(option) => option.name}
              value={data.employees.find((emp) => emp.name === form.assignedTo) || null}
              onChange={(_, newValue) => {
                onFormChange({
                  ...form,
                  assignedTo: newValue?.name || "",
                  assigneeId: newValue?.id || "",
                })
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Người sử dụng"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              )}
            />
          </Box>

          {/* Status & Condition */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              🔧 Trạng thái & Tình trạng
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={form.status}
                label="Trạng thái"
                onChange={(e) => handleInputChange("status", e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {data.statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip
                      label={status.label}
                      size="small"
                      color={statusColors[status.value]}
                      sx={{ borderRadius: 2 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>Tình trạng</InputLabel>
              <Select
                value={form.condition}
                label="Tình trạng"
                onChange={(e) => handleInputChange("condition", e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {data.conditionOptions.map((condition) => (
                  <MenuItem key={condition.value} value={condition.value}>
                    <Chip
                      label={condition.label}
                      size="small"
                      color={conditionColors[condition.value]}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Financial Information */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              💰 Thông tin tài chính
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Giá trị (VND) *"
              type="number"
              value={form.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Ngày mua"
              type="date"
              value={form.purchaseDate}
              onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Hết bảo hành"
              type="date"
              value={form.warrantyDate}
              onChange={(e) => handleInputChange("warrantyDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          {/* Additional Notes */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
              📝 Ghi chú bổ sung
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={3}
              value={form.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            px: 3,
          }}
        >
          Lưu tài sản
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAssetDialog 