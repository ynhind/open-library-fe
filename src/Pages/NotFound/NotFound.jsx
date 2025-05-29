import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../Components/Nav/Nav";
import Footer from "../../Components/Footer/Footer";
import { Home, BookOpen, Search, ArrowLeft } from "lucide-react";

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

      <div className="flex-grow flex items-center justify-center p-6 pt-16 md:pt-20">
        <div className="bg-white border border-amber-50 shadow-md rounded-2xl p-12 text-center relative overflow-hidden max-w-2xl w-full">
          {/* Premium top accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-50 rounded-full opacity-70 -mb-16 -mr-16"></div>
          <div className="absolute top-1/4 left-1/6 w-24 h-24 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
          <div className="absolute bottom-1/3 left-1/5 w-12 h-12 bg-amber-100 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1'%3E%3Cpath d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'%3E%3C/path%3E%3Cpath d='M16 17l5-5-5-5'%3E%3C/path%3E%3Cpath d='M21 12H9'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "80px",
            }}
          ></div>

          {/* 404 display */}
          <div className="relative">
            <h1 className="text-[120px] font-serif font-bold text-amber-50 leading-none select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-6xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600 mb-4 relative z-10">
                404
              </h2>
            </div>
          </div>

          <h3 className="text-2xl font-serif font-medium mb-4 relative z-10 mt-4">
            Page Not Found
          </h3>

          <p className="text-stone-600 mb-10 max-w-md mx-auto relative z-10 leading-relaxed">
            We couldn't find the page you're looking for.
            <span className="block mt-2 italic text-amber-700 font-serif">
              The page may have been moved, deleted, or perhaps never existed.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-2.5 font-medium shadow-md hover:shadow-lg group"
            >
              <Home
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Return to Homepage</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Search suggestion */}
          <div className="mt-12 mx-auto max-w-md relative z-10">
            <p className="text-stone-500 mb-3 text-sm">
              Looking for something specific?
            </p>
            <div className="flex">
              <input
                type="text"
                placeholder="Search for books..."
                className="flex-1 rounded-l-lg border border-stone-200 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300"
              />
              <Link
                to="/search?query="
                className="bg-amber-500 text-white rounded-r-lg px-4 flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Search size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
