import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserWishlist, removeFromWishlist } from "../../utils/wishlistApi";
import { addToCart } from "../../utils/cartApi";
import { toast } from "react-toastify";
import {
  Heart,
  Trash,
  ShoppingCart,
  BookOpen,
  ChevronLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Inject global CSS for animations directly in the React component
const AnimationStyles = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 2s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `,
      }}
    />
  );
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeLoading, setRemoveLoading] = useState({});
  const [cartLoading, setCartLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getUserWishlist();
      setWishlistItems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message || "Failed to load wishlist");

      // Handle authentication error
      if (
        err.message &&
        (err.message.includes("Authentication required") ||
          err.message.includes("Token has been expired"))
      ) {
        // Determine if it's an expired token or no authentication
        const isExpired = err.message.includes("Token has been expired");

        toast.error(
          <div>
            {isExpired
              ? "Your session has expired. Please log in again."
              : "Please log in to view your wishlist."}{" "}
            <a
              href="/login"
              className="font-bold underline"
              onClick={(e) => {
                e.preventDefault();
                if (isExpired) {
                  localStorage.removeItem("token");
                }
                navigate("/login");
                toast.dismiss();
              }}
            >
              Sign in
            </a>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (bookId, title) => {
    try {
      setRemoveLoading((prev) => ({ ...prev, [bookId]: true }));
      await removeFromWishlist(bookId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.book.bookId !== bookId)
      );
      toast.success(`${title} removed from your wishlist!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setRemoveLoading((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const handleAddToCart = async (bookId, title) => {
    try {
      setCartLoading((prev) => ({ ...prev, [bookId]: true }));
      await addToCart(bookId, 1);
      toast.success(`${title} added to your cart!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);

      // Handle authentication error
      if (
        error.message &&
        (error.message.includes("Authentication required") ||
          error.message.includes("Token has been expired"))
      ) {
        const isExpired = error.message.includes("Token has been expired");

        toast.error(
          <div>
            {isExpired
              ? "Your session has expired. Please log in again."
              : "Please log in to add items to your cart."}{" "}
            <a
              href="/login"
              className="font-bold underline"
              onClick={(e) => {
                e.preventDefault();
                if (isExpired) {
                  localStorage.removeItem("token");
                }
                navigate("/login");
                toast.dismiss();
              }}
            >
              Sign in
            </a>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } else {
        toast.error("Failed to add to cart. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setCartLoading((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Premium header skeleton */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-6 mb-10 shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/80 rounded-full mr-4"></div>
              <div>
                <div className="h-8 w-40 bg-stone-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-56 bg-stone-100 animate-pulse rounded mt-2"></div>
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
            Loading your collection...
          </span>

          <div className="relative w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full animate-loadingBar"></div>
          </div>

          <p className="text-stone-500 mt-5 max-w-xs text-center leading-relaxed">
            We're retrieving your wishlisted books.
            <span className="block mt-1 text-amber-700 font-serif">
              This will only take a moment.
            </span>
          </p>

          {/* Animated book icons */}
          <div className="flex items-center gap-3 mt-8">
            <div
              className="w-6 h-8 border border-amber-200 rounded-sm animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1.5s" }}
            ></div>
            <div
              className="w-6 h-7 border border-amber-200 rounded-sm animate-bounce"
              style={{ animationDelay: "200ms", animationDuration: "1.3s" }}
            ></div>
            <div
              className="w-6 h-9 border border-amber-200 rounded-sm animate-bounce"
              style={{ animationDelay: "400ms", animationDuration: "1.7s" }}
            ></div>
          </div>

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

  // Error state (only non-authentication errors)
  if (error && !error.includes("Authentication")) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                <ChevronLeft size={20} className="text-amber-800" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-medium text-stone-800">
                  My Wishlist
                </h1>
                <p className="text-stone-500 mt-1">
                  Books you've saved for later
                </p>
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
                  Unable to load your wishlist
                </h3>
                <div className="h-px w-16 bg-red-200 my-3"></div>
                <p className="text-stone-600 mt-2 mb-6 leading-relaxed">
                  {error}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <button
                    onClick={fetchWishlist}
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

                <div className="mt-8 pt-4 border-t border-stone-100">
                  <p className="text-stone-500 flex items-center">
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
                      className="mr-2 text-amber-500"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    If this issue persists, please contact our
                    <a
                      href="#"
                      className="text-amber-600 hover:text-amber-700 ml-1 underline decoration-dotted underline-offset-4"
                    >
                      support team
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty wishlist state
  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                <ChevronLeft size={20} className="text-amber-800" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-medium text-stone-800">
                  My Wishlist
                </h1>
                <p className="text-stone-500 mt-1">
                  Books you've saved for later
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra premium empty state with enhanced visuals */}
        <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
          {/* Premium top accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
          <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

          {/* Book icon background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "60px",
            }}
          ></div>

          {/* Premium wishlist heart icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
              <Heart className="text-amber-500" size={46} />
            </div>
            <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

            {/* Decorative circles */}
            <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
            <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
          </div>

          <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
            Your reading wishlist is empty
          </h2>

          <p className="text-stone-600 mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
            Explore our collection and add your favorite books to your wishlist
            for easy access later.
            <span className="block mt-2 italic text-amber-700 font-serif">
              Heart the books you're interested in and they'll appear here.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/categories"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-2.5 font-medium shadow-md hover:shadow-lg group"
            >
              <BookOpen
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Browse Collection</span>
              <span className="ml-1 text-amber-200 group-hover:ml-2 transition-all">
                →
              </span>
            </Link>
            <Link
              to="/"
              className="px-8 py-3.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow"
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
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Return to Homepage
            </Link>
          </div>

          {/* Premium recommendation text */}
          <div className="mt-8 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
            <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
            Discover your next favorite read today
            <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
          </div>
        </div>
      </div>
    );
  }

  // Render wishlist
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Luxurious premium header with enhanced gradient and visual elements */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-8 mb-10 shadow-md border border-amber-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-amber-100/10 rounded-full -mr-16 -mt-16 blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-300/20 to-amber-100/5 rounded-full -ml-10 -mb-10 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-amber-300/20 rounded-full blur-sm"></div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23b45309' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        ></div>

        {/* Golden accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 rounded-t-2xl"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-5 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md group"
            >
              <ChevronLeft
                size={20}
                className="text-amber-700 group-hover:text-amber-900 transition-colors"
              />
            </Link>
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-serif font-medium text-stone-800 flex flex-wrap items-center gap-2">
                  My Wishlist
                  <div className="relative">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm py-1 px-3.5 rounded-full font-sans font-medium ml-1 inline-flex items-center shadow-sm">
                      {wishlistItems.length}
                      <span className="hidden sm:inline ml-1">
                        {wishlistItems.length === 1 ? "book" : "books"}
                      </span>
                    </span>
                    <span className="absolute -inset-0.5 bg-amber-300 rounded-full blur opacity-50 animate-pulse"></span>
                  </div>
                </h1>
                <Heart className="text-amber-500 w-5 h-5 ml-3 animate-pulse" />
              </div>
              <p className="text-stone-600 mt-2 flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                Books you've saved for later
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/categories"
              className="bg-gradient-to-br from-white to-amber-50 hover:from-white hover:to-white text-amber-800 px-5 py-2.5 rounded-lg shadow-sm border border-amber-100 transition-all text-sm font-medium flex items-center gap-2 hover:shadow"
            >
              <BookOpen size={16} />
              Browse Books
            </Link>
          </div>
        </div>
      </div>

      {/* Premium filtering and view controls */}
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
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          <div>
            <div className="text-stone-700 font-medium">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "book" : "books"} in your collection
            </div>
            <div className="text-stone-400 text-xs mt-0.5">
              Curated selections just for you
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 sm:mt-0">
          <div className="flex items-center mr-4">
            <select className="pl-3 pr-8 py-2 text-sm border border-stone-200 rounded-lg text-stone-600 bg-white focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-300">
              <option value="newest">Sort: Newest first</option>
              <option value="oldest">Sort: Oldest first</option>
              <option value="price-asc">Sort: Price (low to high)</option>
              <option value="price-desc">Sort: Price (high to low)</option>
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

      {/* Enhanced card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const { book } = item;
          const bookId = book.bookId;
          const addedDate = new Date(item.createdAt || Date.now());

          return (
            <div
              key={bookId}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md hover:border-amber-200 transition-all group"
            >
              <div className="relative h-52">
                <Link to={`/book/${bookId}`}>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Premium badge in corner if book is popular or featured */}
                {book.ratings && book.ratings.length > 10 && (
                  <div className="absolute top-3 left-3 bg-amber-500/90 text-white text-xs py-1 px-2 rounded backdrop-blur-sm font-medium shadow-sm">
                    Popular
                  </div>
                )}

                {/* Enhanced gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold text-lg">
                        {book.price
                          ? book.price.toLocaleString("vi-VN")
                          : "N/A"}{" "}
                        VND
                      </span>
                      {book.originalPrice &&
                        book.originalPrice > book.price && (
                          <span className="text-white/70 text-sm line-through ml-2">
                            {book.originalPrice.toLocaleString("vi-VN")} VND
                          </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/book/${bookId}`}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100"
                        aria-label="View details"
                      >
                        <BookOpen size={16} className="text-white" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link to={`/book/${bookId}`}>
                      <h3 className="font-medium text-lg mb-1 hover:text-amber-700 transition-colors line-clamp-1 group-hover:text-amber-700">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-stone-500 text-sm">{book.author}</p>
                  </div>

                  {/* Date badge */}
                  <div className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-md whitespace-nowrap">
                    Added{" "}
                    {addedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Book categories/genres */}
                {book.category && (
                  <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                    <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full">
                      {book.category}
                    </span>
                    {book.genre && (
                      <span className="bg-stone-50 text-stone-600 text-xs px-2.5 py-1 rounded-full">
                        {book.genre}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(bookId, book.title)}
                    disabled={cartLoading[bookId]}
                    className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-sm hover:shadow"
                  >
                    {cartLoading[bookId] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(bookId, book.title)}
                    disabled={removeLoading[bookId]}
                    className="p-2 border border-stone-200 hover:bg-red-50 hover:border-red-200 rounded-lg text-stone-500 hover:text-red-500 transition-all disabled:opacity-70"
                    aria-label="Remove from wishlist"
                  >
                    {removeLoading[bookId] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
