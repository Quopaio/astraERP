// auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { auth } from "./authStore";

export default function ProtectedRoute() {
  const location = useLocation();
  const authed = useSyncExternalStore(auth.subscribe, auth.isAuthed, auth.isAuthed);
  return authed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
