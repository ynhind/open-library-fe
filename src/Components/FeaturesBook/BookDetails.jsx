import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById } from "../../utils/bookApi";
import { Document, Page } from "react-pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { pdfjs } from "react-pdf";

import {
  Star,
  ShoppingCart,
  BookOpen,
  ChevronLeft,
  Heart,
  Calendar,
  BookCopy,
  Hash,
  User,
  Bookmark,
  X,
} from "lucide-react";

// Set the worker directly from the import (AFTER all imports)
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef(null);
  const [isProgrammaticPageChange, setIsProgrammaticPageChange] =
    useState(false);
  const [pageInputValue, setPageInputValue] = useState(pageNumber.toString());

  const handleScroll = (e) => {
    if (!numPages) return;

    // Clear any existing timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    setIsUserScrolling(true);

    const container = e.target;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;

    // Calculate which page is most visible
    const pageHeight = scrollHeight / numPages;
    const currentPage = Math.floor(scrollTop / pageHeight) + 1;

    if (
      currentPage !== pageNumber &&
      currentPage <= numPages &&
      currentPage > 0
    ) {
      setPageNumber(currentPage);
    }

    // Set a longer timeout and store the reference
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000); // Increased to 1 second
  };

  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    setPageInputValue(pageNumber.toString());
  }, [pageNumber]);
  // Only handle programmatic scrolling for button clicks, not scroll events
  useEffect(() => {
    // Add a flag to check if this page change was from a button click
    if (
      scrollContainerRef.current &&
      numPages &&
      !isUserScrolling &&
      isProgrammaticPageChange
    ) {
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      const pageHeight = scrollHeight / numPages;
      const scrollTarget = (pageNumber - 1) * pageHeight;

      scrollContainerRef.current.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });

      // Reset the flag
      setIsProgrammaticPageChange(false);
    }
  }, [pageNumber, numPages, isUserScrolling, isProgrammaticPageChange]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const [scale, setScale] = useState(1);

  // Existing state variables...

  // Add these zoom functions
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1);
  const scrollContainerRef = useRef(null);

  // Add this to your book details render section where the Preview button is
  // Removed unused renderPreviewButton function to resolve the error

  // Add this PDF viewer component
  const renderPdfViewer = () => {
    if (!previewActive) return null;

    const previewPages = book.previewPages || 5;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl flex flex-col h-[95vh]">
          {/* Header with title and controls */}
          <div className="flex justify-between items-center p-4 border-b border-amber-100">
            <h2 className="text-xl font-serif font-bold truncate">
              {book.title} - Preview
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={zoomOut}
                  className="p-1 hover:bg-amber-100 rounded-l-md"
                  aria-label="Zoom out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <button
                  onClick={resetZoom}
                  className="p-1 hover:bg-amber-100 text-xs font-medium"
                  aria-label="Reset zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  className="p-1 hover:bg-amber-100 rounded-r-md"
                  aria-label="Zoom in"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setPreviewActive(false)}
                className="p-2 hover:bg-red-100 rounded-full flex-shrink-0"
                aria-label="Close preview"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* PDF content */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-auto p-2 flex flex-col items-center justify-center bg-gray-50 relative"
            onScroll={handleScroll}
          >
            <Document
              file={book.filePath}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-center py-10">Loading PDF...</div>}
              error={
                <div className="text-center py-10 text-red-500">
                  Failed to load PDF
                </div>
              }
              className="max-h-full"
              onPageChange={setPageNumber}
            >
              {Array.from(
                new Array(Math.min(numPages || 0, previewPages)),
                (_, index) => (
                  <div key={`page_${index + 1}`} className="mb-6">
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={Math.min(window.innerWidth * 0.85, 800) * scale}
                      className="shadow-md"
                    />
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Page {index + 1}
                    </p>
                  </div>
                )
              )}
            </Document>
          </div>
          {/* Page navigation controls */}
          <div className="flex items-center justify-center gap-4 my-4">
            <button
              onClick={() => {
                setIsProgrammaticPageChange(true);
                setPageNumber(Math.max(1, pageNumber - 1));
              }}
              disabled={pageNumber <= 1}
              className="px-2 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center">
              <span className="mr-2">Page</span>
              <input
                type="text"
                min="1"
                max={numPages || 1}
                value={pageInputValue}
                onChange={(e) => {
                  // Allow any input during editing
                  setPageInputValue(e.target.value);
                }}
                onBlur={() => {
                  // Only validate when focus leaves the input
                  const page = parseInt(pageInputValue);
                  if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
                    setPageNumber(page);
                    setIsProgrammaticPageChange(true);
                  } else {
                    // Reset to current page if invalid
                    setPageInputValue(pageNumber.toString());
                  }
                }}
                onKeyDown={(e) => {
                  // Handle Enter key
                  if (e.key === "Enter") {
                    const page = parseInt(pageInputValue);
                    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
                      setPageNumber(page);
                      setIsProgrammaticPageChange(true);
                    } else {
                      // Reset to current page if invalid
                      setPageInputValue(pageNumber.toString());
                    }
                  }
                }}
                className="w-16 border border-amber-200 rounded-md px-2 py-1 text-center"
              />
              <span className="mx-2">of {numPages || 1}</span>
            </div>

            <button
              onClick={() =>
                setPageNumber(Math.min(numPages || 1, pageNumber + 1))
              }
              disabled={pageNumber >= (numPages || 1)}
              className="px-2 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Footer with navigation */}
          <div className="border-t border-amber-100 p-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {Math.min(numPages || 0, previewPages)} of{" "}
                {numPages || 0} pages (Preview)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTop = 0;
                    }
                  }}
                  className="px-4 py-2 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                >
                  Back to Top
                </button>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-sm text-amber-800">
                This is a preview. Purchase the book to read the full content.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Use useCallback to memoize the fetch function
  const fetchBookDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Call the getBookById API endpoint
      const data = await getBookById(id);
      if (data) {
        setBook(data);
        setError(null);
      } else {
        setError("Book not found");
      }
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  // Helper function to render rating stars
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={18}
          className="fill-amber-500 text-amber-500"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={18} className="text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={18} className="fill-amber-500 text-amber-500" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={18} className="text-gray-300" />
      );
    }

    return stars;
  };

  // Calculate average rating from ratings array
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / ratings.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/30 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-amber-100/50 h-96 md:w-1/3"></div>
              <div className="p-8 md:w-2/3">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded w-32"></div>
                  <div className="h-12 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <Link
            to="/"
            className="text-amber-800 hover:underline mt-4 inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-stone-800 mb-4">Book not found</p>
          <Link to="/" className="text-amber-800 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = getAverageRating(book.ratings);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-amber-50/30 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <nav className="flex text-sm">
              <Link to="/" className="text-amber-700 hover:text-amber-900">
                Home
              </Link>
              <span className="mx-2 text-stone-500">/</span>
              {book.categories && book.categories.length > 0 && (
                <>
                  <Link
                    to={`/category/${book.categories[0]
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-amber-700 hover:text-amber-900"
                  >
                    {book.categories[0]}
                  </Link>
                  <span className="mx-2 text-stone-500">/</span>
                </>
              )}
              <span className="text-stone-500">{book.title}</span>
            </nav>
          </div>

          {/* Book Details */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Book Cover Image */}
              <div className="md:flex-shrink-0 bg-amber-100 flex items-center justify-center p-8 md:w-1/3">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-96 object-contain shadow-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300x450/amber-50/amber-800?text=No+Cover";
                  }}
                />
              </div>

              {/* Book Information */}
              <div className="p-8 md:w-2/3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-2">
                      {book.title}
                    </h1>
                    <p className="text-lg md:text-xl text-stone-600 mb-4">
                      by {book.author}
                    </p>
                  </div>
                  <button
                    className={`p-2 rounded-full ${
                      isFavorite
                        ? "bg-red-100 text-red-500"
                        : "bg-stone-100 text-stone-500"
                    } self-end md:self-auto mt-2 md:mt-0`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      size={20}
                      className={isFavorite ? "fill-red-500" : ""}
                    />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex mr-2">
                    {renderRatingStars(averageRating)}
                  </div>
                  <span className="text-stone-500">
                    ({book.ratings ? book.ratings.length : 0} reviews)
                  </span>
                </div>

                {/* Price and Buttons */}
                <div className="mb-8">
                  <p className="text-2xl font-bold text-amber-800 mb-4">
                    ${book.price?.toFixed(2)}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-md transition-colors">
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    {book.isAvailableOnline && (
                      <button
                        onClick={() => setPreviewActive(true)}
                        className="flex items-center justify-center gap-2 border border-amber-800 bg-white hover:bg-amber-50 text-amber-800 py-3 px-6 rounded-md transition-colors"
                      >
                        <BookOpen size={18} />
                        Preview
                      </button>
                    )}
                    <button className="flex items-center justify-center gap-2 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 py-3 px-6 rounded-md transition-colors">
                      <Bookmark size={18} />
                      Borrow
                    </button>
                  </div>
                </div>
                {renderPdfViewer()}

                {/* Book Details List */}
                <div className="border-t border-amber-100 pt-6">
                  <h2 className="text-xl font-medium text-stone-800 mb-4">
                    Book Details
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex items-center">
                      <dt className="flex items-center text-stone-600 mr-2">
                        <BookCopy size={16} className="mr-2" />
                        Format:
                      </dt>
                      <dd className="font-medium text-stone-800">
                        {book.format ? book.format.toLowerCase() : "Paperback"}
                      </dd>
                    </div>

                    {book?.isbn && (
                      <div className="flex items-center">
                        <dt className="flex items-center text-stone-600 mr-2">
                          <Hash size={16} className="mr-2" />
                          ISBN:
                        </dt>
                        <dd className="font-medium text-stone-800">
                          {book.isbn}
                        </dd>
                      </div>
                    )}

                    {book?.publisher && (
                      <div className="flex items-center">
                        <dt className="flex items-center text-stone-600 mr-2">
                          <User size={16} className="mr-2" />
                          Publisher:
                        </dt>
                        <dd className="font-medium text-stone-800">
                          {book.publisher}
                        </dd>
                      </div>
                    )}

                    {book?.publishDate && (
                      <div className="flex items-center">
                        <dt className="flex items-center text-stone-600 mr-2">
                          <Calendar size={16} className="mr-2" />
                          Publish Date:
                        </dt>
                        <dd className="font-medium text-stone-800">
                          {new Date(book.publishDate).toLocaleDateString()}
                        </dd>
                      </div>
                    )}

                    {book.quantity_available !== undefined && (
                      <div className="flex items-center">
                        <dt className="text-stone-600 mr-2">Available:</dt>
                        <dd className="font-medium text-stone-800">
                          {book.quantity_available > 0
                            ? `${book.quantity_available} copies`
                            : "Out of stock"}
                        </dd>
                      </div>
                    )}

                    {book.categories && book.categories.length > 0 && (
                      <div className="flex items-center col-span-2">
                        <dt className="text-stone-600 mr-2">Categories:</dt>
                        <dd className="font-medium text-stone-800">
                          {book.categories.join(", ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>

            {/* Book Description */}
            {book.description && (
              <div className="px-8 py-6 border-t border-amber-100">
                <h2 className="text-xl font-medium text-stone-800 mb-4">
                  Description
                </h2>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="px-8 py-6 border-t border-amber-100">
              <h2 className="text-xl font-medium text-stone-800 mb-6">
                Customer Reviews
              </h2>

              {book.ratings && book.ratings.length > 0 ? (
                <div className="space-y-6">
                  {book.ratings.map((review) => (
                    <div
                      key={
                        review.ratingId || review.id || Math.random().toString()
                      }
                      className="border-b border-amber-100 pb-6"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-amber-100 rounded-full h-10 w-10 flex items-center justify-center text-amber-800 font-medium mr-3">
                            {review.user && review.user.username
                              ? review.user.username.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <span className="font-medium text-stone-800">
                            {review.user
                              ? review.user.username || "Anonymous"
                              : "Anonymous"}
                          </span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-stone-600">{review.review}</p>
                      )}
                      {review.createdAt && (
                        <p className="text-xs text-stone-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-t border-amber-100">
                  <div className="w-16 h-16 mx-auto mb-4 text-amber-200">
                    <BookOpen size={64} />
                  </div>
                  <p className="text-stone-500 mb-4">
                    No reviews yet. Be the first to review this book!
                  </p>
                  <button className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-4 rounded-md transition-colors">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Related Books Section */}
          {book.categories && book.categories.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-serif font-medium text-stone-800 mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* This would be populated with related books */}
                <div className="animate-pulse bg-amber-50 h-64 rounded"></div>
                <div className="animate-pulse bg-amber-50 h-64 rounded"></div>
                <div className="animate-pulse bg-amber-50 h-64 rounded"></div>
                <div className="animate-pulse bg-amber-50 h-64 rounded"></div>
                <div className="animate-pulse bg-amber-50 h-64 rounded hidden lg:block"></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Newsletter signup */}
      <section className="bg-amber-100/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
              Stay updated with new releases
            </h2>
            <p className="text-stone-600 mb-6">
              Join our newsletter and be the first to know about new book
              arrivals
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 flex-grow border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookDetails;
