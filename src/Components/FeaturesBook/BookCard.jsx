import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye, BookOpen } from "lucide-react";

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { id, title, author, coverImage, price, rating, ratingCount } = book;

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
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Price tag - always visible, positioned at top-left */}
      <div className="absolute top-0 left-0 z-10">
        <div className="bg-amber-800 text-white text-sm font-medium py-1 px-3 rounded-br-lg shadow-sm">
          ${price.toFixed(2)}
        </div>
      </div>

      {/* Favorite button */}
      <button
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm ${
          isFavorite
            ? "bg-red-500/10 text-red-500"
            : "bg-black/5 text-gray-500 hover:bg-white/30"
        } transition-all duration-300`}
        onClick={(e) => {
          e.preventDefault();
          setIsFavorite(!isFavorite);
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={16} className={isFavorite ? "fill-red-500" : ""} />
      </button>

      {/* Book cover */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={`/book/${id}`} className="block">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-amber-800 py-2 px-3 rounded-md text-xs font-medium backdrop-blur-sm transition-colors"
                aria-label="Preview book"
              >
                <Eye size={14} /> Preview
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500/90 hover:bg-amber-500 text-white py-2 px-3 rounded-md text-xs font-medium backdrop-blur-sm transition-colors"
                aria-label={`Purchase for $${price.toFixed(2)}`}
              >
                <ShoppingCart size={14} /> Buy
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-amber-800 py-2 px-3 rounded-md text-xs font-medium backdrop-blur-sm transition-colors"
                aria-label="Borrow book"
              >
                <BookOpen size={14} /> Borrow
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Book info */}
      <div className="p-4">
        <Link to={`/book/${id}`} className="block">
          <h3 className="font-serif font-medium text-lg text-stone-800 hover:text-amber-700 transition-colors truncate">
            {title}
          </h3>
          <p className="text-stone-500 text-sm mb-2">{author}</p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">{renderRatingStars(rating)}</div>
            <span className="text-xs text-stone-400">({ratingCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
