import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../config/axiosClient";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "administrator" | "manager" | "employee" | "user";
  createdAt: string;
}

interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "administrator" | "manager" | "employee" | "user";
}

interface UpdateUserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: "administrator" | "manager" | "employee" | "user";
}

// API functions
const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get("/users");
  return response.data;
};

const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await axiosClient.post("/users", {
    ...userData,
    createdAt: new Date().toISOString(),
  });
  return response.data;
};

const updateUser = async (userData: UpdateUserData): Promise<User> => {
  const { id, ...updateData } = userData;
  const response = await axiosClient.patch(`/users/${id}`, updateData);
  return response.data;
};

const deleteUser = async (userId: number): Promise<void> => {
  await axiosClient.delete(`/users/${userId}`);
};

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
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
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
