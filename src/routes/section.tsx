import DashboardLayout from "../layout/DashboardLayout";
import React, { type JSX } from "react";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Error404, Loading } from "@/components";
import AuthenPage from "@/page/AuthenPage";
import Cookies from "js-cookie";

export const OverViewPage = lazy(() => import("@/page/OverViewPage"));
export const UserManage = lazy(() => import("@/page/UserPage"));
export const AssetPage = lazy(() => import("@/page/AssetPage"));
export const MaintenancePage = lazy(() => import("../page/MaintenancePage"));
export const MaintenanceManagementPage = lazy(
  () => import("../page/MaintenanceManagementPage")
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
  userRole?: string;
}

// Component bảo vệ route, chỉ cho phép truy cập khi đã đăng nhập
const ProtectedRoute = ({
  children,
  allowedRole,
  userRole,
}: ProtectedRouteProps): React.JSX.Element => {
  if (userRole?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const Router = (): React.JSX.Element | null => {
  // Lấy role từ cookies
  const userRole = Cookies.get("__role") || "guest";

  const routes = useRoutes([
    {
      path: "/",
      element: <AuthenPage />,
    },
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        // Admin routes
        {
          element: (
            <ProtectedRoute allowedRole="admin" userRole={userRole}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            { element: <OverViewPage />, path: "/overview" },
            { element: <UserManage />, path: "/user/view" },
            { element: <AssetPage />, path: "/asset/view" },
            {
              element: <MaintenanceManagementPage />,
              path: "/maintenance/management",
            },
            { element: <Error404 />, path: "*" },
          ],
        },
        // Staff routes
        {
          element: (
            <ProtectedRoute allowedRole="staff" userRole={userRole}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            { element: <MaintenancePage />, path: "/staff/maintenance" },
            { element: <Error404 />, path: "*" },
          ],
        },
      ],
    },
  ]);

  return routes;
};
