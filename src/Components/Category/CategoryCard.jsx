import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category, icon, bookCount }) => {
  return (
    <Link
      to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-lg border border-amber-100/80 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300/0 via-amber-400 to-amber-300/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

      <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
        <div className="text-amber-800">{icon}</div>
      </div>

      <h3 className="font-serif text-lg font-medium text-stone-800 mb-1 group-hover:text-amber-800 transition-colors">
        {category}
      </h3>

      <p className="text-sm text-stone-500 mb-3">
        {bookCount} {bookCount === 1 ? "book" : "books"}
      </p>

      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center text-xs font-medium text-amber-800">
        Explore{" "}
        <ArrowRight
          size={12}
          className="ml-1 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </Link>
  );
};

export default CategoryCard;
