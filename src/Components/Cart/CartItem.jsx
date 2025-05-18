import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";

const CartItem = ({
  item,
  updateQuantity,
  removeItem,
  isSelected,
  toggleSelection,
}) => {
  if (!item || !item.book) {
    return null;
  }

  const { book, quantity } = item;

  // Calculate subtotal for this item
  const subtotal = book.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center border-b border-amber-100 py-4 gap-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`item-${book.bookId}`}
          checked={isSelected}
          onChange={() => toggleSelection(book.bookId)}
          className="w-5 h-5 accent-amber-600 cursor-pointer rounded"
        />
        <label htmlFor={`item-${book.bookId}`} className="sr-only">
          Select {book.title}
        </label>
      </div>
      {/* Book image */}
      <div className="flex-shrink-0 w-24 h-32 bg-amber-50 flex items-center justify-center rounded overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/200x300/amber-50/amber-800?text=No+Cover";
          }}
        />
      </div>

      {/* Book information */}
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-lg text-stone-800 truncate">
          {book.title}
        </h3>
        <p className="text-stone-600">{book.author}</p>
        <p className="text-amber-700 font-medium mt-1">
          ${book.price?.toFixed(2)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={() =>
            quantity > 1 && updateQuantity(book.bookId, quantity - 1)
          }
          disabled={quantity <= 1}
          className="p-1 rounded border border-amber-200 hover:bg-amber-100 disabled:opacity-50 disabled:hover:bg-transparent"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        <span className="w-10 text-center">{quantity}</span>

        <button
          onClick={() => updateQuantity(book.bookId, quantity + 1)}
          className="p-1 rounded border border-amber-200 hover:bg-amber-100"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right sm:w-24">
        <div className="font-semibold text-stone-800">
          ${subtotal.toFixed(2)}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(book.bookId)}
        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
        aria-label={`Remove ${book.title} from cart`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
