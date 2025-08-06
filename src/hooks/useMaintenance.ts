import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { 
  getAssets,
  getAssetById,
  getMaintenanceRequests, 
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  getMyMaintenanceRequests,
  getMyDraftRequests,
  saveDraftMaintenanceRequest,
  updateDraftMaintenanceRequest,
  getTechnicians
} from "../api/maintenance";
import type { 
  CreateMaintenanceRequest, 
  UpdateMaintenanceRequest,
  MaintenanceFilter
} from "../types";
import { showSnackbar } from "../App";

// Query Keys
const maintenanceKeys = {
  all: ["maintenance"] as const,
  lists: () => [...maintenanceKeys.all, "list"] as const,
  list: (filters?: MaintenanceFilter) => [...maintenanceKeys.lists(), filters] as const,
  details: () => [...maintenanceKeys.all, "detail"] as const,
  detail: (id: number) => [...maintenanceKeys.details(), id] as const,
  myRequests: () => [...maintenanceKeys.all, "my-requests"] as const,
  myDrafts: () => [...maintenanceKeys.all, "my-drafts"] as const,
};

const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  details: () => [...assetKeys.all, "detail"] as const,
  detail: (id: number) => [...assetKeys.details(), id] as const,
};

const userKeys = {
  technicians: () => ["users", "technicians"] as const,
};

// Assets hooks
export const useAssets = () => {
  return useQuery({
    queryKey: assetKeys.lists(),
    queryFn: async () => {
      const response = await getAssets();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAsset = (id: number) => {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: async () => {
      const response = await getAssetById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Maintenance Requests hooks
export const useMaintenanceRequests = (filters?: MaintenanceFilter) => {
  return useQuery({
    queryKey: maintenanceKeys.list(filters),
    queryFn: async () => {
      const response = await getMaintenanceRequests(filters);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMaintenanceRequest = (id: number) => {
  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: async () => {
      const response = await getMaintenanceRequestById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useMyMaintenanceRequests = () => {
  return useQuery({
    queryKey: maintenanceKeys.myRequests(),
    queryFn: async () => {
      const response = await getMyMaintenanceRequests();
      // Get current user info from cookies/localStorage
      const userId = Cookies.get("__userId");
      console.log("Current userId from cookie:", userId);
      console.log("All maintenance requests:", response.data);
      // Filter requests by current user
      const myRequests = response.data.filter(request => {
        console.log(`Checking request ${request.id}: requestedBy=${request.requestedBy}, userId=${userId}`);
        return request.requestedBy === parseInt(userId || "0");
      });
      console.log("Filtered my requests:", myRequests);
      return myRequests;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Create Maintenance Request
export const useCreateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMaintenanceRequest) => {
      const response = await createMaintenanceRequest(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.all });
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
      showSnackbar("Yêu cầu bảo trì đã được gửi thành công!", "success");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        : "Không thể gửi yêu cầu bảo trì!";
      showSnackbar(errorMessage || "Không thể gửi yêu cầu bảo trì!", "error");
    },
  });
};

// Update Maintenance Request
export const useUpdateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMaintenanceRequest) => {
      const response = await updateMaintenanceRequest(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.all });
      showSnackbar("Cập nhật yêu cầu bảo trì thành công!", "success");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        : "Không thể cập nhật yêu cầu!";
      showSnackbar(errorMessage || "Không thể cập nhật yêu cầu!", "error");
    },
  });
};

// Delete Maintenance Request
export const useDeleteMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteMaintenanceRequest(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.all });
      showSnackbar("Xóa yêu cầu bảo trì thành công!", "success");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        : "Không thể xóa yêu cầu!";
      showSnackbar(errorMessage || "Không thể xóa yêu cầu!", "error");
    },
  });
};

// Get Technicians
export const useTechnicians = () => {
  return useQuery({
    queryKey: userKeys.technicians(),
    queryFn: async () => {
      const response = await getTechnicians();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Draft Maintenance Requests
export const useMyDraftRequests = () => {
  return useQuery({
    queryKey: maintenanceKeys.myDrafts(),
    queryFn: async () => {
      const response = await getMyDraftRequests();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Save Draft Maintenance Request
export const useSaveDraftMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMaintenanceRequest) => {
      const response = await saveDraftMaintenanceRequest(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.myDrafts() });
      showSnackbar("Bản nháp đã được lưu thành công!", "success");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        : "Không thể lưu bản nháp!";
      showSnackbar(errorMessage || "Không thể lưu bản nháp!", "error");
    },
  });
};

// Update Draft Maintenance Request
export const useUpdateDraftMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateMaintenanceRequest> }) => {
      console.log("Hook: Calling updateDraftMaintenanceRequest with:", { id, data });
      try {
        const response = await updateDraftMaintenanceRequest(id, data);
        console.log("Hook: Response received:", response.data);
        return response.data;
      } catch (error) {
        console.error("Hook: API call failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.myDrafts() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.myRequests() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.all });
      
      // Show different message based on whether it was submitted or saved as draft
      const message = data.isDraft ? "Cập nhật bản nháp thành công!" : "Gửi yêu cầu thành công!";
      showSnackbar(message, "success");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        : "Có lỗi xảy ra!";
      showSnackbar(errorMessage || "Có lỗi xảy ra!", "error");
    },
  });
}; 