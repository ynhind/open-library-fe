import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "../Pages/Home";
import Login from "../Pages/Login/Login";
import Verification from "../Pages/Verification/Verification";
import Register from "../Pages/Register/Register";
import SignOut from "../Pages/SignOut/SignOut";
import NotFound from "../Pages/NotFound/NotFound";

import AdminDashboard from "../Pages/Admin/AdminDashboard";
import BookManagement from "../Pages/Admin/BookManagement";
import { CategoryManagement } from "../Pages/Admin/CategoryManagement";
import UserManagement from "../Pages/Admin/UserManagement";
import { AdminRoute } from "../Components/AdminRoute";

import Layout from "../Components/Layout/Layout";
import BookCollection from "../Components/FeaturesBook/BookCollection";
import BookOfCategories from "../Components/FeaturesBook/BookOfCategories";
import BookDetails from "../Components/FeaturesBook/BookDetails-Improved";
import CartList from "../Components/Cart/CartList";
import PaymentMethods from "../Components/Checkout/PaymentMethods";
import OrderConfirmation from "../Components/Checkout/OrderConfirmation";

import UserInfo from "../Pages/Account/UserInfo";
import EditProfile from "../Pages/Account/EditProfile";
import SearchResults from "../Pages/Search/SearchResults";
import Wishlist from "../Pages/Wishlist/Wishlist";
import Orders from "../Pages/Orders/Orders";
import OrderDetail from "../Pages/Orders/OrderDetail";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<BookManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/categories" element={<BookCollection />} />
          <Route path="/category/:category" element={<BookOfCategories />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<CartList />} />
          <Route path="/payment/:orderId" element={<PaymentMethods />} />
          <Route path="/account" element={<UserInfo />} />
          <Route path="/account/edit" element={<EditProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          {/* Nested route for order confirmation */}
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
