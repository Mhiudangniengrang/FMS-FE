export type UserLogFilters = {
  userId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
};

export type UserLog = {
  id: number;
  userId: number;
  username: string;
  action: string;
  details: string;
  targetId: number | null;
  role: string | null;
  timestamp: string;
};

export type UserLogsResponse = {
  logs: UserLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
