import React from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import { ChevronRight } from "lucide-react";

const FeaturedBooks = ({ title, books, viewAllLink }) => {
  return (
    <section className="py-12 md:py-16 bg-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center text-amber-800 hover:text-amber-900 transition-colors"
            >
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
