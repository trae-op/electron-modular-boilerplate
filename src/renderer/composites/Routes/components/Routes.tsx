import { useAuthenticatedSelector } from "@conceptions/Auth";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const isAuthenticated = useAuthenticatedSelector();
  if (isAuthenticated) return <Outlet />;

  return <Navigate to="/sign-in" replace />;
};

export const PublicRoute = () => {
  const isAuthenticated = useAuthenticatedSelector();

  if (isAuthenticated) return <Navigate to="/window:main" replace />;

  return <Outlet />;
};
