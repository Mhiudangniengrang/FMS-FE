import axiosClient from "../../../config/axiosClient"
import type { Category } from "../types"

export const categoryApi = {
  getCategories: () => {
    return axiosClient.get<Category[]>("/categories")
  },
  getCategoryById: (id: number) => {
    return axiosClient.get<Category>(`/categories/${id}`)
  },
  createCategory: (categoryData: Omit<Category, 'id'>) => {
    return axiosClient.post<Category>("/categories", categoryData)
  },
  updateCategory: (id: number, categoryData: Partial<Category>) => {
    return axiosClient.patch<Category>(`/categories/${id}`, categoryData)
  },
  deleteCategory: (id: number) => {
    return axiosClient.delete(`/categories/${id}`)
  },
} 