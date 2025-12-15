import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole } = useAuth();

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Role check
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
