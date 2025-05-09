import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Book,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Menu,
} from "lucide-react";

const Nav = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const categories = [
    "Classic Literature",
    "History",
    "Philosophy",
    "Poetry",
    "All Categories",
  ];

  const userMenuItems = [
    { name: "My Account", path: "/account" },
    { name: "My Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Sign Out", path: "/signout" },
  ];

  return (
    <nav className="bg-amber-50/95 border-b border-amber-200/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Book className="text-amber-800" size={24} />
            <span className="text-2xl font-serif font-bold text-stone-800">
              Old<span className="text-amber-800">Tomes</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-stone-700 hover:text-amber-800 transition-colors font-medium"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-stone-700 hover:text-amber-800 transition-colors font-medium"
                onClick={toggleCategories}
              >
                Categories
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-amber-50 border border-amber-200 rounded-md shadow-lg py-1 z-10 animate-fade-in">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-100 hover:text-amber-900"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/new-arrivals"
              className="text-stone-700 hover:text-amber-800 transition-colors font-medium"
            >
              New Arrivals
            </Link>

            <Link
              to="/my-library"
              className="text-stone-700 hover:text-amber-800 transition-colors font-medium"
            >
              My Library
            </Link>
          </div>

          {/* Right Side - Search, Cart, User */}
          <div className="flex items-center">
            {/* Search */}
            <div className="hidden md:flex items-center relative mr-4">
              <input
                type="text"
                placeholder="Search titles, authors..."
                className="w-48 lg:w-64 h-9 pl-9 pr-4 rounded-full bg-amber-100/80 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              <Search size={16} className="absolute left-3 text-stone-500" />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-700 hover:text-amber-800 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs bg-amber-800 text-white rounded-full">
                3
              </span>
            </Link>

            {/* User Menu */}
            <div className="relative ml-4">
              <button
                className="p-2 text-stone-700 hover:text-amber-800 transition-colors"
                onClick={toggleUserMenu}
              >
                <User size={20} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-amber-50 border border-amber-200 rounded-md shadow-lg py-1 z-10 animate-fade-in">
                  {userMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <Link
                        to={item.path}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-100 hover:text-amber-900"
                      >
                        {item.name}
                      </Link>
                      {index === userMenuItems.length - 2 && (
                        <div className="border-t border-amber-200 my-1"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 ml-4 text-stone-700 hover:text-amber-800 transition-colors"
              onClick={toggleMobileMenu}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-amber-50 border-t border-amber-200 animate-fade-in">
            <div className="p-4 space-y-1">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search titles, authors..."
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-amber-100/80 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                />
              </div>

              <Link to="/" className="block py-2 text-stone-700">
                Home
              </Link>

              <button
                className="flex items-center justify-between w-full py-2 text-stone-700"
                onClick={toggleCategories}
              >
                <span>Categories</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-amber-200 pl-4">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block py-2 text-sm text-stone-700"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}

              <Link to="/new-arrivals" className="block py-2 text-stone-700">
                New Arrivals
              </Link>

              <Link to="/my-library" className="block py-2 text-stone-700">
                My Library
              </Link>

              <div className="border-t border-amber-200 my-2"></div>

              {userMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="block py-2 text-stone-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
