import axiosClient from "../../../config/axiosClient"
import type { Location } from "../types"

export const locationApi = {
  getLocations: () => {
    return axiosClient.get<Location[]>("/locations")
  },
  getLocationById: (id: number) => {
    return axiosClient.get<Location>(`/locations/${id}`)
  },
  createLocation: (locationData: Omit<Location, 'id'>) => {
    return axiosClient.post<Location>("/locations", locationData)
  },
  updateLocation: (id: number, locationData: Partial<Location>) => {
    return axiosClient.patch<Location>(`/locations/${id}`, locationData)
  },
  deleteLocation: (id: number) => {
    return axiosClient.delete(`/locations/${id}`)
  },
} 