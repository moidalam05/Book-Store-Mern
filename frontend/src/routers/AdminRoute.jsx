import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
