import DashboardLayout from "../layout/DashboardLayout";
import React from "react";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Error404, Loading } from "@/components";
import AuthenPage from "@/page/AuthenPage";
import Cookies from "js-cookie";

export const OverViewPage = lazy(() => import("@/page/OverViewPage"));
export const UserManage = lazy(() => import("@/page/UserPage"));
export const AssetPage = lazy(() => import("@/page/AssetPage"));

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
}: ProtectedRouteProps): JSX.Element => {
  if (userRole?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const Router = (): JSX.Element | null => {
  // Lấy role từ cookies
  // const userRole = Cookies.get("__role") || "guest";

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
        // {
        //   element: (
        //     <ProtectedRoute allowedRole="admin" userRole={userRole}>
        //       <Outlet />
        //     </ProtectedRoute>
        //   ),

        // },

        { element: <OverViewPage />, path: "/overview" },
        { element: <UserManage />, path: "/user/view" },
        { element: <AssetPage />, path: "/asset/view" },
      ],
    },
  ]);

  return routes;
};
