import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../Components/Nav/Nav";
import Footer from "../../Components/Footer/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-serif font-bold mb-4 text-oldTomes-brown">
            404
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! We couldn't find the page you're looking for.
          </p>
          <p className="mb-8 text-gray-500">
            The page may have been moved, deleted, or perhaps never existed.
          </p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
