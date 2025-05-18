import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Loader,
  AlertCircle,
  Gift,
} from "lucide-react";
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

  const shipping = cartSubtotal > 50 ? 0 : 4.99;
  const cartTotal = cartSubtotal + shipping;

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
            },
            quantity: item.quantity,
          }));
        }

        setCartItems(cartItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load your cart. Please try again.");
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

      // Extract book IDs from cart items
      const selectedBookIds = cartItems.map((item) => Number(item.book.bookId));

      // Pass selected book IDs to the API
      const orderResult = await createOrderFromCart(selectedBookIds);

      // Navigate to payment page with order ID
      if (orderResult && orderResult.order && orderResult.order.orderId) {
        navigate(`/payment/${orderResult.order.orderId}`, {
          state: {
            totalAmount: cartTotal,
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
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader size={40} className="animate-spin text-amber-700 mb-4" />
          <p className="text-stone-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg flex flex-col items-center justify-center">
          <AlertCircle size={40} className="mb-4" />
          <h2 className="font-medium text-lg mb-2">Something went wrong</h2>
          <p className="text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-16 bg-amber-50/50 rounded-xl border border-amber-100">
          <div className="bg-amber-100 p-4 rounded-full mb-4">
            <ShoppingCart size={40} className="text-amber-700" />
          </div>
          <h2 className="text-xl font-medium text-stone-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-stone-600 mb-8 text-center max-w-md">
            Looks like you haven't added any books to your cart yet. Explore our
            collection to find your next favorite read!
          </p>
          <Link
            to="/"
            className="bg-amber-800 hover:bg-amber-900 text-white py-3 px-8 rounded-md inline-block transition-colors font-medium"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        {/* <span className="text-amber-700">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span> */}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Cart items */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-amber-100">
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
              <div className="text-sm text-amber-700">
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
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 sticky top-8">
            <div className="p-6">
              <h2 className="text-xl font-serif font-bold text-stone-800 mb-6">
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-grow border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded disabled:opacity-70 transition-colors whitespace-nowrap"
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-stone-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-stone-700">
                  <span>Shipping:</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-xs text-amber-700 italic">
                    Free shipping on orders over $50
                  </div>
                )}

                <div className="flex justify-between text-stone-700">
                  <span>Tax:</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t border-amber-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg text-stone-800">
                      Total:
                    </span>
                    <span className="font-bold text-xl text-amber-800">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-md transition-colors font-medium text-center flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              <div className="mt-6 flex items-center justify-center text-sm text-stone-500 gap-2">
                <Gift size={16} />
                <span>Gift wrapping available at checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;
