import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
