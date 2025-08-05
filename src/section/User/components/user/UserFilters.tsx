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

interface UserFiltersProps {
  searchQuery: string;
  filterRole: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (role: string) => void;
  onClearSearch: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  filterRole,
  onSearchChange,
  onFilterChange,
  onClearSearch,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        placeholder={t("searchUsers")}
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
              <Tooltip title="Clear search">
                <IconButton edge="end" onClick={onClearSearch} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: "150px" }}>
        <InputLabel id="role-filter-label">Filter by Role</InputLabel>
        <Select
          labelId="role-filter-label"
          value={filterRole}
          onChange={(e) => onFilterChange(e.target.value)}
          label={t("filterByRole")}
          startAdornment={
            <InputAdornment position="start">
              <FilterIcon fontSize="small" />
            </InputAdornment>
          }
        >
          <MenuItem value="all">{t("allRoles")}</MenuItem>
          <MenuItem value="manager">{t("managers")}</MenuItem>
          <MenuItem value="supervisor">{t("supervisors")}</MenuItem>
          <MenuItem value="staff">{t("staffs")}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserFilters;
