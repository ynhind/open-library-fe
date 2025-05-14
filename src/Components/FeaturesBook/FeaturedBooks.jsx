import React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import { ChevronRight, Loader, ChevronLeft } from "lucide-react";

const FeaturedBooks = ({ title, books, viewAllLink, loading, error }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount =
        direction === "left"
          ? -current.offsetWidth / 2
          : current.offsetWidth / 2;

      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
              {title}
            </h2>
          </div>
          <div className="flex justify-center py-12">
            <Loader className="animate-spin h-8 w-8 text-amber-800" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
              {title}
            </h2>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
              {title}
            </h2>
          </div>
          <p className="text-center text-stone-600">
            No books available at this time.
          </p>
        </div>
      </section>
    );
  }

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

        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-amber-50 text-amber-800"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-amber-50 text-amber-800"
          >
            <ChevronRight size={24} />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-6 scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {books.map((book) => (
              <div key={book.id} className="flex-none w-[250px]">
                <BookCard book={book} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
