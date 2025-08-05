import axiosClient from "@/config/axiosClient";
import type { UserLogFilters } from "@/types/userLogs.types";

// API functions
const fetchUserLogs = (filters: UserLogFilters = {}) => {
  return axiosClient.get("/user-logs", { params: filters });
};

export { fetchUserLogs };
