import {
  Computer as ComputerIcon,
  Print as PrintIcon,
  DirectionsCar as CarIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Desk as DeskIcon,
  Kitchen as ApplianceIcon,
  Videocam as ProjectorIcon,
} from "@mui/icons-material";
import type React from "react";
import { useTranslation } from "react-i18next";

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
  };

  return iconMap[category] || <ComputerIcon />;
};

// Hook để translate status
export const useStatusTranslation = () => {
  const { t } = useTranslation();

  const getStatusText = (status: string): string => {
    return t(`status.${status}`);
  };

  return { getStatusText };
};

// Hook để translate condition
export const useConditionTranslation = () => {
  const { t } = useTranslation();

  const getConditionText = (condition: string): string => {
    return t(`condition.${condition}`);
  };

  return { getConditionText };
};

export const statusColors: {
  [key: string]:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
} = {
  available: "info",
  in_use: "success",
  maintenance: "warning",
  broken: "error",
  decommissioned: "default",
};

export const conditionColors: {
  [key: string]:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
} = {
  new: "success",
  good: "info",
  fair: "warning",
  poor: "error",
  damaged: "error",
};

export const viewModes = {
  TABLE: "table" as const,
  GRID: "grid" as const,
};

export const sortOrders = {
  ASC: "asc" as const,
  DESC: "desc" as const,
};

export const defaultPagination = {
  page: 0,
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 25, 50],
};

export const gridPagination = {
  rowsPerPageOptions: [8, 16, 24, 32],
};
