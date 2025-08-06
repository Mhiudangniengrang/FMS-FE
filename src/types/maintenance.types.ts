export interface Asset {
  id: number;
  name: string;
  code: string;
  category: string;
  location: string;
  status: "available" | "in_use" | "maintenance" | "broken";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: number;
  assetId: number;
  assetName: string;
  assetCode: string;
  requestedBy: number; // User ID
  requestedByName: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "in_progress" | "completed" | "cancelled" | "draft";
  assignedTo?: number; // Technician User ID
  assignedToName?: string;
  expectedCompletionTime?: string; // Thời gian mong muốn hoàn thành
  isDraft: boolean; // Đánh dấu là bản nháp
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface CreateMaintenanceRequest {
  assetId: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  expectedCompletionTime?: string; // Thời gian mong muốn hoàn thành
  isDraft?: boolean; // Đánh dấu là bản nháp (mặc định false)
  requestedBy?: number; // User ID của người gửi yêu cầu
  status?: "pending" | "approved" | "in_progress" | "completed" | "cancelled"; // Status khi chuyển từ draft
}

export interface UpdateMaintenanceRequest {
  id: number;
  status?: "pending" | "approved" | "in_progress" | "completed" | "cancelled";
  assignedTo?: number | null; // Cho phép null để hủy phân công
  notes?: string;
}

export interface MaintenanceFormData {
  assetId: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  expectedCompletionTime?: string; // Thời gian mong muốn hoàn thành
}

export interface MaintenanceFilter {
  status?: string;
  priority?: string;
  assignedTo?: number;
  dateFrom?: string;
  dateTo?: string;
} 