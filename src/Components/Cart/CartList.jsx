import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Gift,
  LogIn,
  UserPlus,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react";

// Inject global CSS for animations
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
import CartItem from "./CartItem";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "../../utils/cartApi.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createOrderFromCart } from "../../utils/orderApi";

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Safely calculate cart totals with array check
  const cartSubtotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + (item?.book?.price || 0) * (item?.quantity || 0),
        0
      )
    : 0;

  // Calculate selected items subtotal
  const selectedItemsSubtotal = Array.isArray(cartItems)
    ? cartItems
        .filter((item) => selectedItems.includes(item.book.bookId))
        .reduce(
          (sum, item) => sum + (item?.book?.price || 0) * (item?.quantity || 0),
          0
        )
    : 0;

  const shipping = cartSubtotal > 1200000 ? 0 : 120000; // 50 USD = 1,200,000 VND, 4.99 USD = 120,000 VND
  const selectedItemsShipping = selectedItemsSubtotal > 1200000 ? 0 : 120000;

  const cartTotal = cartSubtotal + shipping;
  const selectedItemsTotal = selectedItemsSubtotal + selectedItemsShipping;

  //   const itemCount = Array.isArray(cartItems)
  //     ? cartItems.reduce((count, item) => count + (item?.quantity || 0), 0)
  //     : 0;

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCartItems();
        console.log("Cart API response:", data);

        let cartItems = [];

        // If data is the expected format with items array
        if (data && data.items && Array.isArray(data.items)) {
          cartItems = data.items.map((item) => ({
            book: {
              bookId: item.bookId,
              title: item.title,
              price: item.price,
              coverImage: item.coverImage,
              author: item.author || "Unknown author",
              quantity_available: item.quantity_available,
            },
            quantity: item.quantity,
          }));
        }
        // If data is already an array of items
        else if (data && Array.isArray(data)) {
          cartItems = data.map((item) => ({
            book: {
              bookId: item.bookId || item.book?.bookId,
              title: item.title || item.book?.title,
              price: item.price || item.book?.price,
              coverImage: item.coverImage || item.book?.coverImage,
              author: item.author || item.book?.author || "Unknown author",
              quantity_available:
                item.quantity_available || item.book?.quantity_available,
            },
            quantity: item.quantity,
          }));
        }

        setCartItems(cartItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching cart:", err);
        // Check if it's an authentication error
        if (err.message && err.message.includes("Token has been expired")) {
          setError("token_expired");
        } else if (
          err.message &&
          err.message.includes("Authentication required")
        ) {
          setError("authentication_required");
        } else {
          setError("Failed to load your cart. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const toggleItemSelection = (bookId) => {
    setSelectedItems((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.book.bookId));
    }
  };

  //checkout payment
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select items to checkout");
      return;
    }

    try {
      setIsCheckingOut(true);

      // Extract only the selected book IDs
      const selectedBookIds = selectedItems.map((id) => Number(id));

      // Pass selected book IDs to the API
      const orderResult = await createOrderFromCart(selectedBookIds);

      // Navigate to payment page with order ID
      if (orderResult && orderResult.order && orderResult.order.orderId) {
        navigate(`/payment/${orderResult.order.orderId}`, {
          state: {
            totalAmount: selectedItemsTotal, // Use selected items total instead of cart total
            orderId: orderResult.order.orderId,
          },
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (bookId, newQuantity) => {
    try {
      await updateCartItem(bookId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.book.bookId === bookId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast.success("Cart updated", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to update cart");
      console.error("Error updating cart:", error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (bookId) => {
    try {
      await removeCartItem(bookId);
      setCartItems((prev) =>
        prev.filter((item) => item.book.bookId !== bookId)
      );
      toast.success("Item removed from cart", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to remove item");
      console.error("Error removing item:", error);
    }
  };

  // Handle promo code application
  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setTimeout(() => {
      toast.info("Promo code not valid or expired", { autoClose: 3000 });
      setIsApplyingPromo(false);
    }, 1000);
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
            Loading your shopping cart...
          </span>

          <div className="relative w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full animate-loadingBar"></div>
          </div>

          <p className="text-stone-500 mt-5 max-w-xs text-center leading-relaxed">
            We're retrieving your cart items.
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

  // Error state
  if (error) {
    if (error === "token_expired") {
      // Token expired - user needs to sign in again
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
                    My Shopping Cart
                  </h1>
                  <p className="text-stone-500 mt-1">
                    Your selected books for checkout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Token expired state */}
          <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
            {/* Premium top accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
            <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

            {/* Premium cart icon */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
                <ShoppingCart className="text-amber-500" size={46} />
              </div>
              <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

              {/* Decorative circles */}
              <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
              <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
            </div>

            <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
              Your session has expired
            </h2>

            <p className="text-stone-600 mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
              For your security, your session has expired. Please sign in again
              to access your cart and continue shopping.
              <span className="block mt-2 italic text-amber-700 font-serif">
                Your saved items will be restored after you sign in.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
              <Link
                to="/login"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-2.5 font-medium shadow-md hover:shadow-lg group"
              >
                <LogIn
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Sign In Again</span>
                <span className="ml-1 text-amber-200 group-hover:ml-2 transition-all">
                  →
                </span>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="px-8 py-3.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow"
              >
                <LogIn size={18} />
                Clear Session & Login
              </button>
            </div>

            {/* Premium recommendation text */}
            <div className="mt-8 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
              <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
              Secure sessions protect your data
              <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
            </div>
          </div>
        </div>
      );
    }

    if (error === "authentication_required") {
      // Authentication error - user is not logged in
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
                    My Shopping Cart
                  </h1>
                  <p className="text-stone-500 mt-1">
                    Your selected books for checkout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication required state */}
          <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
            {/* Premium top accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
            <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

            {/* Cart icon background pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'%3E%3C/path%3E%3Cline x1='3' y1='6' x2='21' y2='6'%3E%3C/line%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: "60px",
              }}
            ></div>

            {/* Premium cart icon */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
                <ShoppingCart className="text-amber-500" size={46} />
              </div>
              <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

              {/* Decorative circles */}
              <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
              <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
            </div>

            <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
              Please sign in to view your cart
            </h2>

            <p className="text-stone-600 mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
              You need to be logged in to access your shopping cart. Please sign
              in to your account or create a new one to start shopping.
              <span className="block mt-2 italic text-amber-700 font-serif">
                Your selections will be waiting for you after you sign in.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
              <Link
                to="/login"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-2.5 font-medium shadow-md hover:shadow-lg group"
              >
                <LogIn
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Sign In</span>
                <span className="ml-1 text-amber-200 group-hover:ml-2 transition-all">
                  →
                </span>
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow"
              >
                <UserPlus size={18} />
                Create Account
              </Link>
            </div>

            {/* Premium recommendation text */}
            <div className="mt-8 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
              <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
              Join our community of book lovers today
              <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
            </div>
          </div>
        </div>
      );
    }

    // Other errors
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
                  My Shopping Cart
                </h1>
                <p className="text-stone-500 mt-1">
                  Your selected books for checkout
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
                  Unable to load your cart
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

  // Empty cart
  if (cartItems.length === 0) {
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
                  My Shopping Cart
                </h1>
                <p className="text-stone-500 mt-1">
                  Your selected books for checkout
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

          {/* Shopping cart icon background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'%3E%3C/path%3E%3Cline x1='3' y1='6' x2='21' y2='6'%3E%3C/line%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "60px",
            }}
          ></div>

          {/* Premium wishlist heart icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
              <ShoppingCart className="text-amber-500" size={46} />
            </div>
            <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

            {/* Decorative circles */}
            <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
            <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
          </div>

          <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
            Your shopping cart is empty
          </h2>

          <p className="text-stone-600 mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
            Looks like you haven't added any books to your cart yet. Explore our
            collection to find your next favorite read!
            <span className="block mt-2 italic text-amber-700 font-serif">
              Add books to your cart to see them here.
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AnimationStyles />
      {/* Luxurious premium header with enhanced gradient and visual elements */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-8 mb-10 shadow-md border border-amber-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-amber-100/10 rounded-full -mr-16 -mt-16 blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-300/20 to-amber-100/5 rounded-full -ml-10 -mb-10 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-amber-300/20 rounded-full blur-sm"></div>

        {/* Golden accent line */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23b45309' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        ></div>

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
                  My Shopping Cart
                  <div className="relative">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm py-1 px-3.5 rounded-full font-sans font-medium ml-1 inline-flex items-center shadow-sm">
                      {cartItems.length}
                      <span className="hidden sm:inline ml-1">
                        {cartItems.length === 1 ? "item" : "items"}
                      </span>
                    </span>
                    <span className="absolute -inset-0.5 bg-amber-300 rounded-full blur opacity-50 animate-pulse"></span>
                  </div>
                </h1>
                <ShoppingCart className="text-amber-500 w-5 h-5 ml-3 animate-pulse" />
              </div>
              <p className="text-stone-600 mt-2 flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                Selected books for checkout
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

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Cart items */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-amber-100">
            {/* Premium top accent */}
            <div className="h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            <div className="p-4 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedItems.length === cartItems.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 accent-amber-600 cursor-pointer rounded"
                  />
                  <label
                    htmlFor="select-all"
                    className="ml-2 text-stone-700 font-medium cursor-pointer select-none"
                  >
                    Select All Items
                  </label>
                </div>
              </div>
              <div className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                {selectedItems.length} of {cartItems.length} selected
              </div>
            </div>
            <div className="p-6 space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.book.bookId}
                  item={item}
                  updateQuantity={handleUpdateQuantity}
                  removeItem={handleRemoveItem}
                  isSelected={selectedItems.includes(item.book.bookId)}
                  toggleSelection={toggleItemSelection}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 sticky top-8 overflow-hidden">
            {/* Premium top accent */}
            <div className="h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            {/* Subtle corner accents */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-200 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-200 rounded-bl-xl"></div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-inner mr-3">
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
                    className="text-amber-600"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <path d="M3 6h18" />
                  </svg>
                </div>
                <h2 className="text-xl font-serif font-medium text-stone-800 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                  Order Summary
                </h2>
              </div>

              {/* Promo code */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-grow border border-amber-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-lg disabled:opacity-70 transition-colors whitespace-nowrap shadow-sm hover:shadow"
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6 bg-amber-50/30 rounded-lg p-4 border border-amber-100/70">
                {selectedItems.length > 0 ? (
                  <>
                    <div className="flex justify-between text-stone-700">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Selected items subtotal:
                      </span>
                      <span className="font-medium">
                        {selectedItemsSubtotal.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span className="flex items-center gap-2">
                        <Truck size={14} className="text-amber-600" />
                        Shipping (selected items):
                      </span>
                      <span
                        className={
                          selectedItemsShipping === 0
                            ? "text-green-600 font-medium"
                            : ""
                        }
                      >
                        {selectedItemsShipping === 0
                          ? "Free"
                          : `${selectedItemsShipping.toLocaleString(
                              "vi-VN"
                            )} VND`}
                      </span>
                    </div>
                    {selectedItemsShipping > 0 && (
                      <div className="text-xs text-amber-700 italic pl-6">
                        Free shipping on orders over 1,200,000 VND
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-stone-700">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Subtotal:
                      </span>
                      <span className="font-medium">
                        {cartSubtotal.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span className="flex items-center gap-2">
                        <Truck size={14} className="text-amber-600" />
                        Shipping:
                      </span>
                      <span
                        className={
                          shipping === 0 ? "text-green-600 font-medium" : ""
                        }
                      >
                        {shipping === 0
                          ? "Free"
                          : `${shipping.toLocaleString("vi-VN")} VND`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <div className="text-xs text-amber-700 italic pl-6">
                        Free shipping on orders over 1,200,000 VND
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between text-stone-700">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Tax:
                  </span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t border-amber-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-stone-800">
                      Total:
                    </span>
                    <div>
                      <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                        {selectedItems.length > 0
                          ? selectedItemsTotal.toLocaleString("vi-VN")
                          : cartTotal.toLocaleString("vi-VN")}{" "}
                        VND
                      </span>
                      <div className="h-px w-full bg-gradient-to-r from-amber-400 to-amber-200 mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || selectedItems.length === 0}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3.5 px-6 rounded-lg transition-colors font-medium text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Proceed to Checkout</span>
                  </>
                )}
              </button>

              {/* Payment security info */}
              <div className="mt-6">
                <div className="flex items-center justify-center text-sm text-stone-500 gap-2 mb-3">
                  <Gift size={16} className="text-amber-600" />
                  <span>Gift wrapping available at checkout</span>
                </div>

                <div className="border-t border-stone-100 pt-3 mt-3">
                  <div className="flex items-center justify-center text-sm text-stone-500 gap-1.5">
                    <ShieldCheck size={14} className="text-amber-600" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;
