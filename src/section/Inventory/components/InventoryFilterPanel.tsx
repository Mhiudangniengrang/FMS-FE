import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Grid,
  Button,
  ButtonGroup,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Business as DepartmentIcon, // ✅ Thay LocationIcon thành DepartmentIcon
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";

interface InventoryFilterPanelProps {
  categories: string[];
  departments: string[]; // ✅ Thay locations thành departments
  selectedCategories: string[];
  selectedStatuses: string[];
  selectedDepartments: string[]; // ✅ Thay selectedLocations thành selectedDepartments
  onCategoryChange: (categories: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
  onDepartmentChange: (departments: string[]) => void; // ✅ Thay onLocationChange thành onDepartmentChange
  sortBy: "name" | "quantity" | "value" | "status";
  sortOrder: "asc" | "desc";
  onSortChange: (
    field: "name" | "quantity" | "value" | "status",
    order: "asc" | "desc"
  ) => void;
}

const InventoryFilterPanel: React.FC<InventoryFilterPanelProps> = ({
  categories = [],
  departments = [],
  selectedCategories = [],
  selectedDepartments = [],
  onCategoryChange,
  onDepartmentChange,
}) => {
  const { t } = useTranslation();

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onCategoryChange(typeof value === "string" ? value.split(",") : value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onDepartmentChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Category Filter */}
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="category-filter-label">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CategoryIcon fontSize="small" />
                {t("Category")}
              </Box>
            </InputLabel>
            <Select
              labelId="category-filter-label"
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label={t("Category")} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CategoryIcon fontSize="small" color="action" />
                    {category}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Department Filter */}
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="department-filter-label">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DepartmentIcon fontSize="small" />
                {t("Department")}
              </Box>
            </InputLabel>
            <Select
              labelId="department-filter-label"
              multiple
              value={selectedDepartments}
              onChange={handleDepartmentChange}
              input={<OutlinedInput label={t("Department")} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {departments.map((department) => (
                <MenuItem key={department} value={department}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DepartmentIcon fontSize="small" color="action" />
                    {department}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryFilterPanel;
