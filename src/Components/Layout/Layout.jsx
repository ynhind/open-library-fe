import React from "react";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav className="default" />

      {/* Added pt-16 md:pt-20 to account for fixed navbar height */}
      <main className="flex-grow pt-16 md:pt-20">{children || <Outlet />}</main>

      <Footer />
    </div>
  );
};

export default Layout;
