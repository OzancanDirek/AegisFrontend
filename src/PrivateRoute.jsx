import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "./authUtils";

export default function PrivateRoute({ children, allowedRoles }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const role = getRole();

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Yetkisi yoksa rolüne göre ana sayfasına yönlendir
    if (role === "Admin") return <Navigate to="/adminDashboard" replace />;
    if (role === "WAREHOUSE_MANAGER")
      return <Navigate to="/warehouses" replace />;
    if (role === "Gonullu") return <Navigate to="/map" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
