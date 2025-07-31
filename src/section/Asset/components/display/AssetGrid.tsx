import React from "react"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  TablePagination,
} from "@mui/material"
import { Visibility as VisibilityIcon } from "@mui/icons-material"
import type { Asset, Category, Location, Employee, StatusOption, ConditionOption } from '../../types'
import { statusColors, conditionColors, formatCurrency } from "../../utils"

interface AssetGridProps {
  assets: Asset[]
  data: {
    categories: Category[]
    locations: Location[]
    employees: Employee[]
    statusOptions: StatusOption[]
    conditionOptions: ConditionOption[]
  } | null
  page: number
  rowsPerPage: number
  totalCount: number
  onViewDetail: (asset: Asset) => void
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  rowsPerPageOptions: number[]
}

const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  data,
  page,
  rowsPerPage,
  totalCount,
  onViewDetail,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => {
  if (!data) return null

  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
        {assets.map((asset) => (
          <Card
            key={asset.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={asset.thumbnail || "/placeholder.svg?height=200&width=300"}
              alt={asset.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom noWrap>
                {asset.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {asset.assetCode}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={asset.status}
                  size="small"
                  color={statusColors[asset.status]}
                  sx={{ mr: 1, mb: 1, borderRadius: 2 }}
                />
                <Chip
                  label={asset.condition}
                  size="small"
                  color={conditionColors[asset.condition]}
                  variant="outlined"
                  sx={{ mb: 1, borderRadius: 2 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                📍 {asset.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                👤 {asset.assignedTo || "Chưa phân công"}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                {formatCurrency(asset.value)}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => onViewDetail(asset)}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Xem chi tiết
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => {
            onRowsPerPageChange(Number.parseInt(e.target.value, 10))
          }}
          labelRowsPerPage="Số mục mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Box>
    </Box>
  )
}

export default AssetGrid 