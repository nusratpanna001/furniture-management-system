import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />; // All other users go to landing page
  }

  return children;
};

export default PublicRoute;
