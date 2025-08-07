import React from "react";
import { useTranslation } from "react-i18next";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface InventorySearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const InventorySearchBar: React.FC<InventorySearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  return (
    <TextField
      fullWidth
      placeholder={t("Search inventory items...")}
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)} // Bỏ trim() ở đây
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default InventorySearchBar;
