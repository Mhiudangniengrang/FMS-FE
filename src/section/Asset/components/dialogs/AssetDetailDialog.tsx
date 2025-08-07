import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
} from "@mui/material"

import type { Asset, Category, Department, Employee, StatusOption, ConditionOption } from '../../types'
import { statusColors, conditionColors, formatCurrency, formatDate, getAssetAssignmentStats, getAssetStatusByUsage } from "../../utils"

interface AssetDetailDialogProps {
  asset: Asset | null
  data: {
    categories: Category[]
    departments: Department[]
    employees: Employee[]
    statusOptions: StatusOption[]
    conditionOptions: ConditionOption[]
  } | null
  open: boolean
  onClose: () => void
}

const AssetDetailDialog: React.FC<AssetDetailDialogProps> = ({
  asset,
  data,
  open,
  onClose,
}) => {
  if (!asset || !data) return null

  const stats = getAssetAssignmentStats(asset)
  const status = getAssetStatusByUsage(asset)

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
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={asset.thumbnail || "/placeholder.svg?height=60&width=60"}
            alt={asset.name}
            sx={{ width: 60, height: 60, borderRadius: 2 }}
            variant="rounded"
          />
          <Box>
            <Typography variant="h6">{asset.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {asset.assetCode}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Danh mục:
              </Typography>
              <Typography variant="body1">{asset.category}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Thương hiệu:
              </Typography>
              <Typography variant="body1">{asset.brand}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Model:
              </Typography>
              <Typography variant="body1">{asset.model}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Số serial:
              </Typography>
              <Typography variant="body1">{asset.serialNumber}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Trạng thái & Vị trí
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Trạng thái:
              </Typography>
              <Chip
                label={asset.status}
                size="small"
                color={statusColors[asset.status]}
                sx={{ mt: 0.5, borderRadius: 2 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tình trạng:
              </Typography>
              <Chip
                label={asset.condition}
                size="small"
                color={conditionColors[asset.condition]}
                variant="outlined"
                sx={{ mt: 0.5, borderRadius: 2 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Số lượng:
              </Typography>
              <Typography variant="body1">{asset.quantity || 1} chiếc</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tình trạng sử dụng:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography variant="body2" fontWeight="medium">
                  {stats.activeQuantity}/{stats.totalQuantity}
                </Typography>
                <Chip
                  label={status === "fully_used" ? "Hết" : status === "limited" ? "Gần hết" : "Còn trống"}
                  size="small"
                  color={status === "fully_used" ? "error" : status === "limited" ? "warning" : "success"}
                  sx={{ borderRadius: 1, fontSize: "0.7rem" }}
                />
              </Box>
              <Box sx={{ 
                width: "100%", 
                height: 6, 
                backgroundColor: "#e0e0e0", 
                borderRadius: 3,
                overflow: "hidden",
                mt: 1
              }}>
                <Box sx={{
                  width: `${stats.usagePercentage}%`,
                  height: "100%",
                  backgroundColor: status === "fully_used" ? "#f44336" : status === "limited" ? "#ff9800" : "#4caf50",
                  transition: "width 0.3s ease"
                }} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Thông tin tài chính
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Giá trị:
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(asset.value)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ngày mua:
                </Typography>
                <Typography variant="body1">{formatDate(asset.purchaseDate)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Hết bảo hành:
                </Typography>
                <Typography variant="body1">{formatDate(asset.warrantyDate)}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="subtitle2" gutterBottom>
              Mô tả
            </Typography>
            <Typography variant="body2">{asset.description}</Typography>
          </Box>
          {asset.notes && (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="subtitle2" gutterBottom>
                Ghi chú
              </Typography>
              <Typography variant="body2">{asset.notes}</Typography>
            </Box>
          )}

          {/* Assignment Details */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Chi tiết phân công
            </Typography>
            
            {asset.assignments && asset.assignments.length > 0 ? (
              <Box>
                {/* Active Assignments */}
                {stats.activeAssignments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="primary" fontWeight="medium" gutterBottom>
                      Đang sử dụng ({stats.activeAssignments.length} phòng ban):
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {stats.activeAssignments.map((assignment) => (
                        <Box 
                          key={assignment.id} 
                          sx={{ 
                            p: 2, 
                            border: 1, 
                            borderColor: 'primary.main', 
                            borderRadius: 2, 
                            bgcolor: 'primary.50',
                            opacity: 0.8
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {assignment.departmentName}
                            </Typography>
                            <Chip 
                              label={`${assignment.quantity} chiếc`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Người sử dụng: {assignment.assignedTo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ngày phân công: {formatDate(assignment.assignedDate)} | Dự kiến trả: {formatDate(assignment.expectedReturnDate)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Returned Assignments */}
                {stats.returnedAssignments.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium" gutterBottom>
                      Đã trả ({stats.returnedAssignments.length} phòng ban):
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {stats.returnedAssignments.map((assignment) => (
                        <Box 
                          key={assignment.id} 
                          sx={{ 
                            p: 2, 
                            border: 1, 
                            borderColor: 'success.main', 
                            borderRadius: 2, 
                            bgcolor: 'success.50',
                            opacity: 0.8
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="body1" fontWeight="medium" color="text.secondary">
                              {assignment.departmentName}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
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
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Người sử dụng: {assignment.assignedTo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ngày phân công: {formatDate(assignment.assignedDate)} | Ngày trả: {assignment.actualReturnDate ? formatDate(assignment.actualReturnDate) : 'N/A'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ 
                p: 3, 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 2, 
                bgcolor: '#f5f5f5',
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có phân công nào cho tài sản này.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2, textTransform: "none" }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssetDetailDialog 