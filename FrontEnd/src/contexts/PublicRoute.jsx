import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
    if (user.role === "user") return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
