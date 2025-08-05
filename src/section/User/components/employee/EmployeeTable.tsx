import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Employee } from "@/types/employeeType";

interface EmployeeTableProps {
  employees: Employee[];
  page: number;
  limit: number;
  totalCount: number;
  filteredEmployees: Employee[];
  isFiltering: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  page,
  limit,
  totalCount,
  filteredEmployees,
  isFiltering,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const getRowCount = () => {
    return isFiltering ? filteredEmployees.length : totalCount;
  };

  if (!employees || employees.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" align="center">
          {t("noEmployeesFound")}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("employeeId")}</TableCell>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("position")}</TableCell>
              <TableCell>{t("department")}</TableCell>
              <TableCell>{t("email")}</TableCell>
              <TableCell align="center">{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {employee.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {employee.position}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={employee.department} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {employee.email}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(employee)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(employee.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={getRowCount()}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={t("rowsPerPage")}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${t("of")} ${count !== -1 ? count : `${t("moreThan")} ${to}`}`
        }
      />
    </Paper>
  );
};