import DashboardLayout from "../layout/DashboardLayout";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import { Error404, Loading } from "../components";
import type { JSX } from "@emotion/react/jsx-runtime";
import AuthenPage from "../page/AuthenPage";
import { useAuthStatus } from "../hooks/useAuth";

export const OverViewPage = lazy(() => import("../page/OverViewPage"));
export const UserManage = lazy(() => import("../page/UserPage"));

interface ProtectedRouteProps {
  children: ReactNode;
}

// Component bảo vệ route, chỉ cho phép truy cập khi đã đăng nhập
const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated } = useAuthStatus();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const Router = (): JSX.Element | null => {
  const routes = useRoutes([
    {
      path: "/",
      element: <AuthenPage />,
    },
    {
      path: "/register",
      element: <AuthenPage />,
    },
    {
      element: (
        <ProtectedRoute>
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
        { element: <Error404 />, path: "*" },
      ],
    },
  ]);

  return routes;
};
