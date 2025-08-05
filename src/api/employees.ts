import axiosClient from "@/config/axiosClient";
import type {
  CreateEmployeeData,
  UpdateEmployeeData,
} from "@/types/employeeType";

const fetchEmployees = (params?: {
  page?: number;
  limit?: number;
  department?: string;
}) => {
  return axiosClient.get("/employees", {
    params: {
      _page: params?.page,
      _limit: params?.limit,
      department: params?.department,
    },
  });
};

// Fetch employees by department name
const fetchEmployeesByDepartment = (departmentName: string) => {
  return axiosClient.get("/employees", {
    params: {
      department: departmentName,
    },
  });
};

const createEmployee = (employeeData: CreateEmployeeData) => {
  return axiosClient.post("/employees", employeeData);
};

const updateEmployee = (
  id: string,
  employeeData: Omit<UpdateEmployeeData, "id">
) => {
  return axiosClient.put(`/employees/${id}`, employeeData);
};

const deleteEmployee = (id: string) => {
  return axiosClient.delete(`/employees/${id}`);
};

export {
  fetchEmployees,
  fetchEmployeesByDepartment,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
