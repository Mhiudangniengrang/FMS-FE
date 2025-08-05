import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { Business as DepartmentIcon } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";

interface DepartmentFilterProps {
  departments: string[];
  selectedDepartments: string[];
  onDepartmentChange: (departments: string[]) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  departments,
  selectedDepartments,
  onDepartmentChange,
}) => {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;

    if (value === "all" || value === "") {
      onDepartmentChange([]);
    } else {
      onDepartmentChange([value]);
    }
  };

  return (
    <Box>
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
            selectedDepartments.length === 0 ? "all" : selectedDepartments[0]
          }
          onChange={handleChange}
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
  );
};

export default DepartmentFilter;
