import axiosClient from "../config/axiosClient";
import type { 
  MaintenanceRequest, 
  CreateMaintenanceRequest, 
  UpdateMaintenanceRequest,
  Asset,
  MaintenanceFilter
} from "../types";

// Asset API functions
export const getAssets = () => {
  return axiosClient.get<Asset[]>("/assets");
};

export const getAssetById = (id: number) => {
  return axiosClient.get<Asset>(`/assets/${id}`);
};

// Maintenance Request API functions
export const getMaintenanceRequests = (filters?: MaintenanceFilter) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo.toString());
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  
  const queryString = params.toString();
  return axiosClient.get<MaintenanceRequest[]>(`/maintenance${queryString ? `?${queryString}` : ''}`);
};

export const getMaintenanceRequestById = (id: number) => {
  return axiosClient.get<MaintenanceRequest>(`/maintenance/${id}`);
};

export const createMaintenanceRequest = (data: CreateMaintenanceRequest) => {
  return axiosClient.post<MaintenanceRequest>("/maintenance", data);
};

export const updateMaintenanceRequest = (data: UpdateMaintenanceRequest) => {
  return axiosClient.put<MaintenanceRequest>(`/maintenance/${data.id}`, data);
};

export const deleteMaintenanceRequest = (id: number) => {
  return axiosClient.delete(`/maintenance/${id}`);
};

// Get maintenance requests by user (for staff to see their own requests)
export const getMyMaintenanceRequests = () => {
  // Use regular endpoint and filter by user on frontend for now
  // In real app, backend should handle this filtering with authentication
  return axiosClient.get<MaintenanceRequest[]>("/maintenance");
};

// Get draft maintenance requests by user
export const getMyDraftRequests = () => {
  return axiosClient.get<MaintenanceRequest[]>("/maintenance/my-drafts");
};

// Save maintenance request as draft
export const saveDraftMaintenanceRequest = (data: CreateMaintenanceRequest) => {
  return axiosClient.post<MaintenanceRequest>("/maintenance/draft", data);
};

// Update draft maintenance request
export const updateDraftMaintenanceRequest = (id: number, data: Partial<CreateMaintenanceRequest>) => {
  console.log("API: Sending PUT request to /maintenance/draft/" + id, data);
  return axiosClient.put<MaintenanceRequest>(`/maintenance/draft/${id}`, data);
};

// Get technicians (users with role staff/supervisor/manager for assignment)
export const getTechnicians = () => {
  return axiosClient.get<{ id: number; name: string; role: string }[]>("/users/technicians");
}; 