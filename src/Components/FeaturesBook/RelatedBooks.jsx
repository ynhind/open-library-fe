import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRelatedBooks } from "../../utils/bookApi";
import { addToCart } from "../../utils/cartApi";
import { toast } from "react-toastify";
import {
  Star,
  ShoppingCart,
  BookOpen,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RelatedBookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Calculate average rating
  const averageRating =
    book.ratings && book.ratings.length > 0
      ? book.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        book.ratings.length
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAddingToCart(true);
      const bookId = parseInt(book.bookId, 10);

      const response = await addToCart({ bookId, quantity: 1 });

      if (response && response.success) {
        toast.success(`${book.title} added to cart!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        throw new Error(response?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add book to cart", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className="text-amber-400 fill-amber-400 flex-shrink-0"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative flex-shrink-0 inline-flex">
          <Star size={14} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={14}
          className="text-gray-300 flex-shrink-0"
        />
      );
    }

    return stars;
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 transform hover:-translate-y-1 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book Cover */}
      <div className="relative overflow-hidden aspect-[3/4] flex-shrink-0">
        <Link to={`/book/${book.bookId}`}>
          <img
            src={book.coverImage || "/api/placeholder/200/267"}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Overlay buttons */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          } flex flex-col justify-end p-3`}
        >
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 flex items-center justify-center gap-1 bg-white/90 hover:bg-white text-amber-800 py-1.5 px-2 rounded-md text-xs font-medium transition-colors disabled:opacity-70"
              aria-label="Add to cart"
            >
              {isAddingToCart ? (
                <div className="animate-spin h-3 w-3 border border-amber-800 border-t-transparent rounded-full" />
              ) : (
                <ShoppingCart size={12} />
              )}
              {isAddingToCart ? "Adding..." : "Add"}
            </button>
            <Link
              to={`/book/${book.bookId}`}
              className="flex-1 flex items-center justify-center gap-1 bg-amber-500/90 hover:bg-amber-500 text-white py-1.5 px-2 rounded-md text-xs font-medium transition-colors"
            >
              <BookOpen size={12} /> View
            </Link>
          </div>
        </div>

        {/* Price badge */}
        {book.price && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            {book.price.toLocaleString()}VND
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="font-medium text-stone-800 text-sm line-clamp-2 mb-2 group-hover:text-amber-800 transition-colors leading-tight min-h-[2.5rem] flex-shrink-0">
          <Link to={`/book/${book.bookId}`}>{book.title}</Link>
        </h3>

        <p className="text-stone-600 text-xs mb-2 truncate flex-shrink-0">
          by {book.author}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            {renderStars(averageRating)}
          </div>
          <span className="text-xs text-stone-500 ml-1">
            ({book.ratings?.length || 0})
          </span>
        </div>

        {/* Categories */}
        <div className="mt-auto">
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full truncate"
                >
                  {category}
                </span>
              ))}
              {book.categories.length > 2 && (
                <span className="text-xs text-stone-500">
                  +{book.categories.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RelatedBooks = ({ categories, currentBookId, limit = 8 }) => {
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!categories || !currentBookId) return;

      try {
        setLoading(true);
        setError(null);

        const books = await getRelatedBooks(categories, currentBookId, limit);

        setRelatedBooks(books);
      } catch (err) {
        console.error("Error fetching related books:", err);
        setError("Failed to load related books");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBooks();
  }, [categories, currentBookId, limit]);

  // Determine books per slide based on screen size
  const getBooksPerSlide = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1280) return 6; // xl
      if (width >= 1024) return 5; // lg
      if (width >= 768) return 4; // md
      if (width >= 640) return 3; // sm
      return 2; // default
    }
    return 4; // fallback for SSR
  };

  const [booksPerSlide, setBooksPerSlide] = useState(getBooksPerSlide());
  const totalSlides = Math.ceil(relatedBooks.length / booksPerSlide);

  // Update books per slide on window resize
  useEffect(() => {
    const handleResize = () => {
      setBooksPerSlide(getBooksPerSlide());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset current slide when booksPerSlide changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [booksPerSlide]);

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  // Get visible books for current slide
  const getVisibleBooks = () => {
    const startIndex = currentSlide * booksPerSlide;
    const endIndex = startIndex + booksPerSlide;
    return relatedBooks.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-amber-100">
        <h2 className="text-xl font-serif font-medium text-stone-800 mb-4">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-amber-50 aspect-[3/4] rounded-lg mb-3"></div>
              <div className="h-4 bg-amber-50 rounded mb-2"></div>
              <div className="h-3 bg-amber-50 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-amber-50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-amber-100">
        <h2 className="text-xl font-serif font-medium text-stone-800 mb-4">
          You May Also Like
        </h2>
        <div className="text-center py-8">
          <p className="text-stone-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-amber-800 hover:text-amber-900 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!relatedBooks || relatedBooks.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-amber-100">
        <h2 className="text-xl font-serif font-medium text-stone-800 mb-4">
          You May Also Like
        </h2>
        <div className="text-center py-8">
          <BookOpen size={48} className="mx-auto text-amber-200 mb-4" />
          <p className="text-stone-500">
            No related books found at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-amber-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-medium text-stone-800">
          You May Also Like
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">
            {relatedBooks.length} book{relatedBooks.length !== 1 ? "s" : ""}{" "}
            found
          </span>
          {/* Show navigation only if there are multiple slides */}
          {totalSlides > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                aria-label="Previous books"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                aria-label="Next books"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Books Carousel */}
      <div className="overflow-hidden">
        <div
          className="grid transition-transform duration-300 ease-in-out gap-4"
          style={{
            gridTemplateColumns: `repeat(${booksPerSlide}, minmax(0, 1fr))`,
          }}
        >
          {getVisibleBooks().map((book, index) => (
            <div
              key={book.bookId}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RelatedBookCard book={book} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination indicators and info */}
      {totalSlides > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <span className="text-sm text-stone-500">
            Page {currentSlide + 1} of {totalSlides}
          </span>
          {/* Dot indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-amber-600"
                    : "bg-amber-200 hover:bg-amber-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedBooks;
