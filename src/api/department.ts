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

// Thêm nhân viên vào department
const addEmployeeToDepartment = async (
  departmentName: string,
  employee: any
) => {
  try {
    // Lấy danh sách departments
    const departmentsResponse = await fetchDepartments();
    const departments = departmentsResponse.data;

    // Tìm department theo tên
    const department = departments.find(
      (dept: any) => dept.name === departmentName
    );

    if (department) {
      // Kiểm tra nhân viên đã tồn tại chưa
      const existingEmployee = department.employees?.find(
        (emp: any) => emp.id === employee.id
      );

      if (!existingEmployee) {
        // Thêm nhân viên mới
        const updatedEmployees = [
          ...(department.employees || []),
          { id: employee.id, name: employee.name },
        ];

        return axiosClient.put(`/departments/${department.id}`, {
          ...department,
          employees: updatedEmployees,
        });
      }
    }
  } catch (error) {
    console.error("Error adding employee to department:", error);
  }
};

// Xóa nhân viên khỏi department
const removeEmployeeFromDepartment = async (
  departmentName: string,
  employeeId: string
) => {
  try {
    const departmentsResponse = await fetchDepartments();
    const departments = departmentsResponse.data;

    const department = departments.find(
      (dept: any) => dept.name === departmentName
    );

    if (department) {
      const updatedEmployees =
        department.employees?.filter((emp: any) => emp.id !== employeeId) || [];

      return axiosClient.put(`/departments/${department.id}`, {
        ...department,
        employees: updatedEmployees,
      });
    }
  } catch (error) {
    console.error("Error removing employee from department:", error);
  }
};

// Cập nhật thông tin nhân viên trong department
const updateEmployeeInDepartment = async (
  departmentName: string,
  employee: any
) => {
  try {
    const departmentsResponse = await fetchDepartments();
    const departments = departmentsResponse.data;

    const department = departments.find(
      (dept: any) => dept.name === departmentName
    );

    if (department) {
      const updatedEmployees =
        department.employees?.map((emp: any) =>
          emp.id === employee.id
            ? { id: employee.id, name: employee.name }
            : emp
        ) || [];

      return axiosClient.put(`/departments/${department.id}`, {
        ...department,
        employees: updatedEmployees,
      });
    }
  } catch (error) {
    console.error("Error updating employee in department:", error);
  }
};

export {
  fetchDepartments,
  fetchEmployeesByDepartmentId,
  getDepartmentStats,
  addEmployeeToDepartment,
  removeEmployeeFromDepartment,
  updateEmployeeInDepartment,
};
