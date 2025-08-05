import axiosClient from "@/config/axiosClient";

// Get departments list
const fetchDepartments = () => {
  return axiosClient.get("/departments");
};

// Fetch employees by department ID
const fetchEmployeesByDepartmentId = (departmentId: number) => {
  return axiosClient.get(`/departments/${departmentId}?_embed=employees`);
};

// Get department statistics
const getDepartmentStats = () => {
  return axiosClient.get("/employees").then((response) => {
    const employees = response.data;
    const stats = employees.reduce((acc: any, emp: any) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { count: 0, employees: [] };
      }
      acc[emp.department].count++;
      acc[emp.department].employees.push(emp);
      return acc;
    }, {});
    return { data: stats, headers: response.headers };
  });
};

export { fetchDepartments, fetchEmployeesByDepartmentId, getDepartmentStats };
