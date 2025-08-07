import axiosClient from "../../../config/axiosClient"
import type { Department } from "../types"

export const departmentApi = {
  getDepartments: () => {
    return axiosClient.get<Department[]>("/departments")
  },
  getDepartmentById: (id: number) => {
    return axiosClient.get<Department>(`/departments/${id}`)
  },
  createDepartment: (departmentData: Omit<Department, 'id'>) => {
    return axiosClient.post<Department>("/departments", departmentData)
  },
  updateDepartment: (id: number, departmentData: Partial<Department>) => {
    return axiosClient.patch<Department>(`/departments/${id}`, departmentData)
  },
  deleteDepartment: (id: number) => {
    return axiosClient.delete(`/departments/${id}`)
  },
} 