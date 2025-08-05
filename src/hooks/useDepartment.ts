import { useQuery} from "@tanstack/react-query";
import {
  fetchDepartments,
  fetchEmployeesByDepartmentId,
  getDepartmentStats,
} from "@/api/department";

export const useDepartments = () => {

  // Get departments list
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await fetchDepartments();
      return response.data;
    },
  });

  // Get department statistics
  const {
    data: departmentStats,
    isLoading: isDepartmentStatsLoading,
    refetch: refetchDepartmentStats,
  } = useQuery({
    queryKey: ["departmentStats"],
    queryFn: async () => {
      const response = await getDepartmentStats();
      return response.data;
    },
  });

  // Fetch employees by specific department ID
  const useEmployeesByDepartmentId = (departmentId: number) => {
    return useQuery({
      queryKey: ["employeesByDepartmentId", departmentId],
      queryFn: async () => {
        const response = await fetchEmployeesByDepartmentId(departmentId);
        return response.data;
      },
      enabled: !!departmentId,
    });
  };

  return {
    // Data
    departments,
    departmentStats,

    // Loading states
    isDepartmentsLoading,
    isDepartmentStatsLoading,

    // Refetch functions
    refetchDepartments,
    refetchDepartmentStats,

    // Helper hooks
    useEmployeesByDepartmentId,
  };
};
