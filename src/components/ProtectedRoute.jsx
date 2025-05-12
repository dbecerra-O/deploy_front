import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export default function ProtectedRoute({ allowedRoles }) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = user.roles.some(role => allowedRoles.includes(role));

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
}