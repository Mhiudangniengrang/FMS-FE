import React from "react"
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import {
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Add as AddIcon,
} from "@mui/icons-material"

import type { AssetFiltersProps } from '../../types'

const AssetFilters: React.FC<AssetFiltersProps> = ({
  data,
  searchTerm,
  categoryFilter,
  statusFilter,
  locationFilter,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onViewModeChange,
  onAddAsset,
}) => {
  if (!data) return null

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2.5fr 1.5fr 2fr 2fr 2fr 2fr" }, gap: 2, alignItems: "center" }}>
        <Box>
          <TextField
            fullWidth
            placeholder="Tìm kiếm tài sản..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddAsset}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 1.5,
              py: 1.5,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
            }}
            fullWidth
          >
            Thêm tài sản
          </Button>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              label="Danh mục"
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {data.categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => onStatusChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {data.statusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>Vị trí</InputLabel>
            <Select
              value={locationFilter}
              label="Vị trí"
              onChange={(e) => onLocationChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {data.locations.map((location) => (
                <MenuItem key={location.id} value={location.name}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            <ToggleButton value="table" sx={{ borderRadius: 2 }}>
              <ViewListIcon />
            </ToggleButton>
            {/* <ToggleButton value="grid" sx={{ borderRadius: 2 }}>
              <ViewModuleIcon />
            </ToggleButton> */}
          </ToggleButtonGroup>
        </Box>
      </Box>
    </Paper>
  )
}

export default AssetFilters 