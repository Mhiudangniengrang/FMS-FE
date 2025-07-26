import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  login as loginAPI,
  register as registerAPI,
  getInfoUser as getInfoUserAPI,
} from "../api/authen";
import type { RegisterRequest, AuthResponse } from "../types";

// Query Keys
const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};


// Check có token không (tức thì)
export const useAuthStatus = () => {
  return {
    isAuthenticated: !!Cookies.get("__token"),
  };
};

// Lấy thông tin user
export const useUserInfo = () => {
  const { isAuthenticated } = useAuthStatus();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await getInfoUserAPI();
      return response.data.user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

// Login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await loginAPI(email, password);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      Cookies.set("__token", data.access_token, { expires: 1 });
      queryClient.setQueryData(authKeys.me(), data.user);
      navigate("/overview");
    },
  });
};

// Register
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await registerAPI(userData);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      Cookies.set("__token", data.access_token, { expires: 1 });
      queryClient.setQueryData(authKeys.me(), data.user);
      setTimeout(() => navigate("/overview"), 1000);
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      Cookies.remove("__token");
      queryClient.clear();
      navigate("/");
    },
  });
};

export default { useAuthStatus, useUserInfo, useLogin, useRegister, useLogout };
