import React, { useState, useEffect } from "react";
import { getBooks } from "../../utils/bookApi";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="book-card group transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
        <Link to={`/book/${book.bookId}`}>
          <img
            src={book.coverImage}
            alt={book.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/300x450/amber-50/amber-800?text=No+Cover";
            }}
          />
          <div
            className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            } flex flex-col justify-end`}
          >
            <div className="flex gap-2 p-3">
              <button className="bg-white text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors">
                <ShoppingCart size={16} />
              </button>
              <button className="bg-white text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors">
                <Eye size={16} />
              </button>
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4 bg-white rounded-b-lg">
        <h3 className="font-serif font-medium text-stone-800 hover:text-amber-800 transition-colors truncate">
          <Link to={`/book/${book.bookId}`}>{book.title}</Link>
        </h3>
        <p className="text-stone-600 text-sm mt-1">{book.author}</p>
        <p className="text-amber-800 font-medium mt-2">
          ${book.price?.toFixed(2) || "N/A"}
        </p>
      </div>
    </div>
  );
};

const BookCollection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-800"></div>
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
            No Books Found
          </h3>
          <p className="text-stone-600">
            Our collection is currently empty. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-amber-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-8">
          Our Collection
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

export default BookCollection;
