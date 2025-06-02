import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../../utils/wishlistApi";
import { toast } from "react-toastify";

const BookCard = ({ book, className, isReloading }) => {
  const [, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  const { bookId, title, author, coverImage, price, rating, ratingCount } =
    book;

  // Check wishlist status when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const inWishlist = await isInWishlist(bookId);
        setIsFavorite(inWishlist);
      } catch (err) {
        console.error("Error checking wishlist status:", err);
      }
    };

    checkWishlistStatus();
  }, [bookId]);

  // Handle toggling wishlist
  const handleToggleWishlist = async (e) => {
    e.preventDefault();

    try {
      setIsUpdatingWishlist(true);

      if (isFavorite) {
        await removeFromWishlist(bookId);
        toast.success(`${title} removed from your wishlist!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await addToWishlist(bookId);
        toast.success(`${title} added to your wishlist!`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating wishlist:", err);
      // Check if it's an authentication error
      if (err.message && err.message.includes("Authentication required")) {
        toast.error("Please log in to manage your wishlist", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to update wishlist", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  // Create rating stars
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={14}
          className="fill-amber-500 text-amber-500"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={14} className="text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={14} className="fill-amber-500 text-amber-500" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div
      className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(217,119,6,0.12)] hover:border-amber-100 border border-transparent transition-all duration-300 ${
        className || ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isReloading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <RefreshCw className="text-amber-500 animate-spin" size={24} />
        </div>
      )}

      {/* Price tag - always visible, positioned at top-left */}
      <div className="absolute top-0 left-0 z-10">
        <div className="bg-amber-800 text-white text-sm font-medium py-1 px-3 rounded-br-lg shadow-sm whitespace-nowrap">
          {price.toLocaleString("vi-VN")} VND
        </div>
      </div>

      {/* Favorite button */}
      <button
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm ${
          isFavorite
            ? "bg-red-500/10 text-red-500"
            : "bg-black/5 text-gray-500 hover:bg-white/30"
        } transition-all duration-300`}
        onClick={handleToggleWishlist}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        disabled={isUpdatingWishlist}
      >
        <Heart size={16} className={isFavorite ? "fill-red-500" : ""} />
      </button>

      {/* Book cover */}
      <div className="relative aspect-[4/5] overflow-hidden w-full">
        <Link to={`/book/${bookId}`} className="block">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay with actions */}
          {/* Update the overlay actions in BookCard.jsx */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            {/* Stack buttons vertically for better fit */}
            <div className="flex flex-col gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {/* First row: Preview and Buy buttons */}
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-1 bg-white/90 hover:bg-white text-amber-800 py-1.5 px-2 rounded-md text-xs font-medium backdrop-blur-sm transition-colors"
                  aria-label="Preview book"
                >
                  <Eye size={12} /> Preview
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 bg-amber-500/90 hover:bg-amber-500 text-white py-1.5 px-2 rounded-md text-xs font-medium backdrop-blur-sm transition-colors"
                  aria-label={`Purchase for ${price.toLocaleString(
                    "vi-VN"
                  )} VND`}
                >
                  <ShoppingCart size={12} /> Buy
                </button>
                <button
                  className="flex items-center justify-center gap-1 bg-white/90 hover:bg-white text-amber-800 py-1.5 px-2 rounded-md text-xs font-medium backdrop-blur-sm transition-colors"
                  aria-label="Borrow book"
                >
                  <BookOpen size={12} /> Borrow
                </button>
              </div>
              {/* Second row: Borrow button */}
            </div>
          </div>
        </Link>
      </div>

      {/* Book info */}
      <div className="p-4">
        <Link to={`/book/${bookId}`} className="block">
          <h3 className="font-serif font-medium text-lg text-stone-800 hover:text-amber-700 transition-colors truncate">
            {title}
          </h3>
          <p className="text-stone-500 text-sm mb-2">{author}</p>
        </Link>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {renderRatingStars(rating)}
            </div>
            <span className="text-xs text-stone-400">({ratingCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
