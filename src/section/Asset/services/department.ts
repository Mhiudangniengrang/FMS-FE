import axiosClient from "../../../config/axiosClient"
import type { Department } from "../types"

export const departmentApi = {
  getDepartments: () => {
    return axiosClient.get<Department[]>("/department")
  },
  getDepartmentById: (id: number) => {
    return axiosClient.get<Department>(`/department/${id}`)
  },
  createDepartment: (departmentData: Omit<Department, 'id'>) => {
    return axiosClient.post<Department>("/department", departmentData)
  },
  updateDepartment: (id: number, departmentData: Partial<Department>) => {
    return axiosClient.patch<Department>(`/department/${id}`, departmentData)
  },
  deleteDepartment: (id: number) => {
    return axiosClient.delete(`/department/${id}`)
  },
} 