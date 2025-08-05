import axiosClient from "@/config/axiosClient";
import type { CreateAssetData, UpdateAssetData } from "@/types/asset.types";

// API functions
const fetchAssets = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}) => {
  return axiosClient.get("/assets", {
    params: {
      _page: params?.page,
      _limit: params?.limit,
      category: params?.category || undefined,
      status: params?.status || undefined,
    },
  });
};

const getAssetById = (id: number) => {
  return axiosClient.get(`/assets/${id}`);
};

const createAsset = (assetData: CreateAssetData) => {
  return axiosClient.post("/assets", {
    ...assetData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

const updateAsset = (id: number, assetData: Omit<UpdateAssetData, "id">) => {
  return axiosClient.put(`/assets/${id}`, {
    ...assetData,
    updatedAt: new Date().toISOString(),
  });
};

const deleteAsset = (id: number) => {
  return axiosClient.delete(`/assets/${id}`);
};

export { fetchAssets, getAssetById, createAsset, updateAsset, deleteAsset };
