import axiosClient from "@/config/axiosClient";
import type { CreateUserData, UpdateUserData } from "@/types/user.types";

// API functions
const fetchUsers = () => {
  return axiosClient.get("/users");
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
