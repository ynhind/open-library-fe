import React, { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";
import { ChevronRight, Loader, ChevronLeft, RefreshCw } from "lucide-react";

const FeaturedBooks = ({
  title,
  books,
  viewAllLink,
  loading,
  error,
  reloadHandler,
}) => {
  const scrollRef = useRef(null);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadAnimation, setReloadAnimation] = useState(false);

  // Function to handle reload with animation
  const handleReload = () => {
    if (reloadHandler && !isReloading) {
      setIsReloading(true);
      setReloadAnimation(true);

      // Call the reload handler
      reloadHandler();

      // Set a timeout to reset the animation state
      setTimeout(() => {
        setReloadAnimation(false);
        setIsReloading(false);
      }, 1000);
    }
  };

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

  // Create skeleton array for loading state
  const skeletons = Array(5).fill(0);

  if (loading && !isReloading) {
    return (
      <section className="py-12 md:py-16 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
              {title}
            </h2>
          </div>

          <div className="relative">
            {/* Scroll buttons */}
            <button
              disabled
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 shadow-md text-amber-800/50 opacity-50 cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              disabled
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 shadow-md text-amber-800/50 opacity-50 cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>

            {/* Scrollable container with skeletons */}
            <div
              className="flex overflow-x-auto pb-6 gap-6 scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {skeletons.map((_, index) => (
                <div
                  key={`loading-skeleton-${index}`}
                  className="flex-none w-[250px]"
                >
                  <BookCardSkeleton />
                </div>
              ))}
            </div>
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
            {reloadHandler && (
              <button
                onClick={handleReload}
                disabled={isReloading}
                className="flex items-center text-amber-800 hover:text-amber-900 transition-colors bg-amber-100 hover:bg-amber-200 rounded-full p-2"
                aria-label="Reload books"
              >
                <RefreshCw
                  size={16}
                  className={`mr-1 ${isReloading ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Retry</span>
              </button>
            )}
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
            {reloadHandler && (
              <button
                onClick={handleReload}
                disabled={isReloading}
                className="flex items-center text-amber-800 hover:text-amber-900 transition-colors bg-amber-100 hover:bg-amber-200 rounded-full p-2"
                aria-label="Reload books"
              >
                <RefreshCw
                  size={16}
                  className={`mr-1 ${isReloading ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Reload</span>
              </button>
            )}
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
          <div className="flex items-center gap-4">
            {reloadHandler && (
              <button
                onClick={handleReload}
                disabled={isReloading}
                className={`flex items-center transition-all duration-300 ${
                  isReloading
                    ? "text-amber-500"
                    : "text-amber-800 hover:text-amber-900"
                }`}
                aria-label="Reload books"
              >
                <RefreshCw
                  size={16}
                  className={`mr-1 transition-transform duration-700 ${
                    reloadAnimation ? "animate-spin" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {isReloading ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            )}
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="flex items-center text-amber-800 hover:text-amber-900 transition-colors"
              >
                View all <ChevronRight size={16} className="ml-1" />
              </Link>
            )}
          </div>
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
            className={`flex overflow-x-auto pb-6 gap-6 scroll-smooth scrollbar-hide transition-opacity duration-300 ${
              isReloading ? "opacity-50" : "opacity-100"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isReloading
              ? // If reloading, show the current books with reloading state
                books.map((book) => (
                  <div
                    key={`reloading-${book.id}`}
                    className="flex-none w-[250px] transition-all duration-300"
                  >
                    <BookCard
                      book={book}
                      className="w-full h-full"
                      isReloading={true}
                    />
                  </div>
                ))
              : // Otherwise show the actual books
                books.map((book) => (
                  <div
                    key={book.id}
                    className="flex-none w-[250px] transition-all duration-300"
                  >
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
