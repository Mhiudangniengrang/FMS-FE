import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  fetchEmployeesByDepartment,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/api/employees";
import { showSnackbar } from "@/App";
import type {
  CreateEmployeeData,
  UpdateEmployeeData,
} from "@/types/employeeType";
import { useTranslation } from "react-i18next";

export const useEmployees = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch all employees with pagination and filters
  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employees", page, limit, selectedDepartment],
    queryFn: async () => {
      const response = await fetchEmployees({
        page: page + 1,
        limit,
        department: selectedDepartment || undefined,
      });

      if (response.headers && response.headers["x-total-count"]) {
        setTotalCount(Number(response.headers["x-total-count"]));
      }

      return response.data;
    },
    staleTime: 0,
  });

  // Fetch employees by department name
  const useEmployeesByDepartment = (department: string) => {
    return useQuery({
      queryKey: ["employeesByDepartment", department],
      queryFn: async () => {
        const response = await fetchEmployeesByDepartment(department);
        return response.data;
      },
      enabled: !!department,
    });
  };

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: CreateEmployeeData) => {
      const response = await createEmployee(employeeData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["departmentStats"] });
      showSnackbar && showSnackbar(t("employeeCreateSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorCreatingEmployee"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorCreatingEmployee"),
          "error"
        );
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, ...employeeData }: UpdateEmployeeData) => {
      const response = await updateEmployee(id, employeeData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["departmentStats"] });
      showSnackbar && showSnackbar(t("employeeUpdateSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorUpdatingEmployee"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorUpdatingEmployee"),
          "error"
        );
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteEmployee(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["departmentStats"] });
      showSnackbar && showSnackbar(t("employeeDeleteSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorDeletingEmployee"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorDeletingEmployee"),
          "error"
        );
    },
  });

  return {
    // Data
    employees,

    // Loading states
    isLoading,

    // Error
    error,

    // Mutations
    createEmployeeMutation,
    updateEmployeeMutation,
    deleteEmployeeMutation,

    // Refetch functions
    refetch,

    // Pagination and filters
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
    selectedDepartment,
    setSelectedDepartment,

    // Helper hooks
    useEmployeesByDepartment,
  };
};
