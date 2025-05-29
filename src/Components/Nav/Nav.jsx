import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Book,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  Loader,
  ArrowLeft,
  LogOut,
  Heart,
  Package,
  Home,
  X,
} from "lucide-react";
import { getCategories, searchBooks } from "../../utils/bookApi";
import { getCartItems } from "../../utils/cartApi";
import { useDebounce } from "../../hooks/useDebounce";

const Nav = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState("title"); // Added search type state
  const [showSearchResults, setShowSearchResults] = useState(false); // Add state for dropdown visibility
  const searchContainerRef = useRef(null); // Ref for click outside detection
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Cart state
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Search type options
  const searchTypes = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "publisher", label: "Publisher" },
    { value: "names", label: "Category" },
  ];

  const navigate = useNavigate();
  const categoryTimeoutRef = useRef(null);
  const userMenuTimeoutRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const location = useLocation();
  const isCartPage = location.pathname === "/cart";

  // Check if user is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch cart items count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (isLoggedIn) {
          const cartData = await getCartItems();
          if (cartData && cartData.items) {
            setCartItemsCount(cartData.items.length);
          }
        } else {
          // Reset cart count if user is not logged in
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        // In case of error, don't update the count
      }
    };

    // Fetch cart count on component mount and when login status changes
    fetchCartCount();

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    // Add event listener for cart updates
    window.addEventListener("cart-updated", handleCartUpdate);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [isLoggedIn]);

  // Define fetchCategoriesData before using it
  const fetchCategoriesData = React.useCallback(async () => {
    if (fetchedCategories.length > 0) return; // Don't fetch if we already have categories

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategories();
      setFetchedCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [fetchedCategories.length]);

  useEffect(() => {
    const currentRef = categoryTimeoutRef.current;
    return () => {
      if (currentRef) clearTimeout(currentRef);
    };
  }, []);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  // Close search results dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if search query has a value
    if (debouncedSearchQuery.trim() !== "") {
      performSearch(debouncedSearchQuery);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [debouncedSearchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  // Perform search using searchBooks API
  const performSearch = async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(false); // Hide results while searching
    try {
      // Create search params based on the selected search type
      const searchParams = {};
      searchParams[searchType] = query;

      const results = await searchBooks(searchParams);
      setSearchResults(results);
      setShowSearchResults(true); // Show results container after search completes
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
      setShowSearchResults(true); // Show "no results" message on error
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      // Navigate to a search results page with the query and type as parameters
      navigate(
        `/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
    }
  };

  if (isCartPage) {
    return (
      <nav
        className={`fixed w-full top-0 z-50 ${
          scrolled
            ? "bg-amber-50/95 backdrop-blur-md shadow-md"
            : "bg-amber-50/90"
        } border-b border-amber-200/20 transition-all duration-300`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <Book
                  className="text-amber-800 group-hover:text-amber-700 transition-colors"
                  size={24}
                />
                <span className="text-2xl font-serif font-bold text-stone-800">
                  Open
                  <span className="text-amber-800 group-hover:text-amber-700 transition-colors">
                    Library
                  </span>
                </span>
              </Link>
              <span className="text-stone-400">|</span>
              <span className="font-serif text-lg">
                <span className="text-2xl font-serif font-bold text-amber-800">
                  Your Cart
                </span>
              </span>
            </div>

            <Link
              to="/"
              className="flex items-center gap-1 text-amber-800 hover:text-amber-900 transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-medium">Continue Shopping</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  const userMenuItems = [
    { name: "My Account", path: "/account", icon: <User size={16} /> },
    { name: "My Orders", path: "/orders", icon: <Package size={16} /> },
    { name: "Wishlist", path: "/wishlist", icon: <Heart size={16} /> },
    { name: "Sign Out", path: "/signout", icon: <LogOut size={16} /> },
  ];

  // Determine active link for visual indication
  const getActiveClass = (path) => {
    return location.pathname === path
      ? "text-amber-800 border-b border-amber-700"
      : "text-stone-700 hover:text-amber-800";
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 ${
        scrolled
          ? "bg-amber-50/98 backdrop-blur-md shadow-lg"
          : "bg-amber-50/95"
      } border-b border-amber-200/30 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-amber-100/50 group-hover:bg-amber-100 transition-all">
              <Book
                className="text-amber-800 group-hover:text-amber-700 transition-colors"
                size={22}
              />
            </div>
            <span className="text-2xl font-serif font-bold text-stone-800">
              Open
              <span className="text-amber-800 group-hover:text-amber-700 transition-colors">
                Library
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors font-medium py-2 ${getActiveClass(
                "/"
              )}`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(categoryTimeoutRef.current);
                setIsCategoriesOpen(true);
              }}
              onMouseLeave={() => {
                categoryTimeoutRef.current = setTimeout(() => {
                  setIsCategoriesOpen(false);
                }, 300); // Delay closing to give users time to move to the menu
              }}
            >
              <button
                className={`flex items-center gap-1.5 transition-colors font-medium py-2 ${
                  location.pathname.includes("/category") ||
                  location.pathname === "/categories"
                    ? "text-amber-800 border-b-2 border-amber-800"
                    : "text-stone-700 hover:text-amber-800"
                }`}
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
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0.5 bg-white backdrop-blur-sm border border-amber-200 rounded-xl shadow-xl py-4 z-10 animate-fade-in max-h-[65vh] overflow-y-auto"
                  style={{ minWidth: "520px" }}
                >
                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader
                        size={18}
                        className="animate-spin text-amber-700"
                      />
                    </div>
                  ) : error ? (
                    <div className="px-5 py-4 text-sm text-red-500 font-medium">
                      {error}
                    </div>
                  ) : fetchedCategories.length > 0 ? (
                    <>
                      {" "}
                      <div className="px-2">
                        <h3 className="text-sm font-semibold text-amber-800 mb-2 px-3">
                          Browse by Category
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2">
                          {fetchedCategories.map((category) => (
                            <Link
                              key={category.categoryId}
                              to={`/category/${category.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="block px-4 py-3 text-sm text-stone-700 hover:bg-amber-100 hover:text-amber-900 whitespace-nowrap rounded-md transition-colors font-medium border border-transparent hover:border-amber-200"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Link
                        to="/categories"
                        className="px-4 py-3 mt-3 text-sm font-medium text-amber-800 border-t border-amber-100 hover:bg-amber-50 transition-colors flex items-center justify-center"
                      >
                        View All Categories{" "}
                        <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-stone-500">
                      No categories found
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/new-arrivals"
              className={`transition-colors font-medium py-2 ${getActiveClass(
                "/new-arrivals"
              )}`}
            >
              New Arrivals
            </Link>

            <Link
              to="/my-library"
              className={`transition-colors font-medium py-2 ${getActiveClass(
                "/my-library"
              )}`}
            >
              My Library
            </Link>
          </div>

          {/* Right Side - Search, Cart, User */}
          <div className="flex items-center">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center relative mr-4 group"
            >
              <div className="flex relative rounded-full shadow-sm hover:shadow-md transition-all overflow-hidden border border-amber-200/40 hover:border-amber-300/60">
                <div className="relative">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="h-8 pl-3 pr-4 rounded-l-full bg-amber-100/80 text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all border-r border-amber-200/40 text-sm font-medium appearance-none"
                    aria-label="Search type"
                  >
                    {searchTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
                  />
                </div>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder={`Search by ${
                      searchTypes
                        .find((t) => t.value === searchType)
                        ?.label.toLowerCase() || "title"
                    }...`}
                    className="w-48 lg:w-64 h-8 pl-9 pr-4 rounded-r-full bg-amber-100/80 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Search Results Dropdown */}
              {showSearchResults && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-amber-200 rounded-lg max-h-72 overflow-y-auto z-10"
                  ref={searchContainerRef}
                >
                  <div className="p-2">
                    {searchResults.length > 0 ? (
                      <>
                        <h3 className="text-xs font-semibold text-amber-800 px-2 pt-1 pb-2 border-b border-amber-100">
                          Search Results ({searchResults.length})
                        </h3>
                        <ul>
                          {searchResults.slice(0, 6).map((book) => (
                            <li key={book.bookId}>
                              <Link
                                to={`/book/${book.bookId}`}
                                className="flex items-start p-2 hover:bg-amber-50 rounded-md transition-colors"
                                onClick={() => setShowSearchResults(false)}
                              >
                                <div className="w-10 h-14 bg-amber-100 flex-shrink-0 rounded overflow-hidden mr-3">
                                  {book.coverImage ? (
                                    <img
                                      src={book.coverImage}
                                      alt={book.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-700">
                                      <Book size={16} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 mt-2">
                                  <p className="font-medium text-sm text-stone-800 truncate">
                                    {book.title}
                                  </p>
                                  <p className="text-xs text-stone-600 truncate">
                                    {book.author}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <div className="py-4 px-2 text-center">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mx-auto mb-2">
                          <Book size={16} />
                        </div>
                        <p className="text-sm text-stone-600">No books found</p>
                        <p className="text-xs text-stone-500 mt-1">
                          Try adjusting your search terms
                        </p>
                      </div>
                    )}
                    {searchResults.length > 6 && (
                      <div className="border-t border-amber-100 p-2 text-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              `/search?query=${encodeURIComponent(
                                searchQuery
                              )}&type=${searchType}`
                            );
                            setShowSearchResults(false);
                          }}
                          className="text-xs text-amber-800 hover:text-amber-900 font-medium"
                        >
                          View all {searchResults.length} results
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Loading Indicator */}
              {isSearching &&
                searchQuery.trim() !== "" &&
                !showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-amber-200 rounded-lg p-4 z-10">
                    <div className="flex justify-center items-center">
                      <Loader
                        size={18}
                        className="animate-spin text-amber-700 mr-2"
                      />
                      <span className="text-sm text-stone-600">
                        Searching...
                      </span>
                    </div>
                  </div>
                )}
            </form>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 bg-amber-50 hover:bg-amber-100 rounded-full transition-all group"
            >
              <ShoppingCart
                size={20}
                className="text-amber-800 group-hover:scale-110 transition-transform"
              />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs bg-amber-800 text-white rounded-full shadow-sm group-hover:animate-pulse">
                {cartItemsCount}
              </span>
            </Link>

            {/* User Menu */}
            <div
              className="relative ml-4"
              onMouseEnter={() => {
                clearTimeout(userMenuTimeoutRef.current);
                setIsUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                userMenuTimeoutRef.current = setTimeout(() => {
                  setIsUserMenuOpen(false);
                }, 400); // Longer delay before closing gives users more time
              }}
            >
              {/* Add an invisible element to increase the hit area between the button and menu */}
              <div className="absolute w-full h-4 bottom-0 left-0 translate-y-full"></div>

              <button className="p-2 bg-amber-50 hover:bg-amber-100 rounded-full transition-all relative">
                <User size={20} className="text-amber-800" />
                {isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-amber-50"></span>
                )}
              </button>

              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  onMouseEnter={() => {
                    clearTimeout(userMenuTimeoutRef.current);
                    setIsUserMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    userMenuTimeoutRef.current = setTimeout(() => {
                      setIsUserMenuOpen(false);
                    }, 300);
                  }}
                  className="absolute top-full right-0 mt-2 w-60 bg-white backdrop-blur-sm border border-amber-200 rounded-xl shadow-xl py-3 z-10 animate-fade-in"
                >
                  {isLoggedIn && (
                    <div className="px-5 py-3 mb-1 border-b border-amber-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-amber-800 font-medium mr-3 shadow-sm">
                            {/* Display first letter of username */}U
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold text-stone-800">
                              Member
                            </p>
                            <p className="text-xs text-stone-500">
                              Welcome back!
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex h-5 items-center px-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                          Active
                        </span>
                      </div>
                    </div>
                  )}

                  {userMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <Link
                        to={item.path}
                        className="flex items-center px-5 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <span className="w-7 h-7 mr-3 flex items-center justify-center text-amber-700 bg-amber-50 rounded-md">
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                      {index === userMenuItems.length - 2 && (
                        <div className="border-t border-amber-100 my-1.5"></div>
                      )}
                    </React.Fragment>
                  ))}

                  {!isLoggedIn && (
                    <div className="px-5 py-4 text-center">
                      <Link
                        to="/login"
                        className="inline-block px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-sm font-medium transition-colors w-full mb-3 shadow-sm"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="inline-block px-4 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-md text-sm font-medium transition-colors w-full mb-3 shadow-sm"
                      >
                        Create Account
                      </Link>
                      <p className="text-xs text-stone-500 mt-1">
                        New to OpenLibrary?{" "}
                        <Link
                          to="/register"
                          className="text-amber-800 font-medium hover:underline"
                        >
                          Learn more
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 ml-4 bg-amber-50 hover:bg-amber-100 rounded-full transition-all"
              onClick={toggleMobileMenu}
            >
              <Menu size={20} className="text-amber-800" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-amber-50/98 border-t border-amber-200 animate-fade-in shadow-xl">
            <div className="p-5 space-y-4">
              <form onSubmit={handleSearch} className="mb-5">
                <div className="flex flex-col space-y-3">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="h-11 px-5 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-amber-200 font-medium shadow-sm"
                    aria-label="Search type"
                  >
                    {searchTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        Search by {type.label}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Enter ${
                        searchTypes
                          .find((t) => t.value === searchType)
                          ?.label.toLowerCase() || "title"
                      }...`}
                      className="w-full h-11 pl-10 pr-10 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-amber-200 shadow-sm"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-11 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm font-medium"
                    disabled={!searchQuery.trim()}
                  >
                    <Search size={16} className="mr-2" />
                    Search
                  </button>

                  {/* Mobile Search Results */}
                  {showSearchResults && (
                    <div
                      className="bg-white shadow-lg border border-amber-200 rounded-lg max-h-64 overflow-y-auto mt-2"
                      ref={searchContainerRef}
                    >
                      <div className="p-2">
                        {searchResults.length > 0 ? (
                          <>
                            <h3 className="text-xs font-semibold text-amber-800 px-2 pt-1 pb-2 border-b border-amber-100">
                              Search Results ({searchResults.length})
                            </h3>
                            <ul>
                              {searchResults.slice(0, 4).map((book) => (
                                <li key={book.bookId}>
                                  <Link
                                    to={`/book/${book.bookId}`}
                                    className="flex items-start p-2 hover:bg-amber-50 rounded-md transition-colors"
                                    onClick={() => {
                                      setShowSearchResults(false);
                                      setIsMobileMenuOpen(false);
                                    }}
                                  >
                                    <div className="w-10 h-14 bg-amber-100 flex-shrink-0 rounded overflow-hidden mr-3">
                                      {book.coverImage ? (
                                        <img
                                          src={book.coverImage}
                                          alt={book.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-700">
                                          <Book size={16} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-stone-800 truncate">
                                        {book.title}
                                      </p>
                                      <p className="text-xs text-stone-600 truncate">
                                        {book.author}
                                      </p>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <div className=" text-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mx-auto">
                              <Book size={8} />
                            </div>
                            <p className="text-sm text-stone-600">
                              No books found
                            </p>
                            <p className="text-xs text-stone-500 mt-1">
                              Try adjusting your search terms
                            </p>
                          </div>
                        )}
                        {searchResults.length > 4 && (
                          <div className="border-t border-amber-100 p-2 text-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(
                                  `/search?query=${encodeURIComponent(
                                    searchQuery
                                  )}&type=${searchType}`
                                );
                                setShowSearchResults(false);
                                setIsMobileMenuOpen(false);
                              }}
                              className="text-xs text-amber-800 hover:text-amber-900 font-medium"
                            >
                              View all {searchResults.length} results
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mobile Loading Indicator */}
                  {isSearching &&
                    searchQuery.trim() !== "" &&
                    !showSearchResults && (
                      <div className="bg-white shadow-lg border border-amber-200 rounded-lg p-4 mt-2">
                        <div className="flex justify-center items-center">
                          <Loader
                            size={18}
                            className="animate-spin text-amber-700 mr-2"
                          />
                          <span className="text-sm text-stone-600">
                            Searching...
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </form>

              {isLoggedIn && (
                <div className="flex items-center mb-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-amber-800 font-medium mr-3 shadow-sm">
                    U
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">
                      Welcome back!
                    </p>
                    <span className="inline-flex h-5 items-center px-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                      Member
                    </span>
                  </div>
                </div>
              )}

              <Link
                to="/"
                className="flex items-center py-3 px-4 text-stone-700 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <span className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center mr-3">
                  <Home size={18} className="text-amber-700" />
                </span>
                <span className="font-medium">Home</span>
              </Link>

              <button
                className="flex items-center justify-between w-full py-3 px-4 text-stone-700 hover:bg-amber-50 rounded-lg transition-colors"
                onClick={toggleCategories}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center mr-3">
                    <Book size={18} className="text-amber-700" />
                  </span>
                  <span className="font-medium">Categories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="ml-7 mt-2 space-y-1 border-l border-amber-200 pl-4 max-h-[40vh] overflow-y-auto py-2">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader
                        size={18}
                        className="animate-spin text-amber-700"
                      />
                    </div>
                  ) : error ? (
                    <div className="py-3 text-sm font-medium text-red-500">
                      {error}
                    </div>
                  ) : fetchedCategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {fetchedCategories.map((category, index) => (
                        <Link
                          key={index}
                          to={`/category/${category.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block py-3 px-3 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors rounded-md border border-transparent hover:border-amber-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}

                      <div className="col-span-1 sm:col-span-2 pt-3 mt-2 border-t border-amber-100">
                        <Link
                          to="/categories"
                          className="inline-flex items-center text-sm text-amber-700 font-medium hover:text-amber-900"
                        >
                          View all categories{" "}
                          <ChevronRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 text-sm text-stone-500">
                      No categories found
                    </div>
                  )}
                </div>
              )}

              <Link
                to="/new-arrivals"
                className="flex items-center py-3 px-4 text-stone-700 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <span className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center mr-3">
                  <span className="text-amber-700">✨</span>
                </span>
                <span className="font-medium">New Arrivals</span>
              </Link>

              <Link
                to="/my-library"
                className="flex items-center py-3 px-4 text-stone-700 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <span className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center mr-3">
                  <span className="text-amber-700">📚</span>
                </span>
                <span className="font-medium">My Library</span>
              </Link>

              <div className="border-t border-amber-200 my-3"></div>

              {userMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center py-3 px-4 text-stone-700 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <span className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center mr-3">
                    {React.cloneElement(item.icon, {
                      className: "text-amber-700",
                    })}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              {!isLoggedIn && (
                <div className="mt-4 pt-4 border-t border-amber-200 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-center font-medium transition-colors shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="py-2.5 px-4 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-center font-medium transition-colors shadow-sm"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
