import React, { useState, useMemo, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartment";
import type { CreateEmployeeData, Employee } from "@/types/employeeType";
import {
  EmployeeTable,
  EmployeeStats,
  EmployeeFilters,
  EmployeeForm,
  DeleteConfirmation,
  Header,
} from "./components/employee";

const Employees: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Employee hooks
  const {
    employees,
    isLoading,
    createEmployeeMutation,
    updateEmployeeMutation,
    deleteEmployeeMutation,
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
    selectedDepartment,
    setSelectedDepartment,
  } = useEmployees();

  // Department hooks
  const {
    departments,
    departmentStats,
    isDepartmentsLoading,
    isDepartmentStatsLoading,
  } = useDepartments();

  // Update filters when hook state changes
  useEffect(() => {
    setSelectedDepartment(filterDepartment === "all" ? "" : filterDepartment);
  }, [filterDepartment, setSelectedDepartment]);

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees) || employees.length === 0) {
      return [];
    }

    let result = [...employees];

    // Apply search query
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
      result = result.filter((employee: Employee) => {
        const name = employee.name ? employee.name.toLowerCase() : "";
        const email = employee.email ? employee.email.toLowerCase() : "";
        const position = employee.position
          ? employee.position.toLowerCase()
          : "";
        const department = employee.department
          ? employee.department.toLowerCase()
          : "";

        return (
          name.includes(query) ||
          email.includes(query) ||
          position.includes(query) ||
          department.includes(query)
        );
      });
    }

    return result;
  }, [employees, searchQuery]);

  // Paginated employees
  const paginatedEmployees = useMemo(() => {
    // Nếu đang search, phân trang ở client
    if (searchQuery) {
      const startIndex = page * limit;
      const endIndex = startIndex + limit;

      if (
        filteredEmployees.length === 0 ||
        startIndex >= filteredEmployees.length
      ) {
        return [];
      }

      return filteredEmployees.slice(startIndex, endIndex);
    } else {
      // Nếu không search, dùng data từ server (đã được filter và phân trang)
      return employees || [];
    }
  }, [filteredEmployees, employees, page, limit, searchQuery]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, filterDepartment, setPage]);

  // Ensure current page doesn't exceed max page
  useEffect(() => {
    if (searchQuery) {
      if (filteredEmployees.length > 0) {
        const maxPage = Math.max(
          0,
          Math.ceil(filteredEmployees.length / limit) - 1
        );
        if (page > maxPage) {
          setPage(maxPage);
        }
      }
    } else if (totalCount > 0) {
      const maxPage = Math.max(0, Math.ceil(totalCount / limit) - 1);
      if (page > maxPage) {
        setPage(maxPage);
      }
    }
  }, [filteredEmployees.length, totalCount, limit, page, setPage, searchQuery]);

  const handleClose = () => {
    setOpen(false);
    setEditingEmployee(null);
    setFormMode("create");
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormMode("edit");
    setOpen(true);
  };

  const handleOpenCreateForm = () => {
    setEditingEmployee(null);
    setFormMode("create");
    setOpen(true);
  };

  const handleFormSubmit = (data: CreateEmployeeData) => {
    if (formMode === "edit" && editingEmployee) {
      // Update existing employee
      const payload = {
        id: editingEmployee.id,
        ...data,
      };
      updateEmployeeMutation.mutate(payload);
    } else {
      // Create new employee
      createEmployeeMutation.mutate(data);
    }
    handleClose();
  };

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete !== null) {
      deleteEmployeeMutation.mutate(employeeToDelete);
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleClearFilters = () => {
    setFilterDepartment("all");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Header onCreateEmployee={handleOpenCreateForm} />

      {/* Stats Cards */}
      <EmployeeStats
        employees={employees || []}
        departmentStats={departmentStats}
        departments={departments}
        isLoading={isDepartmentStatsLoading || isDepartmentsLoading}
      />

      {/* Search and Filter */}
      <EmployeeFilters
        searchQuery={searchQuery}
        filterDepartment={filterDepartment}
        departmentStats={departmentStats}
        departments={departments}
        onSearchChange={setSearchQuery}
        onDepartmentFilterChange={setFilterDepartment}
        onClearSearch={handleClearSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Employees Table */}
      <EmployeeTable
        employees={paginatedEmployees}
        page={page}
        limit={limit}
        totalCount={totalCount}
        filteredEmployees={filteredEmployees}
        isFiltering={!!(searchQuery || filterDepartment !== "all")}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(0);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Create/Edit Employee Form */}
      <EmployeeForm
        open={open}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        formMode={formMode}
        editingEmployee={editingEmployee}
        departments={departments}
        isSubmitting={
          createEmployeeMutation.isPending || updateEmployeeMutation.isPending
        }
        error={createEmployeeMutation.error || updateEmployeeMutation.error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteEmployeeMutation.isPending}
      />
    </Box>
  );
};

export default Employees;
