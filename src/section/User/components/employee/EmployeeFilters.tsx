import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { DepartmentStats } from "@/types/employeeType";

interface Department {
  id: number;
  name: string;
  description: string;
  employees?: { id: string; name: string }[];
}

interface EmployeeFiltersProps {
  searchQuery: string;
  filterDepartment: string;
  departmentStats?: DepartmentStats;
  departments?: Department[];
  onSearchChange: (value: string) => void;
  onDepartmentFilterChange: (value: string) => void;
  onClearSearch: () => void;
  onClearFilters: () => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchQuery,
  filterDepartment,
  departmentStats,
  departments,
  onSearchChange,
  onDepartmentFilterChange,
  onClearSearch,
  onClearFilters,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
      {/* Search Field */}
      <TextField
        placeholder={t("searchEmployees")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1, minWidth: "200px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <Tooltip title={t("clearSearch")}>
                <IconButton edge="end" onClick={onClearSearch} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
        size="small"
      />

      {/* Department Filter */}
      <FormControl size="small" sx={{ minWidth: "180px" }}>
        <InputLabel id="department-filter-label">
          {t("filterByDepartment")}
        </InputLabel>
        <Select
          labelId="department-filter-label"
          value={filterDepartment}
          onChange={(e) => onDepartmentFilterChange(e.target.value)}
          label={t("filterByDepartment")}
          startAdornment={
            <InputAdornment position="start">
              <FilterIcon fontSize="small" />
            </InputAdornment>
          }
        >
          <MenuItem value="all">{t("allDepartments")}</MenuItem>
          {departmentStats &&
            Object.entries(departmentStats).map(([dept, stats]) => (
              <MenuItem key={dept} value={dept}>
                {dept} ({stats.count})
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};
