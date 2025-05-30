// src/Components/Cart/MiniCart.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { getCartItems } from "../../utils/bookApi";

const MiniCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isOpen) {
        try {
          setLoading(true);
          const items = await getCartItems();
          setCartItems(items);
        } catch (error) {
          console.error("Error fetching cart items", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCartItems();
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Cart Icon & Counter Badge */}
      <button
        className="relative p-2 text-amber-800 hover:text-amber-900"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open shopping cart"
      >
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-amber-100">
            <h3 className="font-medium">Your Cart ({itemCount})</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : cartItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="divide-y divide-amber-100">
                  {cartItems.map((item) => (
                    <div key={item.book.bookId} className="p-3 flex gap-3">
                      {/* Book Image */}
                      <div className="w-12 h-16 bg-amber-50 flex-shrink-0">
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/120x160/amber-50/amber-800?text=No+Cover";
                          }}
                        />
                      </div>

                      {/* Book Info */}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {item.book.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.book.author}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-amber-700 text-sm">
                            {item.book.price.toLocaleString("vi-VN")} VND
                          </span>
                          <span className="text-xs text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="p-3 bg-amber-50 border-t border-amber-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-amber-800">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-amber-800 hover:bg-amber-900 text-white text-center py-2 rounded transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
