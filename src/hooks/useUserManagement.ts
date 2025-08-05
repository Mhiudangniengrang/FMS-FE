import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/api/user";
import { showSnackbar } from "@/App";
import type { CreateUserData, UpdateUserData } from "@/types/user.types";
import { useTranslation } from "react-i18next";

export const useUserManagement = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      const response = await fetchUsers({
        page: page + 1, // json-server bắt đầu từ page 1
        limit,
      });

      // json-server trả về x-total-count trong header
      if (response.headers && response.headers["x-total-count"]) {
        setTotalCount(Number(response.headers["x-total-count"]));
      }

      return response.data;
    },
    staleTime: 0,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await createUser(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar && showSnackbar(t("userCreateSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorCreatingAccount"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorCreatingAccount"),
          "error"
        );
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: UpdateUserData) => {
      const response = await updateUser(id, userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar && showSnackbar(t("userUpdateSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorUpdatingAccount"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorUpdatingAccount"),
          "error"
        );
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteUser(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar && showSnackbar(t("userDeleteSuccess"), "success");
    },
    onError: (error: any) => {
      console.error(t("errorDeletingAccount"), error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || t("errorDeletingAccount"),
          "error"
        );
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
  };
};
