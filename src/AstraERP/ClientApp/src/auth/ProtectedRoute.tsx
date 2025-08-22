import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./authStore";

export default function ProtectedRoute() {
  return auth.isAuthed() ? <Outlet /> : <Navigate to="/login" replace />;
}
