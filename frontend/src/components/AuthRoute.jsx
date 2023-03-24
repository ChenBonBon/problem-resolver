import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AuthRoute({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth && location.pathname !== "/") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
