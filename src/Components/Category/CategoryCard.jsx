import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category, icon, bookCount }) => {
  return (
    <Link
      to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
    >
      <div className="transform group-hover:scale-110 transition-transform duration-300 text-amber-800">
        {icon}
      </div>
      <h3 className="font-serif text-lg text-stone-800 mb-1">{category}</h3>
      <p className="text-sm text-stone-500">{bookCount} books</p>
    </Link>
  );
};

export default CategoryCard;
