import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  login as loginAPI,
  register as registerAPI,
  getInfoUser as getInfoUserAPI,
} from "@/api/authen";
import type { RegisterRequest, AuthResponse } from "../types";
import { showSnackbar } from "@/App"; // import hàm showSnackbar
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      // Sửa từ 'token' thành 'access_token' theo server response
      const { access_token } = data;
      const role = data.user.role;
      const userId = data.user.id;
      

      
      // Lưu với tên đúng
      Cookies.set("__role", role, { expires: 1 });
      Cookies.set("__token", access_token, { expires: 1 }); // Lưu access_token
      Cookies.set("__userId", userId.toString(), { expires: 1 }); // Lưu userId
      
      queryClient.setQueryData(authKeys.me(), data.user);
      showSnackbar(t("loginSuccess"), "success");
      
      if (role === "admin" || role === "manager") {
        navigate("/overview");
      } else if (role === "supervisor") {
        navigate("/staff/maintenance-tasks");
      } else if (role === "staff") {
        navigate("/staff/maintenance");
      }
      return data;
    },
    onError: (error: any) => {
      showSnackbar(
        error?.response?.data?.message
          ? t(error.response.data.message)
          : t("loginFailed"),
        "error"
      );
      // Trả ra lỗi
      return error;
    },
  });
};

// Register
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await registerAPI(userData);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      showSnackbar(t("registerSuccess"), "success");
      queryClient.setQueryData(authKeys.me(), data.user);
      setTimeout(() => navigate("/login"), 1000);
      return data;
    },
    onError: (error: any) => {
      showSnackbar(
        error?.response?.data?.message
          ? t(error.response.data.message)
          : t("registerFailed"),
        "error"
      );
      return error;
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      Cookies.remove("__token");
      Cookies.remove("__role");
      Cookies.remove("__userId");
      showSnackbar(t("logoutSuccess"), "success");
      queryClient.clear();
      navigate("/");
    },
  });
};

export default { useAuthStatus, useUserInfo, useLogin, useRegister, useLogout };
