import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} from "@/api/asset";
import { showSnackbar } from "@/App";
import type { CreateAssetData, UpdateAssetData } from "@/types/assetType";
import { useTranslation } from "react-i18next";

export const useAssetManagement = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{
    category?: string;
    status?: string;
  }>({});

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    data: assets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assets", page, limit, filters],
    queryFn: async () => {
      const response = await fetchAssets({
        page: page + 1, // json-server starts from page 1
        limit,
        ...filters,
      });

      // Get total count from header
      if (response.headers && response.headers["x-total-count"]) {
        setTotalCount(Number(response.headers["x-total-count"]));
      }

      return response.data;
    },
    staleTime: 0,
  });

  // Get asset by ID
  const getAsset = (id: number) => {
    return useQuery({
      queryKey: ["asset", id],
      queryFn: async () => {
        const response = await getAssetById(id);
        return response.data;
      },
    });
  };

  // Create asset mutation
  const createAssetMutation = useMutation({
    mutationFn: async (assetData: CreateAssetData) => {
      const response = await createAsset(assetData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      showSnackbar && showSnackbar(t("assetCreateSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorCreatingAsset"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorCreatingAsset"),
          "error"
        );
    },
  });

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: async ({ id, ...assetData }: UpdateAssetData) => {
      const response = await updateAsset(id, assetData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      showSnackbar && showSnackbar(t("assetUpdateSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorUpdatingAsset"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorUpdatingAsset"),
          "error"
        );
    },
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteAsset(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      showSnackbar && showSnackbar(t("assetDeleteSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorDeletingAsset"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorDeletingAsset"),
          "error"
        );
    },
  });

  return {
    assets,
    isLoading,
    error,
    refetch,
    getAsset,
    createAssetMutation,
    updateAssetMutation,
    deleteAssetMutation,
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
    filters,
    setFilters,
  };
};
