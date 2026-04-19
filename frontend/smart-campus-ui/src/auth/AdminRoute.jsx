import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/**
 * AdminRoute — wraps protected admin content.
 * Redirects to /dashboard if:
 *   - user is not authenticated
 *   - user role is not ADMIN
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
