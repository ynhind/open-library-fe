import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { searchBooks } from "../../utils/bookApi";
import BookCard from "./BookCard";
import { Loader } from "lucide-react";

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
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-12 w-12 text-amber-800" />
          <p className="mt-4 text-stone-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h3 className="font-serif text-xl text-stone-800 mb-2">
            No Books Found in {displayCategoryName}
          </h3>
          <p className="text-stone-600">
            There are currently no books in this category. Please check back
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-amber-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-8">
          {displayCategoryName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.bookId} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookOfCategories;
