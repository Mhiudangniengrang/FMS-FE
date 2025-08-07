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
  "available": "success",
  "in_use": "primary",
  "maintenance": "warning",
  "broken": "error",
  "decommissioned": "default",
}

export const conditionColors: {
  [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
} = {
  "new": "success",
  "good": "primary",
  "fair": "warning",
  "poor": "warning",
  "damaged": "error",
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