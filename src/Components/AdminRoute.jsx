<<<<<<< HEAD
// src/Components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  // Check if user exists and is an admin
  let user = null;
  let token = null;

  try {
    const userString = localStorage.getItem("user");
    const tokenString = localStorage.getItem("token");

    // Only parse if userString exists and isn't "undefined"
    if (userString && userString !== "undefined") {
      user = JSON.parse(userString);
    }

    if (tokenString && tokenString !== "undefined") {
      token = tokenString;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    // Clear corrupted data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // If no user data or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, redirect to home
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
=======
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  //   if (!user || user.role !== "ADMIN") {
  //     return <Navigate to="/login" />;
  //   }
>>>>>>> 7838768 (authentication)

  return <Outlet />;
};
