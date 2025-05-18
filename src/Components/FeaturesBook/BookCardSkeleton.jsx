import React from "react";
import { Star } from "lucide-react";

const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-transparent animate-pulse">
      {/* Price tag skeleton */}
      <div className="absolute top-0 left-0 z-10">
        <div className="bg-gray-300 text-transparent h-8 w-20 py-1 px-3 rounded-br-lg">
          $0.00
        </div>
      </div>

      {/* Favorite button skeleton */}
      <div className="absolute top-3 right-3 z-20 p-2 rounded-full bg-gray-300 h-8 w-8"></div>

      {/* Book cover skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden w-full bg-gray-300"></div>

      {/* Book info skeleton */}
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
