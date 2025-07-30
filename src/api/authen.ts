import axiosClient from "@/config/axiosClient";
import type { RegisterRequest, AuthResponse, User } from "@/types";

// API functions
const login = (email: string, password: string) => {
  return axiosClient.post<AuthResponse>("/auth/login", { email, password });
};

const register = (userData: RegisterRequest) => {
  return axiosClient.post<AuthResponse>("/auth/register", userData);
};

const getInfoUser = () => {
  return axiosClient.get<{ user: User }>("/auth/me");
};

export { login, register, getInfoUser };
