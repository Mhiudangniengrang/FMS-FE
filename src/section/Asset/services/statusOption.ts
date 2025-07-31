import axiosClient from "../../../config/axiosClient"
import type { StatusOption } from "../types"

export const statusOptionApi = {
  getStatusOptions: () => {
    return axiosClient.get<StatusOption[]>("/statusOptions")
  },
  getStatusOptionById: (value: string) => {
    return axiosClient.get<StatusOption>(`/statusOptions/${value}`)
  },
  createStatusOption: (statusOptionData: Omit<StatusOption, 'value'>) => {
    return axiosClient.post<StatusOption>("/statusOptions", statusOptionData)
  },
  updateStatusOption: (value: string, statusOptionData: Partial<StatusOption>) => {
    return axiosClient.patch<StatusOption>(`/statusOptions/${value}`, statusOptionData)
  },
  deleteStatusOption: (value: string) => {
    return axiosClient.delete(`/statusOptions/${value}`)
  },
} 