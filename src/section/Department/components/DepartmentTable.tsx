import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Business as DepartmentIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import type { Asset } from "../../Asset/types";

interface DepartmentSummary {
  department: string;
  assetCount: number;
  assets: Asset[];
  totalValue: number;
  categories: { [key: string]: number };
}

interface DepartmentTableProps {
  filteredDepartments: DepartmentSummary[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  formatCurrency: (value: number) => string;
  onViewDetails: (departmentSummary: DepartmentSummary) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  filteredDepartments,
  totalCount,
  page,
  rowsPerPage,
  formatCurrency,
  onViewDetails,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650, width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>
                {t("department")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", width: "15%" }}
              >
                {t("Asset Count")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", width: "20%" }}
              >
                {t("Total Value")}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                {t("Asset Categories")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", width: "10%" }}
              >
                {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.map((departmentSummary) => (
              <TableRow key={departmentSummary.department} hover>
                <TableCell sx={{ width: "25%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      <DepartmentIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {departmentSummary.department}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ width: "15%" }}>
                  <Chip
                    label={departmentSummary.assetCount}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="success.main"
                  >
                    {formatCurrency(departmentSummary.totalValue)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "30%" }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {Object.entries(departmentSummary.categories).map(
                      ([category, count]) => (
                        <Chip
                          key={category}
                          label={`${category} (${count})`}
                          size="small"
                          variant="outlined"
                        />
                      )
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ width: "10%" }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onViewDetails(departmentSummary)}
                    title={t("View Details")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={t("rowsPerPage")}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${t("of")} ${count}`
        }
      />
    </Paper>
  );
};

export default DepartmentTable;
