export interface MenuItemType {
  key: string;
  icon: React.ReactElement;
  label: string;
  path: string;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
