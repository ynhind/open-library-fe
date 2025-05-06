// src/Components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  // Check if user exists and is an admin
  // let user = null;
  // try {
  //   const userString = localStorage.getItem("user");
  //   // Only parse if userString exists and isn't "undefined"
  //   if (userString && userString !== "undefined") {
  //     user = JSON.parse(userString);
  //   }
  // } catch (error) {
  //   console.error("Error parsing user data:", error);
  //   // Clear corrupted data
  //   localStorage.removeItem("user");
  // }

  // Check if token exists

  // If no user data or token, redirect to login
  // if (!user || !token || user.role !== "ADMIN") {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};
