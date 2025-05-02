import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  //   if (!user || user.role !== "ADMIN") {
  //     return <Navigate to="/login" />;
  //   }

  return <Outlet />;
};
