import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "@/layouts/AppShell";
import DashboardPage from "@/dashboard/DashboardPage";
import CustomersList from "@/features/customers/list";
import LoginPage from "@/auth/LoginPage";
import ProtectedRoute from "@/auth/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />, // must render <Outlet /> when authed
    children: [
      {
        element: <AppShell />,   // layout must render <Outlet />
        children: [
          { index: true, element: <DashboardPage /> },    // "/" -> index route
          { path: "dashboard", element: <DashboardPage /> },
          { path: "customers", element: <CustomersList /> },
          { path: "test", element: <div>Test page</div> }, // now /test works
        ],
      },
    ],
  },
  { path: "*", element: <LoginPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
