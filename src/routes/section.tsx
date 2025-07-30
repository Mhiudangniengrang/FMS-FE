import DashboardLayout from "../layout/DashboardLayout";
import React from "react";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Error404, Loading } from "../components";
import AuthenPage from "../page/AuthenPage";

import UserLayout from "../layout/UserLayout";
import Cookies from "js-cookie";

export const OverViewPage = lazy(() => import("../page/OverViewPage"));
export const UserManage = lazy(() => import("../page/UserPage"));
export const AssetPage = lazy(() => import("../page/AssetPage"));
export const MaintenancePage = lazy(() => import("../page/MaintenancePage"));
// *** THÊM MỚI: Route cho Admin xem danh sách yêu cầu bảo trì ***
export const MaintenanceManagementPage = lazy(() => import("../page/MaintenanceManagementPage"));

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

  console.log("User Role:", userRole);

  const routes = useRoutes([
    {
      path: "/",
      element: <AuthenPage />,
    },
    {
      path: "/register",
      element: <AuthenPage />,
    },
    // Route cho admin
    {
      element: (
        <ProtectedRoute allowedRole="admin" userRole={userRole}>
          <DashboardLayout>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          element: <OverViewPage />,
          path: "/overview",
        },
        {
          element: <UserManage />,
          path: "/user/view",
        },
        // *** THÊM MỚI: Route cho Admin quản lý bảo trì ***
        {
          element: <MaintenanceManagementPage />,
          path: "/maintenance/management",
        },
        { element: <Error404 />, path: "*" },
      ],
    },
    // Route cho staff
    {
      element: (
        <ProtectedRoute allowedRole="staff" userRole={userRole}>
          <UserLayout>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </UserLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          element: <MaintenancePage />,
          path: "/staff/maintenance",
        },
        { element: <Error404 />, path: "*" },
      ],
    },
    // Route cho user
    {
      element: (
        <ProtectedRoute allowedRole="user" userRole={userRole}>
          <UserLayout>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </UserLayout>
        </ProtectedRoute>
      ),
      children: [
        
        {
          element: <AssetPage />,
          path: "/user/assets",
        },
        { element: <Error404 />, path: "*" },
      ],
    },
  ]);

  return routes;
};
