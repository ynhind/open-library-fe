import React from "react";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav className="default" />

      <main className="flex-grow">{children || <Outlet />}</main>

      <Footer />
    </div>
  );
};

export default Layout;
