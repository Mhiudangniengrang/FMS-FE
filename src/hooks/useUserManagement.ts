import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/user";
import { showSnackbar } from "../App"; // Thêm showSnackbar nếu có
import type { CreateUserData, UpdateUserData } from "../types/user.types";

export const useUserManagement = () => {
  const queryClient = useQueryClient();

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
      showSnackbar && showSnackbar("User created successfully", "success");
    },
    onError: (error: any) => {
      console.error("Error creating user:", error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || "Error creating user",
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
      showSnackbar && showSnackbar("User updated successfully", "success");
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || "Error updating user",
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
      showSnackbar && showSnackbar("User deleted successfully", "success");
    },
    onError: (error: any) => {
      console.error("Error deleting user:", error);
      showSnackbar &&
        showSnackbar(
          error?.response?.data?.message || "Error deleting user",
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
