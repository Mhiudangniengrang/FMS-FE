import axiosClient from "../../../config/axiosClient"
import type { ConditionOption } from "../types"

export const conditionOptionApi = {
  getConditionOptions: () => {
    return axiosClient.get<ConditionOption[]>("/conditionOptions")
  },
  getConditionOptionById: (value: string) => {
    return axiosClient.get<ConditionOption>(`/conditionOptions/${value}`)
  },
  createConditionOption: (conditionOptionData: Omit<ConditionOption, 'value'>) => {
    return axiosClient.post<ConditionOption>("/conditionOptions", conditionOptionData)
  },
  updateConditionOption: (value: string, conditionOptionData: Partial<ConditionOption>) => {
    return axiosClient.patch<ConditionOption>(`/conditionOptions/${value}`, conditionOptionData)
  },
  deleteConditionOption: (value: string) => {
    return axiosClient.delete(`/conditionOptions/${value}`)
  },
} 