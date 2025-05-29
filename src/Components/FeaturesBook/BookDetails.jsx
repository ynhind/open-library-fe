import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById } from "../../utils/bookApi";
import { Document, Page } from "react-pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { pdfjs } from "react-pdf";
import { toast } from "react-toastify";
import { addToCart } from "../../utils/cartApi.js";

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
  Plus,
  Minus,
} from "lucide-react";

// Set the worker directly from the import
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [, setIsUserScrolling] = useState(false);
  const [isAvailableOnline, setIsAvailableOnline] = useState(false);
  const [isProgrammaticPageChange, setIsProgrammaticPageChange] =
    useState(false);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [scale, setScale] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // References
  const userScrollTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleBuyNow = async () => {
    if (!book || !book.bookId) {
      toast.error("Cannot proceed with purchase: Invalid book information", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const bookId = parseInt(book.bookId, 10);

      // Add item to cart first
      await addToCart(bookId, quantity);

      // Then redirect to checkout page
      navigate("/checkout");

      toast.success("Proceeding to checkout!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error during buy now process:", error);
      toast.error(error.message || "Failed to process purchase", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAddToCart = async () => {
    if (!book || !book.bookId) {
      toast.error("Cannot add to cart: Invalid book information", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Fix this line:
      const bookId = parseInt(book.bookId, 10); // Use base 10, not quantity

      console.log("Adding to cart:", bookId);
      console.log("Quantity:", quantity);

      await addToCart(bookId, quantity);

      toast.success(`${book.title} added to your cart!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);

      // Check if it's an authentication error
      if (error.message && error.message.includes("Authentication required")) {
        toast.error(
          <div>
            Please log in to add items to your cart.{" "}
            <a
              href="/login"
              className="font-bold underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
                toast.dismiss();
              }}
            >
              Sign in
            </a>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
          }
        );
      } else {
        toast.error("Failed to add to cart. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }
  };

  // Zoom controls
  const zoomIn = useCallback(
    () => setScale((prev) => Math.min(prev + 0.2, 2.5)),
    []
  );
  const zoomOut = useCallback(
    () => setScale((prev) => Math.max(prev - 0.2, 0.5)),
    []
  );
  const resetZoom = useCallback(() => setScale(1), []);

  // Optimized scroll handler with debouncing
  // Replace your current handleScroll function with this improved version
  // Improve the handleScroll function to better calculate which page is most visible
  const handleScroll = useCallback(
    (e) => {
      if (!numPages || isProgrammaticPageChange) return;

      // Clear any existing timeout
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }

      const container = e.target;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Calculate which page is most visible in the viewport
      const pageHeight = scrollHeight / numPages;
      const viewportMiddle = scrollTop + clientHeight / 2;
      const currentVisiblePage = Math.ceil(viewportMiddle / pageHeight);

      // Only update if we're actually changing pages and not in the middle of a programmatic change
      if (
        currentVisiblePage !== pageNumber &&
        currentVisiblePage <= numPages &&
        currentVisiblePage > 0 &&
        !isProgrammaticPageChange
      ) {
        setPageNumber(currentVisiblePage);
        // Update the input value to match the current page
        setPageInputValue(currentVisiblePage.toString());
      }

      setIsUserScrolling(true);
      userScrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 150);
    },
    [numPages, pageNumber, isProgrammaticPageChange]
  );

  // Add this improved effect to ensure proper scrolling when using buttons
  useEffect(() => {
    if (scrollContainerRef.current && numPages && isProgrammaticPageChange) {
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      const pageHeight = scrollHeight / numPages;
      const scrollTarget = (pageNumber - 1) * pageHeight;

      // Scroll to the target page
      scrollContainerRef.current.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });

      // Reset the programmatic flag after a longer delay to prevent scroll handler from overriding
      const timer = setTimeout(() => {
        setIsProgrammaticPageChange(false);
      }, 600); // Increased from 300ms to 600ms

      return () => clearTimeout(timer);
    }
  }, [pageNumber, numPages, isProgrammaticPageChange]);

  // PDF document loaded successfully handler
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInputValue("1");
  }, []);

  // Calculate which pages to display in preview
  const numberOfPagesToDisplayInPreview = useMemo(() => {
    if (!book || typeof numPages !== "number") return 0;

    if (isAvailableOnline) {
      return book.previewPages && book.previewPages > 0
        ? Math.min(numPages, book.previewPages)
        : numPages;
    }

    return Math.min(numPages, 20);
  }, [book, numPages, isAvailableOnline]);

  // Handle page input change
  const handlePageInputChange = useCallback((e) => {
    setPageInputValue(e.target.value);
  }, []);

  // Handle page input submit (on blur or Enter key)
  const handlePageInputSubmit = useCallback(() => {
    const page = parseInt(pageInputValue);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
      setIsProgrammaticPageChange(true);
    } else {
      // Reset to current page if invalid
      setPageInputValue(pageNumber.toString());
    }
  }, [pageInputValue, numPages, pageNumber]);

  // Navigate to next page
  const goToNextPage = useCallback(() => {
    const newPage = Math.min(numPages || 1, pageNumber + 1);
    setPageNumber(newPage);
    setPageInputValue(newPage.toString());
    setIsProgrammaticPageChange(true);
  }, [pageNumber, numPages]);

  // Navigate to previous page
  const goToPrevPage = useCallback(() => {
    const newPage = Math.max(1, pageNumber - 1);
    setPageNumber(newPage);
    setPageInputValue(newPage.toString());
    setIsProgrammaticPageChange(true);
  }, [pageNumber]);

  // Back to top of document
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setPageNumber(1);
      setPageInputValue("1");
    }
  }, []);

  // Fetch book details with proper error handling
  const fetchBookDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getBookById(id);

      if (data) {
        setBook(data);
        setIsAvailableOnline(data.isAvailableOnline || false);
        setError(null);
      } else {
        setError("Book not found");
      }
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details. Please try again later.");
      setIsAvailableOnline(false);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  // Calculate average rating from ratings array
  const averageRating = useMemo(() => {
    if (!book?.ratings || book.ratings.length === 0) return 0;
    const sum = book.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / book.ratings.length;
  }, [book?.ratings]);

  // Helper function to render rating stars
  const renderRatingStars = useCallback((rating) => {
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
  }, []);

  // Render PDF viewer
  const renderPdfViewer = useCallback(() => {
    if (!previewActive || !book) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl flex flex-col h-[95vh]">
          {/* Header with controls */}
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
            >
              {Array.from(
                new Array(numberOfPagesToDisplayInPreview),
                (_, index) => (
                  <div key={`page_${index + 1}`} className="mb-6">
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={Math.min(window.innerWidth * 0.85, 800) * scale}
                      className="shadow-md min-h-[500px]"
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
              onClick={goToPrevPage}
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
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePageInputSubmit();
                  }
                }}
                className="w-16 border border-amber-200 rounded-md px-2 py-1 text-center"
                aria-label="Page number"
              />
              <span className="mx-2">of {numPages || 1}</span>
            </div>

            <button
              onClick={goToNextPage}
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
                Showing{" "}
                {Math.min(numPages || 0, numberOfPagesToDisplayInPreview)} of{" "}
                {numPages || 0} pages (Preview)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={scrollToTop}
                  className="px-4 py-2 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                >
                  Back to Top
                </button>
              </div>
            </div>

            {!isAvailableOnline && numPages > 20 && (
              <div className="preview-limit-message">
                <p className="text-center py-4 bg-amber-50 border-t border-amber-200">
                  This is a preview. Purchase the book to access all {numPages}{" "}
                  pages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    previewActive,
    book,
    zoomIn,
    zoomOut,
    resetZoom,
    scale,
    handleScroll,
    onDocumentLoadSuccess,
    numberOfPagesToDisplayInPreview,
    goToPrevPage,
    pageInputValue,
    handlePageInputChange,
    handlePageInputSubmit,
    numPages,
    goToNextPage,
    pageNumber,
    scrollToTop,
    isAvailableOnline,
  ]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse border border-amber-50">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-gradient-to-r from-amber-100/50 to-amber-200/30 h-96 md:w-1/3 flex items-center justify-center">
                <div className="w-56 h-72 bg-amber-50 rounded shadow-sm"></div>
              </div>
              <div className="p-8 md:w-2/3">
                <div className="h-10 bg-amber-50 rounded w-3/4 mb-6"></div>
                <div className="h-5 bg-amber-50 rounded w-1/2 mb-8"></div>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full bg-amber-50 mr-1"
                    ></div>
                  ))}
                </div>
                <div className="h-8 bg-amber-50 rounded w-32 mb-8"></div>
                <div className="flex gap-4 mb-8">
                  <div className="h-12 bg-amber-50 rounded-lg w-36"></div>
                  <div className="h-12 bg-amber-50 rounded-lg w-36"></div>
                  <div className="h-12 bg-amber-50 rounded-lg w-36"></div>
                </div>
                <div className="h-px bg-amber-100 w-full mb-6"></div>
                <div className="h-7 bg-amber-50 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 bg-amber-50 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-amber-100">
              <div className="h-7 bg-amber-50 rounded w-36 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-amber-50 rounded w-full"></div>
                <div className="h-4 bg-amber-50 rounded w-full"></div>
                <div className="h-4 bg-amber-50 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 text-red-700 p-8 rounded-lg max-w-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mr-4">
              <X size={24} />
            </div>
            <h2 className="text-2xl font-serif font-medium">Error</h2>
          </div>
          <p className="mb-6 leading-relaxed">{error}</p>
          <Link
            to="/"
            className="text-amber-800 hover:text-amber-900 font-medium hover:underline mt-4 inline-flex items-center transition-all duration-300"
          >
            <ChevronLeft size={18} className="mr-1" />
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // No book found state
  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 flex items-center justify-center p-1">
        <div className="text-center bg-white rounded-xl shadow-md p-5 max-w-md border border-amber-100 transform transition-all duration-300 hover:shadow-lg">
          <div className="w-24 h-24 mx-auto mb-6 text-amber-200 bg-amber-50 rounded-full flex items-center justify-center">
            <BookOpen size={48} className="text-amber-800/70" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">
            Book not found
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            The book you're looking for might have been removed or doesn't
            exist.
          </p>
          <Link
            to="/"
            className="bg-amber-800 hover:bg-amber-900 text-white py-3 px-8 rounded-lg transition-all duration-300 inline-block shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 py-10">
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6">
          {/* Breadcrumb - moved to top with more compact design */}
          <div className="mb-4 flex justify-between items-center bg-white/70 px-3 py-2 rounded shadow-sm border border-amber-50">
            <nav className="flex flex-wrap text-xs md:text-sm items-center">
              <Link
                to="/"
                className="text-amber-700 hover:text-amber-900 transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
              <span className="mx-1 text-stone-500">/</span>
              {book.categories && book.categories.length > 0 && (
                <>
                  <Link
                    to={`/category/${book.categories[0]
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-amber-700 hover:text-amber-900 transition-colors duration-200"
                  >
                    {book.categories[0]}
                  </Link>
                  <span className="mx-1 text-stone-500">/</span>
                </>
              )}
              <span className="text-stone-500 truncate max-w-[120px] sm:max-w-xs md:max-w-sm">
                {book.title}
              </span>
            </nav>
            <Link
              to="/"
              className="inline-flex items-center text-amber-800 hover:text-amber-900 text-xs md:text-sm"
            >
              <ChevronLeft size={14} />
              <span className="ml-1">Back</span>
            </Link>
          </div>

          {/* Book Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100 transition-all duration-300 hover:shadow-xl">
            <div className="md:flex">
              {/* Book Cover Image with larger size and Buy Now button */}
              <div className="md:flex-shrink-0 bg-gradient-to-br from-amber-100 to-amber-50 flex flex-col items-center justify-center p-4 md:p-6 md:w-1/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#f5d0a9_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-[26rem] w-auto object-contain shadow-xl rounded-lg transform transition-all duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300x450/amber-50/amber-800?text=No+Cover";
                  }}
                />
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 mt-6 w-full"
                  aria-label={`Buy ${book.title} now`}
                >
                  <span className="animate-pulse">🔥</span>
                  Buy Now
                </button>
              </div>

              {/* Book Information with improved layout */}
              <div className="p-6 md:p-8 md:w-2/3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1 pr-4">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-stone-800 mb-2 leading-tight line-clamp-3">
                      {book.title}
                    </h1>
                    <p className="text-base md:text-lg text-stone-600 mb-4 flex items-center">
                      by{" "}
                      <span className="font-medium ml-2 text-amber-800">
                        {book.author}
                      </span>
                    </p>
                  </div>
                  <button
                    className={`p-3 rounded-full ${
                      isFavorite
                        ? "bg-red-100 text-red-500 shadow-md"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    } self-end md:self-auto mt-2 md:mt-0 transition-all duration-300`}
                    onClick={() => setIsFavorite(!isFavorite)}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      size={22}
                      className={`${isFavorite ? "fill-red-500" : ""} ${
                        isFavorite ? "animate-pulse" : ""
                      } transition-all`}
                    />
                  </button>
                </div>
                {/* Rating with enhanced visual */}
                <div className="flex items-center mb-6 bg-amber-50/50 p-3 rounded-lg">
                  <div className="flex mr-2">
                    {renderRatingStars(averageRating)}
                  </div>
                  <span className="text-stone-500 ml-1">
                    ({book.ratings ? book.ratings.length : 0} reviews)
                  </span>
                  {averageRating > 0 && (
                    <span className="ml-2 text-amber-800 font-medium bg-amber-100 px-2 py-0.5 rounded-md text-sm">
                      {averageRating.toFixed(1)}/5
                    </span>
                  )}
                </div>
                {/* Price and Buttons with improved styling */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <p className="text-3xl font-bold text-amber-800 flex items-baseline">
                      ${book.price?.toFixed(2)}
                      {book.originalPrice &&
                        book.originalPrice > book.price && (
                          <span className="text-lg text-stone-500 line-through ml-2">
                            ${book.originalPrice.toFixed(2)}
                          </span>
                        )}
                    </p>
                    {book.quantity_available !== undefined && (
                      <span
                        className={`ml-auto text-sm px-3 py-1 rounded-full ${
                          book.quantity_available > 10
                            ? "bg-green-100 text-green-800"
                            : book.quantity_available > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.quantity_available > 10
                          ? "In Stock"
                          : book.quantity_available > 0
                          ? `Only ${book.quantity_available} left`
                          : "Out of stock"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                      aria-label={`Add ${book.title} to cart`}
                    >
                      <ShoppingCart size={18} className="animate-bounce" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setPreviewActive(true)}
                      className="flex items-center justify-center gap-2 border-2 border-amber-200 bg-white hover:bg-amber-50 text-amber-800 py-3 px-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow"
                      aria-label={`Preview ${book.title}`}
                    >
                      <BookOpen size={18} />
                      {isAvailableOnline ? "Preview" : "Preview (Limited)"}
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 border-2 border-stone-300 bg-white hover:bg-stone-50 text-stone-700 py-3 px-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow"
                      aria-label={`Borrow ${book.title}`}
                    >
                      <Bookmark size={18} />
                      Borrow
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-lg">
                    <span className="text-stone-700 font-medium">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-12 text-center font-medium text-amber-900">
                        {quantity}
                      </span>

                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Book Details List with improved styling */}
                <div className="border-t border-amber-100 pt-6">
                  <h2 className="text-xl font-serif font-medium text-stone-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Book Details
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 bg-amber-50/50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <dt className="flex items-center text-stone-600 mr-2">
                        <BookCopy size={16} className="mr-2 text-amber-700" />
                        Format:
                      </dt>
                      <dd className="font-medium text-stone-800">
                        {book.format ? book.format.toLowerCase() : "Paperback"}
                      </dd>
                    </div>

                    {book?.isbn && (
                      <div className="flex items-center">
                        <dt className="flex items-center text-stone-600 mr-2">
                          <Hash size={16} className="mr-2 text-amber-700" />
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
                          <User size={16} className="mr-2 text-amber-700" />
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
                          <Calendar size={16} className="mr-2 text-amber-700" />
                          Published:
                        </dt>
                        <dd className="font-medium text-stone-800">
                          {new Date(book.publishDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </dd>
                      </div>
                    )}

                    {book.quantity_available !== undefined && (
                      <div className="flex items-center">
                        <dt className="flex items-center text-stone-600 mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-amber-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                          Availability:
                        </dt>
                        <dd
                          className={`font-medium ${
                            book.quantity_available > 0
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {book.quantity_available > 0
                            ? `${book.quantity_available} copies`
                            : "Out of stock"}
                        </dd>
                      </div>
                    )}

                    {book.categories && book.categories.length > 0 && (
                      <div className="flex flex-wrap items-start col-span-2">
                        <dt className="flex items-center text-stone-600 mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-amber-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          Categories:
                        </dt>
                        <dd className="font-medium">
                          <div className="flex flex-wrap gap-2">
                            {book.categories.map((category, index) => (
                              <Link
                                key={index}
                                to={`/category/${category
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm px-3 py-1 rounded-full transition-colors"
                              >
                                {category}
                              </Link>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>{" "}
              </div>
            </div>

            {/* Book Description with improved styling */}
            {book.description && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8 border border-amber-100 transition-all duration-300 hover:shadow-lg">
                <div className="px-8 py-6">
                  <h2 className="text-xl font-serif font-medium text-stone-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    Description
                  </h2>
                  <div className="prose prose-amber prose-stone max-w-none">
                    <p className="text-stone-600 leading-relaxed whitespace-pre-line bg-amber-50/30 p-4 rounded-lg border-l-4 border-amber-200">
                      {book.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section with improved styling */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8 border border-amber-100 transition-all duration-300 hover:shadow-lg">
              <div className="px-8 py-6">
                <h2 className="text-xl font-serif font-medium text-stone-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-amber-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Customer Reviews
                  {averageRating > 0 && (
                    <span className="ml-2 text-amber-800 font-medium bg-amber-100 px-2 py-1 rounded-full text-sm">
                      {averageRating.toFixed(1)}/5 (
                      {book.ratings ? book.ratings.length : 0})
                    </span>
                  )}
                </h2>

                {book.ratings && book.ratings.length > 0 ? (
                  <div className="space-y-6 divide-y divide-amber-100">
                    {book.ratings.map((review, index) => (
                      <div
                        key={
                          review.ratingId ||
                          review.id ||
                          Math.random().toString()
                        }
                        className={`${index > 0 ? "pt-6" : ""} ${
                          index !== book.ratings.length - 1 ? "pb-6" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full h-12 w-12 flex items-center justify-center text-amber-800 font-medium mr-3 shadow-sm">
                              {review.user && review.user.username
                                ? review.user.username.charAt(0).toUpperCase()
                                : "?"}
                            </div>
                            <div>
                              <span className="font-medium text-stone-800 block">
                                {review.user
                                  ? review.user.username || "Anonymous"
                                  : "Anonymous"}
                              </span>
                              {review.createdAt && (
                                <span className="text-xs text-stone-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
                            <div className="flex mr-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? "fill-amber-500 text-amber-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-amber-800">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        {review.review && (
                          <div className="bg-amber-50/30 p-4 rounded-lg">
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                              {review.review}
                            </p>
                          </div>
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

      {/* Render PDF viewer if preview is active */}
      {renderPdfViewer()}
    </div>
  );
};

export default BookDetails;
