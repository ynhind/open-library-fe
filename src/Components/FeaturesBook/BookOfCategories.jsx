import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { searchBooks } from "../../utils/bookApi";
import BookCard from "./BookCard";
import { Loader, BookOpen, Search, ChevronRight, Library } from "lucide-react";

const BookOfCategories = () => {
  const { category } = useParams(); // Get category from URL parameter
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format category slug back to readable name
  const formatCategoryName = (slug) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconProps = { size: 24, className: "text-amber-600" };

    switch (categoryName.toLowerCase()) {
      case "fiction":
        return <BookOpen {...iconProps} />;
      case "non-fiction":
      case "nonfiction":
        return <Library {...iconProps} />;
      case "mystery":
      case "thriller":
        return <Search {...iconProps} />;
      default:
        return <BookOpen {...iconProps} />;
    }
  };

  // Get category description based on category name
  const getCategoryDescription = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "fiction":
        return "Immerse yourself in captivating stories and imaginative worlds";
      case "non-fiction":
      case "nonfiction":
        return "Discover knowledge, insights, and real-world perspectives";
      case "mystery":
        return "Unravel puzzles and dive into suspenseful narratives";
      case "thriller":
        return "Experience heart-pounding adventures and edge-of-your-seat excitement";
      case "romance":
        return "Explore tales of love, passion, and heartwarming connections";
      case "science fiction":
      case "sci-fi":
        return "Journey through futuristic worlds and technological wonders";
      case "fantasy":
        return "Enter magical realms filled with wonder and enchantment";
      case "biography":
        return "Learn from the remarkable lives of extraordinary people";
      case "history":
        return "Journey through time and discover the stories that shaped our world";
      default:
        return `Explore our carefully curated collection of ${categoryName.toLowerCase()} books`;
    }
  };

  const displayCategoryName = formatCategoryName(category);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        setLoading(true);
        // Use the searchBooks function with the category as search parameter
        const data = await searchBooks({
          categories: [displayCategoryName], // API expects category names, not slugs
        });
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching books by category:", err);
        setError(
          "Failed to load books in this category. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByCategory();
  }, [category, displayCategoryName]);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 bg-amber-200/60 rounded-lg animate-pulse"></div>
              <div className="h-8 bg-amber-200/60 rounded-lg animate-pulse w-64"></div>
            </div>
            <div className="h-4 bg-stone-200/60 rounded animate-pulse w-96 max-w-full"></div>
          </div>

          {/* Loading Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-amber-100/50 p-4 animate-pulse"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "1.5s",
                }}
              >
                {/* Book Cover Skeleton */}
                <div className="w-full h-64 bg-gradient-to-br from-amber-100/70 to-orange-100/50 rounded-lg mb-4"></div>

                {/* Title Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-stone-200/70 rounded w-full"></div>
                  <div className="h-4 bg-stone-200/70 rounded w-3/4"></div>
                </div>

                {/* Author Skeleton */}
                <div className="h-3 bg-stone-200/60 rounded w-1/2 mt-3"></div>

                {/* Price Skeleton */}
                <div className="h-5 bg-amber-200/60 rounded w-20 mt-4"></div>
              </div>
            ))}
          </div>

          {/* Loading Animation Center */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-200/50">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Loader className="animate-spin h-12 w-12 text-amber-600" />
                  <div className="absolute inset-0 rounded-full border-2 border-amber-200/30 animate-pulse"></div>
                </div>
                <p className="mt-4 text-stone-700 font-medium">
                  Discovering amazing books...
                </p>
                <p className="text-stone-500 text-sm mt-1">
                  in {displayCategoryName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-red-50/80 via-orange-50/50 to-yellow-50/60 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-red-200/50 p-8 md:p-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-4">
                  Oops! Something went wrong
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium mb-1">Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200/50 p-8 md:p-12">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  {getCategoryIcon(displayCategoryName)}
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                  No Books Found in {displayCategoryName}
                </h3>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  We're currently building our collection in this category.
                  Check back soon for new additions, or explore our other
                  categories!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.history.back()}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Go Back
                  </button>
                  <button
                    onClick={() => (window.location.href = "/categories")}
                    className="bg-white hover:bg-amber-50 text-amber-700 font-medium py-3 px-6 rounded-lg border border-amber-200 hover:border-amber-300 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Library className="w-4 h-4" />
                    Browse Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Category Header */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                {getCategoryIcon(displayCategoryName)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">
                  {displayCategoryName}
                </h1>
                <p className="text-stone-600 text-lg leading-relaxed">
                  {getCategoryDescription(displayCategoryName)}
                </p>
              </div>
            </div>

            {/* Books Count and Filter Info */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-100">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Library className="w-4 h-4" />
                <span>
                  {books.length} book{books.length !== 1 ? "s" : ""} found
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
                <BookOpen className="w-4 h-4" />
                <span>Category Collection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book, index) => (
            <div
              key={book.bookId}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
              }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* Category Stats Footer */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-amber-100 rounded-full mb-3">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">
                Quality Selection
              </h3>
              <p className="text-stone-600 text-sm">
                Carefully curated books for every reader
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">
                Easy Discovery
              </h3>
              <p className="text-stone-600 text-sm">
                Find your next favorite read effortlessly
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-100 rounded-full mb-3">
                <Library className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">
                Diverse Collection
              </h3>
              <p className="text-stone-600 text-sm">
                Books across all genres and interests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default BookOfCategories;
