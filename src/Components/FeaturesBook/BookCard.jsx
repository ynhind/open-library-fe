import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";

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
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link to={`/book/${id}`} className="block">
          <img
            src={coverImage}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </Link>
        <button
          className={`absolute top-2 right-2 p-2 bg-white/80 rounded-full transition-all duration-300 ${
            isFavorite ? "text-red-500" : "text-gray-500"
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={16} className={isFavorite ? "fill-red-500" : ""} />
        </button>
      </div>

      <div className="p-4">
        <Link to={`/book/${id}`} className="block">
          <h3 className="font-serif font-medium text-lg text-stone-800 mb-1 truncate">
            {title}
          </h3>
          <p className="text-stone-600 text-sm mb-2">{author}</p>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex mr-1">{renderRatingStars(rating)}</div>
          <span className="ml-1 text-xs text-stone-500">({ratingCount})</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-stone-800">
            ${price.toFixed(2)}
          </span>
          <button className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
