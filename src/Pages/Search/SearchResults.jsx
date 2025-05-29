import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchBooks } from "../../utils/bookApi";
import BookCard from "../../Components/FeaturesBook/BookCard";
import {
  Loader2,
  Search,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const searchType = queryParams.get("type") || "title";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Create search params based on the selected search type
        const searchParams = {};

        // Handle the special case for category search which uses 'names' parameter
        if (searchType === "names") {
          searchParams.names = searchQuery;
        } else {
          searchParams[searchType] = searchQuery;
        }

        const results = await searchBooks(searchParams);

        setBooks(results);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, searchType]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl pt-16">
        {/* Premium header skeleton */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-6 mb-10 shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/80 rounded-full mr-4"></div>
              <div>
                <div className="h-8 w-64 bg-stone-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-40 bg-stone-100 animate-pulse rounded mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium loading state with enhanced visual treatment */}
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-amber-50 p-8 relative overflow-hidden">
          {/* Premium top accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

          <div className="relative mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-white rounded-full shadow-inner flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            </div>
            <div className="absolute -inset-2 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -inset-4 bg-amber-200/20 rounded-full blur-md"></div>
          </div>

          <span className="mt-6 text-2xl text-stone-700 font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
            Searching for books...
          </span>

          <div className="relative w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full animate-loadingBar"></div>
          </div>

          <p className="text-stone-500 mt-5 max-w-xs text-center leading-relaxed">
            We're looking through our collection to find your books.
            <span className="block mt-1 text-amber-700 font-serif">
              This will only take a moment.
            </span>
          </p>

          <style jsx>{`
            @keyframes loadingBar {
              0% {
                transform: translateX(-100%);
              }
              50% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
            .animate-loadingBar {
              animation: loadingBar 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl pt-16">
        {/* Premium header with gradient background */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-6 mb-10 shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <Link
                to="/"
                className="mr-4 p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-sm"
              >
                <ArrowLeft size={20} className="text-amber-800" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-medium text-stone-800">
                  Search Results
                </h1>
                <p className="text-stone-500 mt-1">Find your next great read</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced premium error state */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-red-100">
          {/* Premium error accent */}
          <div className="h-1.5 bg-gradient-to-r from-red-300 via-red-500 to-red-300"></div>

          <div className="p-10 relative overflow-hidden">
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='1'%3E%3Cpath d='M12 8v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: "40px",
              }}
            ></div>

            <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
              {/* Enhanced error icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center shadow-inner border border-red-100">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div className="absolute -inset-1 bg-red-400/20 rounded-full blur-sm"></div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-serif font-medium text-stone-800">
                  Unable to load search results
                </h3>
                <div className="h-px w-16 bg-red-200 my-3"></div>
                <p className="text-stone-600 mt-2 mb-6 leading-relaxed">
                  {error}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-3 shadow-md hover:shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Try Again
                  </button>
                  <Link
                    to="/"
                    className="px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm hover:shadow"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 max-w-6xl">
      {/* Luxurious premium header with enhanced gradient and visual elements */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-8 mb-10 shadow-md border border-amber-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-amber-100/10 rounded-full -mr-16 -mt-16 blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-300/20 to-amber-100/5 rounded-full -ml-10 -mb-10 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-amber-300/20 rounded-full blur-sm"></div>

        {/* Golden accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 rounded-t-2xl"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-5 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md group"
            >
              <ArrowLeft
                size={20}
                className="text-amber-700 group-hover:text-amber-900 transition-colors"
              />
            </Link>
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-serif font-medium text-stone-800 flex flex-wrap items-center gap-2">
                  Search Results
                  <div className="relative">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm py-1 px-3.5 rounded-full font-sans font-medium ml-1 inline-flex items-center shadow-sm">
                      {books.length}
                      <span className="hidden sm:inline ml-1">
                        {books.length === 1 ? "match" : "matches"}
                      </span>
                    </span>
                    <span className="absolute -inset-0.5 bg-amber-300 rounded-full blur opacity-30"></span>
                  </div>
                </h1>
                <Search className="text-amber-500 w-5 h-5 ml-3" />
              </div>
              <p className="text-stone-600 mt-2 flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                Results for {searchType === "names" ? "category" : searchType} "
                {searchQuery}"
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="bg-gradient-to-br from-white to-amber-50 hover:from-white hover:to-white text-amber-800 px-5 py-2.5 rounded-lg shadow-sm border border-amber-100 transition-all text-sm font-medium flex items-center gap-2 hover:shadow">
              <SlidersHorizontal size={16} />
              Filter Results
            </button>
          </div>
        </div>
      </div>

      {/* Premium filtering and sort controls */}
      <div className="flex flex-wrap items-center justify-between mb-8 bg-white p-5 rounded-xl shadow-sm border border-amber-50 relative">
        {/* Subtle corner accent */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-200 rounded-tl-xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-200 rounded-br-xl"></div>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-3 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <path d="m21 15-9 5-9-5V8l9-5 9 5Z" />
              <path d="M12 10v5" />
              <path d="m8 12 4-2 4 2" />
            </svg>
          </div>
          <div>
            <div className="text-stone-700 font-medium">
              {books.length} {books.length === 1 ? "book" : "books"} found
            </div>
            <div className="text-stone-400 text-xs mt-0.5">
              Browse our collection
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 sm:mt-0">
          <div className="flex items-center mr-4">
            <select className="pl-3 pr-8 py-2 text-sm border border-stone-200 rounded-lg text-stone-600 bg-white focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300">
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-asc">Sort by: Price (low to high)</option>
              <option value="price-desc">Sort by: Price (high to low)</option>
              <option value="newest">Sort by: Newest first</option>
            </select>
          </div>

          <div className="bg-stone-100 p-1 rounded-lg flex">
            <button className="p-2 bg-white rounded-md text-amber-700 transition-colors flex items-center gap-1.5 text-sm shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button className="p-2 hover:bg-amber-50 rounded-md text-stone-500 hover:text-amber-700 transition-colors flex items-center gap-1.5 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
          {/* Premium top accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
          <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1'%3E%3Cpath d='m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "60px",
            }}
          ></div>

          {/* Premium search icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
              <Search className="text-amber-500" size={46} />
            </div>
            <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm"></div>
            <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

            {/* Decorative circles */}
            <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
            <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
          </div>

          <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
            No results found
          </h2>

          <p className="text-stone-600 mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
            We couldn't find any books matching your search criteria.
            <span className="block mt-2 italic text-amber-700 font-serif">
              Try searching with different keywords or browse our collection.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-2.5 font-medium shadow-md hover:shadow-lg group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Go Back</span>
            </button>
            <Link
              to="/categories"
              className="px-8 py-3.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow"
            >
              <BookOpen size={18} />
              Browse Categories
            </Link>
          </div>

          {/* Suggestion text */}
          <div className="mt-8 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
            <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
            Try adjusting your search terms
            <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.bookId} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
