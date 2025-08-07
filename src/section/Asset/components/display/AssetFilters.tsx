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
} from "@mui/material"
import {
  Search as SearchIcon,
} from "@mui/icons-material"

import type { AssetFiltersProps } from '../../types'

const AssetFilters: React.FC<AssetFiltersProps> = ({
  data,
  searchTerm,
  categoryFilter,
  statusFilter,
  departmentFilter,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onDepartmentChange,
  onAddAsset,
}) => {
  if (!data) return null

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2.5fr 1.5fr 2fr 2fr 2fr 2fr" }, gap: 2, alignItems: "center" }}>
        <Box>
          <TextField
            fullWidth
            placeholder="Search..."
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
        {/* <Box>
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
        </Box> */}
        <Box>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {(data.categories || []).map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={statusFilter}
              label="Condition"
              onChange={(e) => onStatusChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {(data.statusOptions || []).map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => onDepartmentChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {(data.departments || []).map((department) => (
                <MenuItem key={department.id} value={department.name}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      </Box>
    </Paper>
  )
}

export default AssetFilters 