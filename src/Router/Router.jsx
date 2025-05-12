import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "../Pages/Home";
import Login from "../Pages/Login/Login";
import Verification from "../Pages/Verification/Verification";
import Register from "../Pages/Register/Register";
import NotFound from "../Pages/NotFound/NotFound";

import AdminDashboard from "../Pages/Admin/AdminDashboard";
import BookManagement from "../Pages/Admin/BookManagement";
import { CategoryManagement } from "../Pages/Admin/CategoryManagement";
import { AdminRoute } from "../Components/AdminRoute";

import Layout from "../Components/Layout/Layout";
import BookCollection from "../Components/FeaturesBook/BookCollection";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<BookManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/categories" element={<BookCollection />} />
          {/* Add other routes that need Nav and Footer here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
