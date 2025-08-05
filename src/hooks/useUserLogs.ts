import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserLogs } from "@/api/userLogs";
import type { UserLogFilters } from "@/types/userLogs.types";
import { useTranslation } from "react-i18next";

export const useUserLogs = (initialFilters: UserLogFilters = {}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<UserLogFilters>(initialFilters);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userLogs", filters],
    queryFn: () => fetchUserLogs(filters),
    select: (response) => response.data,
  });

  const updateFilters = (newFilters: Partial<UserLogFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  };

  const formatAction = (action: string): string => {
    switch (action) {
      case "login":
        return t("logActionLogin");
      case "logout":
        return t("logActionLogout");
      case "create":
        return t("logActionCreate");
      case "update":
        return t("logActionUpdate");
      case "delete":
        return t("logActionDelete");
      case "view":
        return t("logActionView");
      default:
        return action;
    }
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
    formatAction,
    formatTimestamp,
  };
};
