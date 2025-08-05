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
} from "@mui/material";
import {
  Category as CategoryIcon,
  Business as DepartmentIcon,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";

interface InventoryFilterPanelProps {
  categories: string[];
  departments: string[];
  selectedCategories: string[];
  selectedStatuses: string[];
  selectedDepartments: string[];
  onCategoryChange: (categories: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
  onDepartmentChange: (departments: string[]) => void;
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

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;

    if (value === "all" || value === "") {
      onCategoryChange([]);
    } else {
      onCategoryChange([value]);
    }
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;

    if (value === "all" || value === "") {
      onDepartmentChange([]);
    } else {
      onDepartmentChange([value]);
    }
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
              value={
                selectedCategories.length === 0 ? "all" : selectedCategories[0]
              }
              onChange={handleCategoryChange}
              input={<OutlinedInput label={t("Category")} />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
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
              value={
                selectedDepartments.length === 0
                  ? "all"
                  : selectedDepartments[0]
              }
              onChange={handleDepartmentChange}
              input={<OutlinedInput label={t("Department")} />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
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
