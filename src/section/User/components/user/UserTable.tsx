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
  Chip,
  TablePagination,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { User } from "@/types/user.types";
import { useTranslation } from "react-i18next";

interface UserTableProps {
  users: User[];
  page: number;
  limit: number;
  totalCount: number;
  filteredUsers: User[];
  isFiltering: boolean;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  page,
  limit,
  totalCount,
  filteredUsers,
  isFiltering,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("email")}</TableCell>
              <TableCell>{t("phone")}</TableCell>
              <TableCell>{t("role")}</TableCell>
              <TableCell align="center">{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user: User, idx: number) => (
                <TableRow key={user.id} hover>
                  <TableCell>{page * limit + idx + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.role === "supervisor"
                          ? t("supervisors")
                          : user.role === "manager"
                          ? t("managers")
                          : t("staffs")
                      }
                      color={
                        user.role === "supervisor"
                          ? "primary"
                          : user.role === "manager"
                          ? "success"
                          : "info"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(user)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(user.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length > 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("loadingData")}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("noResultsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <TablePagination
        component="div"
        count={isFiltering ? filteredUsers.length : totalCount}
        page={page}
        onPageChange={(_, newPage) => {
          onPageChange(newPage);
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          onLimitChange(newLimit);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={t("rowsPerPage") || "Số dòng mỗi trang:"}
        labelDisplayedRows={({ from, to, count }) => {
          const adjustedFrom = count === 0 ? 0 : from;
          const adjustedTo = count === 0 ? 0 : Math.min(to, count);
          return `${adjustedFrom}-${adjustedTo} ${t("of")} ${count}`;
        }}
      />
    </Paper>
  );
};

export default UserTable;
