import axiosClient from "../../../config/axiosClient"
import type { Employee } from "../types"

export const employeeApi = {
  getEmployees: () => {
    return axiosClient.get<Employee[]>("/employees")
  },
  getEmployeeById: (id: string) => {
    return axiosClient.get<Employee>(`/employees/${id}`)
  },
  createEmployee: (employeeData: Omit<Employee, 'id'>) => {
    return axiosClient.post<Employee>("/employees", employeeData)
  },
  updateEmployee: (id: string, employeeData: Partial<Employee>) => {
    return axiosClient.patch<Employee>(`/employees/${id}`, employeeData)
  },
  deleteEmployee: (id: string) => {
    return axiosClient.delete(`/employees/${id}`)
  },
} 