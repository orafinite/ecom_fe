import React from "react";
import { Navigate, useLocation } from "react-router-dom";
// import { getToken } from "@/api/service/localStorageServices";
import {
  protectedRoutes,
  authRoutes,
  rolebaseRoutes,
  Default_Login_Redirect,
} from "@/routes";

const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  const { access_token, user_role } = {
    // access_token: "admin",
    // user_role: "admin",
    access_token: null,
    user_role: null,
  };
  const location = useLocation();
  const isProtectedRoute = protectedRoutes.some((route) =>
    new RegExp(route).test(location.pathname),
  );
  // const isPublicRoute = !isProtectedRoute && publicRoutes.some(route => new RegExp(route).test(location.pathname));
  const isAuthRoute = authRoutes.some((route) =>
    new RegExp(route).test(location.pathname),
  );
  const roleBasedRoute = rolebaseRoutes.find((route) =>
    new RegExp(route.path).test(location.pathname),
  );

  if (isProtectedRoute && !access_token) {
    return <Navigate to="/" />;
  }

  if (isAuthRoute && access_token) {
    return <Navigate to={Default_Login_Redirect} />;
  }

  if (
    roleBasedRoute &&
    (!access_token ||
      typeof user_role !== "string" ||
      !roleBasedRoute.roles.includes(user_role))
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RouteProvider;
