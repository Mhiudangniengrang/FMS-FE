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
export const MaintenancePage = lazy(() => import("../page/MaintenancePage"));
export const MaintenanceManagementPage = lazy(
  () => import("../page/MaintenanceManagementPage")
);
export const DepartmentPage = lazy(() => import("@/page/DepartmentPage"));
export const InventoryPage = lazy(() => import("@/page/InventoryPage"));
export const TechnicianMaintenancePage = lazy(() => import("@/page/TechnicianMaintenancePage"));
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string | string[];
  userRole?: string;
}

const ProtectedRoute = ({
  children,
  allowedRole,
  userRole,
}: ProtectedRouteProps): React.JSX.Element => {
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === userRole?.toLowerCase()
  );

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const Router = (): React.JSX.Element | null => {
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
            <ProtectedRoute
              allowedRole={["admin", "manager"]}
              userRole={userRole}
            >
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
            { element: <DepartmentPage />, path: "/departments/view" },
            { element: <InventoryPage />, path: "/inventory/view" },
            { element: <Error404 />, path: "*" },
          ],
        },
        // Staff routes
        {
          element: (
            <ProtectedRoute allowedRole={["staff", "supervisor"]} userRole={userRole}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            { element: <MaintenancePage />, path: "/staff/maintenance" },
            { element: <TechnicianMaintenancePage />, path: "/staff/maintenance-tasks" },
            { element: <Error404 />, path: "*" },
          ],
        },
      ],
    },
  ]);

  return routes;
};
