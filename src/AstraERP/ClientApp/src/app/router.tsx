import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/auth/LoginPage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import AppShell from "@/layouts/AppShell";
import DashboardPage from "@/dashboard/DashboardPage";
import CustomersList from "@/features/customers/list";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,     // gate below routes
    children: [
      {
        element: <AppShell />,       // shared layout (sidebar + topbar)
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/customers", element: <CustomersList /> }
        ]
      }
    ]
  },
  { path: "*", element: <LoginPage /> }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
