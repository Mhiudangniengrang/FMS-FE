import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/api/user";
import { showSnackbar } from "@/App"; // Thêm showSnackbar nếu có
import type { CreateUserData, UpdateUserData } from "@/types/user.types";
import { useTranslation } from "react-i18next";

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch all users
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchUsers();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  };
};
