import {
  Computer as ComputerIcon,
  Print as PrintIcon,
  DirectionsCar as CarIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Desk as DeskIcon,
  Kitchen as ApplianceIcon,
  Videocam as ProjectorIcon,
} from "@mui/icons-material"
import type React from "react"

export const getCategoryIcon = (category: string): React.ReactElement => {
  const iconMap: { [key: string]: React.ReactElement } = {
    computer: <ComputerIcon />,
    printer: <PrintIcon />,
    car: <CarIcon />,
    smartphone: <SmartphoneIcon />,
    monitor: <MonitorIcon />,
    desk: <DeskIcon />,
    appliance: <ApplianceIcon />,
    projector: <ProjectorIcon />,
  }
  
  return iconMap[category] || <ComputerIcon />
}

export const statusColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
  "Sẵn sàng": "info",
  "Đang sử dụng": "success",
  "Bảo trì": "warning",
  Hỏng: "error",
  "Ngừng sử dụng": "default",
}

export const conditionColors: {
  [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
} = {
  Mới: "success",
  Tốt: "info",
  "Khá tốt": "warning",
  "Cần sửa chữa": "error",
  "Hỏng nặng": "error",
}

export const viewModes = {
  TABLE: "table" as const,
  GRID: "grid" as const,
}

export const sortOrders = {
  ASC: "asc" as const,
  DESC: "desc" as const,
}

export const defaultPagination = {
  page: 0,
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 25, 50],
}

export const gridPagination = {
  rowsPerPageOptions: [8, 16, 24, 32],
} 