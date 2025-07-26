import type { MenuItemType } from "../types";

export const createMenuItem = (
  label: string,
  key: string,
  icon: React.ReactElement,
  path: string
): MenuItemType => {
  return {
    key,
    icon,
    label,
    path,
  };
};
