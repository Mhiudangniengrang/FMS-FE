import axiosClient from "@/config/axiosClient";
import type { CreateUserData, UpdateUserData } from "@/types/user.types";

// API functions
const fetchUsers = (params?: { page?: number; limit?: number }) => {
  return axiosClient.get("/users", {
    params: {
      _page: params?.page,
      _limit: params?.limit,
    },
  });
};

const createUser = (userData: CreateUserData) => {
  return axiosClient.post("/users", userData);
};

const updateUser = (id: number, userData: Omit<UpdateUserData, "id">) => {
  return axiosClient.put(`/users/${id}`, userData);
};

const deleteUser = (id: number) => {
  return axiosClient.delete(`/users/${id}`);
};

export { fetchUsers, createUser, updateUser, deleteUser };
