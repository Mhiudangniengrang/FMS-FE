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

import type { Asset, Category, Location, Employee, StatusOption, ConditionOption } from '../../types'
import { statusColors, conditionColors, formatCurrency, formatDate } from "../../utils"

interface AssetDetailDialogProps {
  asset: Asset | null
  data: {
    categories: Category[]
    locations: Location[]
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
                Vị trí:
              </Typography>
              <Typography variant="body1">{asset.location || "Chưa có"}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Người sử dụng:
              </Typography>
              <Typography variant="body1">{asset.assignedTo || "Chưa phân công"}</Typography>
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
          {asset.tags.length > 0 && (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {asset.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                ))}
              </Box>
            </Box>
          )}
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