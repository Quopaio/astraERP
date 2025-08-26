// AppRouter.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "@/layouts/AppShell";
import DashboardPage from "@/dashboard/DashboardPage";
import CustomersList from "@/features/customers/list";
import LoginPage from "@/auth/LoginPage";
import ProtectedRoute from "@/auth/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,   // returns <Outlet/> when authed
    children: [
      {
        path: "/",                 // base path for the layout
        element: <AppShell />,     // renders <Outlet/>
        children: [
          { index: true, element: <DashboardPage /> },   // "/"
          { path: "dashboard", element: <DashboardPage /> }, // "/dashboard"
          { path: "customers", element: <CustomersList /> }, // "/customers"
          { path: "test", element: <div>Test page</div> },   // "/test"
        ],
      },
    ],
  },
  { path: "*", element: <LoginPage /> }, // only hits if not matched above
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
