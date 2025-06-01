import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById, addRating } from "../../utils/bookApi";
import { Document, Page } from "react-pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { pdfjs } from "react-pdf";

import ScrollIndicator from "../UI/ScrollIndicator";
import PageCounter from "../UI/PageCounter";

import { toast } from "react-toastify";
import { addToCart } from "../../utils/cartApi.js";
import { buyNow } from "../../utils/orderApi.js";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../../utils/wishlistApi.js";
import RelatedBooks from "./RelatedBooks";

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
  Check,
  ShoppingBag,
  Zap,
  MessageSquare,
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // References
  const userScrollTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [showCartModal, setShowCartModal] = useState(false);

  const handleBuyNow = async () => {
    if (!book || !book.bookId) {
      toast.error("Cannot process purchase: Invalid book information", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsBuyingNow(true);
      const bookId = parseInt(book.bookId, 10);

      const response = await buyNow({ bookId, quantity });

      if (response && response.success && response.order) {
        navigate(`/payment/${response.order.orderId}`, {
          state: {
            totalAmount: book.price * quantity,
            orderId: response.order.orderId,
          },
        });

        toast.success("Proceeding to checkout!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        throw new Error("Failed to process purchase");
      }
    } catch (error) {
      console.error("Error during buy now process:", error);

      // Check if it's an authentication error
      if (error.message && error.message.includes("Authentication required")) {
        toast.error(
          <div>
            Please log in to make a purchase.{" "}
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
        toast.error(error.message || "Failed to process purchase", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsBuyingNow(false);
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
      setShowCartModal(true);
      setTimeout(() => {
        setShowCartModal(false);
      }, 5000); // Close the modal after 3 seconds

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
        setShowCartModal(false); // Don't show the cart modal for authentication errors
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

  // Handle submitting a review
  const handleSubmitReview = async () => {
    try {
      if (!book || !book.bookId) {
        toast.error("Cannot submit review: Invalid book information");
        return;
      }

      setIsSubmittingReview(true);

      // Get user ID from localStorage or other auth state management
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to submit a review");
        navigate("/login");
        return;
      }

      // Parse JWT to get userId (simple approach - in production you might want a more robust solution)
      let userId;
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        userId = tokenData.userId;

        if (!userId) {
          toast.error("User identification failed. Please log in again.");
          return;
        }
      } catch (error) {
        console.error("Error parsing JWT token:", error);
        toast.error("Authentication error. Please log in again.");
        return;
      }

      const ratingData = {
        userId,
        newRating: userRating,
        review: userReview,
      };

      console.log(
        "Submitting review for book:",
        book.title,
        "with ID:",
        book.bookId
      );
      console.log("Rating data:", ratingData);

      try {
        await addRating(book.bookId, ratingData);
        console.log(ratingData);
        // Refresh book details to show the new review
        await fetchBookDetails();

        // Reset form and close modal
        setUserRating(5);
        setUserReview("");
        setShowReviewModal(false);

        toast.success("Your review has been submitted!");
      } catch (error) {
        console.error("Detailed rating error:", error);
        throw error; // Re-throw to be caught by the outer catch block
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.message || "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Calculate which pages to display in preview (moved before handleScroll)
  const numberOfPagesToDisplayInPreview = useMemo(() => {
    if (!book || typeof numPages !== "number") return 0;

    if (isAvailableOnline) {
      return book.previewPages && book.previewPages > 0
        ? Math.min(numPages, book.previewPages)
        : numPages;
    }

    return Math.min(numPages, 20);
  }, [book, numPages, isAvailableOnline]);

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
  const handleScroll = useCallback(
    (e) => {
      if (!numPages || isProgrammaticPageChange) return;

      // Clear any existing timeout
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }

      setIsUserScrolling(true);

      // Debounce the page calculation to avoid frequent updates
      userScrollTimeoutRef.current = setTimeout(() => {
        const container = e.target;

        // Get all page elements and find which one is most visible
        const pageElements = container.querySelectorAll("[data-page-number]");
        let mostVisiblePage = 1;
        let maxVisibleArea = 0;

        pageElements.forEach((pageElement) => {
          const pageRect = pageElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Calculate how much of the page is visible in the viewport
          const visibleTop = Math.max(pageRect.top, containerRect.top);
          const visibleBottom = Math.min(pageRect.bottom, containerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            mostVisiblePage = parseInt(
              pageElement.getAttribute("data-page-number")
            );
          }
        });

        // Calculate scroll progress for the scroll indicator
        if (container.scrollHeight > container.clientHeight) {
          const scrollableHeight =
            container.scrollHeight - container.clientHeight;
          const scrollProgress = Math.min(
            100,
            Math.max(
              0,
              Math.round((container.scrollTop / scrollableHeight) * 100)
            )
          );
          setScrollProgress(scrollProgress);
        }

        // Only update if we're actually changing pages and not in the middle of a programmatic change
        if (
          mostVisiblePage !== pageNumber &&
          mostVisiblePage <= numberOfPagesToDisplayInPreview &&
          mostVisiblePage > 0 &&
          !isProgrammaticPageChange &&
          maxVisibleArea > 100 // Only update if there's significant visible area
        ) {
          setPageNumber(mostVisiblePage);
          setPageInputValue(mostVisiblePage.toString());
        }

        setIsUserScrolling(false);
      }, 300); // Increased debounce time
    },
    [
      numPages,
      pageNumber,
      isProgrammaticPageChange,
      numberOfPagesToDisplayInPreview,
    ]
  );

  // Add this improved effect to ensure proper scrolling when using buttons
  useEffect(() => {
    if (scrollContainerRef.current && numPages && isProgrammaticPageChange) {
      // Find the specific page element to scroll to
      const targetPageElement = scrollContainerRef.current.querySelector(
        `[data-page-number="${pageNumber}"]`
      );

      if (targetPageElement) {
        // Scroll to the target page element
        targetPageElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Reset the programmatic flag after a longer delay to prevent scroll handler from overriding
      const timer = setTimeout(() => {
        setIsProgrammaticPageChange(false);
      }, 1000); // Increased from 600ms to 1000ms

      return () => clearTimeout(timer);
    }
  }, [pageNumber, numPages, isProgrammaticPageChange]);

  // PDF document loaded successfully handler
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInputValue("1");
  }, []);

  // Check wishlist status
  // const checkWishlistStatus = useCallback(async () => {
  //   try {
  //     if (book && book.bookId) {
  //       const inWishlist = await isInWishlist(book.bookId);
  //       setIsFavorite(inWishlist);
  //     }
  //   } catch (error) {
  //     console.error("Error checking wishlist status:", error);
  //   }
  // }, [book]);

  // Handle toggling wishlist status
  const handleToggleWishlist = async () => {
    try {
      if (!book || !book.bookId) {
        toast.error("Cannot update wishlist: Invalid book information", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (isFavorite) {
        await removeFromWishlist(book.bookId);
        setIsFavorite(false);
        toast.success(`${book.title} removed from your wishlist!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await addToWishlist(parseInt(book.bookId, 10));
        setIsFavorite(true);
        toast.success(`${book.title} added to your wishlist!`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);

      // Handle authentication error
      if (error.message && error.message.includes("Authentication required")) {
        toast.error(
          <div>
            Please log in to manage your wishlist.{" "}
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
        toast.error("Failed to update wishlist. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Handle page input change
  const handlePageInputChange = useCallback((e) => {
    setPageInputValue(e.target.value);
  }, []);

  // Handle page input submit (on blur or Enter key)
  const handlePageInputSubmit = useCallback(() => {
    const page = parseInt(pageInputValue);
    const maxPage = Math.min(numPages || 1, numberOfPagesToDisplayInPreview);

    if (!isNaN(page) && page >= 1 && page <= maxPage) {
      setPageNumber(page);
      setIsProgrammaticPageChange(true);
    } else {
      // Reset to current page if invalid
      setPageInputValue(pageNumber.toString());
    }
  }, [pageInputValue, numPages, pageNumber, numberOfPagesToDisplayInPreview]);

  // Navigate to next page
  const goToNextPage = useCallback(() => {
    const maxPage = Math.min(numPages || 1, numberOfPagesToDisplayInPreview);
    const newPage = Math.min(maxPage, pageNumber + 1);
    setPageNumber(newPage);
    setPageInputValue(newPage.toString());
    setIsProgrammaticPageChange(true);
  }, [pageNumber, numPages, numberOfPagesToDisplayInPreview]);

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

        // Log the ratings data for debugging
        if (data.ratings && data.ratings.length > 0) {
          console.log("Book ratings data:", data.ratings);
        } else {
          console.log("No ratings found for this book");
        }
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
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookById(id);
        setBook(data);
        // Use the isAvailableOnline field from the API, not just pdfUrl
        setIsAvailableOnline(data?.isAvailableOnline || false);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err.message || "Error fetching book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Check wishlist status when book is loaded
  useEffect(() => {
    if (book?.bookId) {
      const checkWishlistStatus = async () => {
        try {
          const inWishlist = await isInWishlist(book.bookId);
          setIsFavorite(inWishlist);
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        }
      };

      checkWishlistStatus();
    }
  }, [book]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      setBook(null);
      setLoading(true);
      setError(null);
      setIsFavorite(false);
      setPreviewActive(false);
      setNumPages(null);
      setPageNumber(1);
      setIsUserScrolling(false);
      setIsAvailableOnline(false);
      setIsProgrammaticPageChange(false);
      setPageInputValue("1");
      setScale(1);
      setQuantity(1);
      setIsBuyingNow(false);
      setShowReviewModal(false);
      setUserRating(5);
      setUserReview("");
      setIsSubmittingReview(false);
    };
  }, []);

  // Calculate average rating from ratings array
  const averageRating = useMemo(() => {
    if (!book?.ratings || book.ratings.length === 0) return 0;
    const sum = book.ratings.reduce(
      (acc, curr) => acc + (curr.rating || curr.score || 0),
      0
    );
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

  // Handle window resize for mobile orientation changes
  useEffect(() => {
    const handleResize = () => {
      // Force re-render of PDF viewer on orientation change
      if (previewActive) {
        // Debounce resize events
        const resizeTimer = setTimeout(() => {
          // Trigger a small scale change to force re-render
          setScale((prev) => prev);
        }, 300);

        return () => clearTimeout(resizeTimer);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [previewActive]);

  // Mobile-responsive PDF page width calculation
  const calculatePdfWidth = useCallback(() => {
    const screenWidth = window.innerWidth;

    // Mobile-first responsive width calculation
    if (screenWidth < 640) {
      // sm breakpoint
      return Math.min(screenWidth - 32, 350) * scale; // 16px padding on each side
    } else if (screenWidth < 768) {
      // md breakpoint
      return Math.min(screenWidth * 0.9, 500) * scale;
    } else if (screenWidth < 1024) {
      // lg breakpoint
      return Math.min(screenWidth * 0.8, 650) * scale;
    } else {
      return Math.min(screenWidth * 0.7, 800) * scale; // Desktop
    }
  }, [scale]);

  // Render PDF viewer
  const renderPdfViewer = useCallback(() => {
    if (!previewActive || !book) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4"
        onClick={(e) => {
          // Close preview when clicking outside the PDF container
          if (e.target === e.currentTarget) {
            setPreviewActive(false);
          }
        }}
      >
        {" "}
        <div className="bg-white rounded-lg w-full h-full sm:h-[98vh] md:h-[95vh] sm:max-w-sm md:max-w-3xl lg:max-w-5xl flex flex-col">
          {/* Header with controls - Mobile optimized */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-2 sm:p-4 border-b border-amber-100 gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-serif font-bold truncate w-full sm:w-auto text-center sm:text-left">
              {book.title} - Preview
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              {/* Modern zoom controls with premium styling */}
              <div className="flex bg-gradient-to-r from-stone-50 to-amber-50 rounded-xl shadow-sm border border-amber-100/50 overflow-hidden">
                <button
                  onClick={zoomOut}
                  className="px-3 py-2 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-50 transition-all duration-200 touch-manipulation text-amber-700 hover:text-amber-800"
                  aria-label="Zoom out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                <div className="w-px bg-amber-200/60"></div>
                <button
                  onClick={resetZoom}
                  className="px-4 py-2 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-50 text-xs font-medium min-w-[70px] transition-all duration-200 touch-manipulation text-amber-700 hover:text-amber-800"
                  aria-label="Reset zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <div className="w-px bg-amber-200/60"></div>
                <button
                  onClick={zoomIn}
                  className="px-3 py-2 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-50 transition-all duration-200 touch-manipulation text-amber-700 hover:text-amber-800"
                  aria-label="Zoom in"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                className="p-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 touch-manipulation text-stone-500 hover:shadow-sm border border-transparent hover:border-red-100 pdf-close-button-mobile"
                aria-label="Close preview"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* PDF content - Mobile optimized */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-auto p-1 sm:p-2 flex flex-col items-center justify-center bg-gray-50 relative pdf-viewer-mobile touch-action-pan-y"
            onScroll={handleScroll}
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "contain",
            }}
          >
            {/* Animated background */}
            {/* Scroll progress indicator */}
            <ScrollIndicator progress={scrollProgress} />
            {/* Page counter */}
            <PageCounter
              currentPage={pageNumber}
              totalPages={Math.min(
                numPages || 1,
                numberOfPagesToDisplayInPreview
              )}
            />

            <Document
              file={book.filePath}
              onLoadSuccess={onDocumentLoadSuccess}
              error={
                <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-100 p-4 shadow-sm">
                  <p className="font-medium mb-2">Oops! Failed to load PDF</p>
                  <p className="text-sm">
                    Please try refreshing or select another book
                  </p>
                </div>
              }
              className="max-h-full"
            >
              {Array.from(
                new Array(numberOfPagesToDisplayInPreview),
                (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="mb-4 sm:mb-6"
                    data-page-number={index + 1}
                  >
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={calculatePdfWidth()}
                      className="shadow-md min-h-[300px] sm:min-h-[500px] mx-auto"
                    />
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Page {index + 1}
                    </p>
                  </div>
                )
              )}
            </Document>
          </div>

          {/* Page navigation controls - Modern premium styling */}
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 my-3 sm:my-4 p-3 overflow-x-auto">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="group relative flex-shrink-0 px-3 sm:px-6 py-2.5 bg-gradient-to-r from-amber-50 to-stone-50 text-amber-800 rounded-xl hover:from-amber-100 hover:to-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation shadow-sm hover:shadow border border-amber-100/60 disabled:hover:shadow-none font-medium text-sm"
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </span>
            </button>

            <div className="flex items-center flex-shrink-0 justify-center bg-gradient-to-r from-stone-50 to-amber-50 rounded-xl px-2 sm:px-4 py-2 shadow-sm border border-amber-100/60">
              <span className="mr-1 sm:mr-3 text-xs sm:text-sm font-medium text-amber-700">
                Page
              </span>
              <input
                type="number"
                min="1"
                max={Math.min(numPages || 1, numberOfPagesToDisplayInPreview)}
                value={pageInputValue}
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePageInputSubmit();
                  }
                }}
                className="w-10 sm:w-14 border border-amber-200/60 rounded-lg px-1 sm:px-2 py-1 text-center text-xs sm:text-sm font-medium bg-white/70 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200"
                aria-label="Page number"
              />
              <span className="mx-1 sm:mx-3 text-xs sm:text-sm font-medium text-amber-700">
                of {Math.min(numPages || 1, numberOfPagesToDisplayInPreview)}
              </span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={
                pageNumber >=
                Math.min(numPages || 1, numberOfPagesToDisplayInPreview)
              }
              className="group relative flex-shrink-0 px-3 sm:px-6 py-2.5 bg-gradient-to-r from-amber-50 to-stone-50 text-amber-800 rounded-xl hover:from-amber-100 hover:to-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation shadow-sm hover:shadow border border-amber-100/60 disabled:hover:shadow-none font-medium text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="hidden sm:inline">Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Footer with navigation - Modern premium styling */}
          <div className="border-t border-amber-100/60 bg-gradient-to-r from-amber-50/30 to-stone-50/30 p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-stone-600 text-center sm:text-left font-medium">
                Showing{" "}
                <span className="text-amber-700 font-semibold">
                  {Math.min(numPages || 0, numberOfPagesToDisplayInPreview)}
                </span>{" "}
                of{" "}
                <span className="text-amber-700 font-semibold">
                  {numPages || 0}
                </span>{" "}
                pages <span className="text-amber-600">(Preview)</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={scrollToTop}
                  className="group px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 rounded-xl hover:from-amber-200 hover:to-amber-100 text-sm touch-manipulation transition-all duration-200 shadow-sm hover:shadow border border-amber-200/60 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:-translate-y-0.5 transition-transform duration-200"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    Back to Top
                  </span>
                </button>
              </div>
            </div>

            {!isAvailableOnline && numPages > 20 && (
              <div className="preview-limit-message mt-3">
                <div className="text-center py-3 bg-gradient-to-r from-amber-100/50 to-stone-100/50 border border-amber-200/60 rounded-xl">
                  <p className="text-xs sm:text-sm text-amber-800 font-medium">
                    📚 This is a preview. Purchase the book to access all{" "}
                    <span className="font-semibold text-amber-900">
                      {numPages}
                    </span>{" "}
                    pages.
                  </p>
                </div>
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
    calculatePdfWidth,
    scrollProgress,
  ]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse border border-amber-50">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-gradient-to-r from-amber-100/50 to-amber-200/30 h-80 md:w-1/4 flex items-center justify-center">
                <div className="w-48 h-64 bg-amber-50 rounded shadow-sm"></div>
              </div>
              <div className="p-6 md:w-3/4">
                <div className="h-8 bg-amber-50 rounded w-3/4 mb-6"></div>
                <div className="h-5 bg-amber-50 rounded w-1/2 mb-4"></div>
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-md p-10 max-w-md border border-amber-100 transform transition-all duration-300 hover:shadow-lg">
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-amber-100/30 py-8">
      <main className="container mx-auto px-4 max-w-7xl">
        {/* Compact breadcrumb navigation */}
        <div className="mb-4 flex justify-between items-center bg-white/70 px-3 py-1.5 rounded-md shadow-sm border border-amber-50 text-xs sticky top-0 z-10">
          <nav className="flex flex-wrap items-center overflow-hidden">
            <Link
              to="/"
              className="text-amber-700 hover:text-amber-900 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-0.5"
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
            <span className="mx-1 text-stone-400">/</span>
            {book.categories && book.categories.length > 0 && (
              <>
                <Link
                  to={`/category/${book.categories[0]
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  {book.categories[0]}
                </Link>
                <span className="mx-1 text-stone-400">/</span>
              </>
            )}
            <span className="text-stone-500 truncate max-w-[120px] sm:max-w-[180px] md:max-w-sm overflow-hidden">
              {book.title}
            </span>
          </nav>
          <Link
            to="/"
            className="inline-flex items-center text-amber-800 hover:text-amber-900 ml-2"
          >
            <ChevronLeft size={12} />
            <span className="ml-0.5">Back</span>
          </Link>
        </div>

        <div className="mb-6">
          {/* Book Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100 transition-all duration-300 hover:shadow-xl">
            <div className="md:flex">
              {/* Book Cover Image with reduced padding */}
              <div className="md:flex-shrink-0 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center p-4 md:p-4 md:w-1/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#f5d0a9_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-80 md:h-96 lg:h-[28rem] object-contain shadow-lg rounded-lg transform transition-all duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300x450/amber-50/amber-800?text=No+Cover";
                  }}
                />
              </div>

              {/* Book Information with improved layout */}
              <div className="p-5 md:p-6 md:w-3/4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-stone-800 mb-2 leading-tight overflow-hidden break-words">
                      {book.title}
                    </h1>
                    <p className="text-base md:text-lg text-stone-600 mb-4 flex items-center flex-wrap">
                      by{" "}
                      <span className="font-medium ml-2 text-amber-800 break-words">
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
                    onClick={handleToggleWishlist}
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
                <div className="flex items-center mb-5 bg-amber-50/50 p-3 rounded-lg">
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
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <p className="text-2xl md:text-3xl font-bold text-amber-800 flex items-baseline flex-wrap">
                      <span className="whitespace-nowrap">
                        {book.price?.toLocaleString("vi-VN")} VND
                      </span>
                      {book.originalPrice &&
                        book.originalPrice > book.price && (
                          <span className="text-base md:text-lg text-stone-500 line-through ml-2 whitespace-nowrap">
                            {book.originalPrice.toLocaleString("vi-VN")} VND
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

                  <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-wrap">
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white py-2.5 px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-0 flex-shrink-0"
                      aria-label={`Add ${book.title} to cart`}
                    >
                      <ShoppingCart size={18} />
                      <span className="whitespace-nowrap">Add to Cart</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className={`flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white py-2.5 px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden group min-w-0 flex-shrink-0 ${
                        isBuyingNow ? "cursor-not-allowed opacity-80" : ""
                      }`}
                      aria-label={`Buy ${book.title} now`}
                      disabled={isBuyingNow}
                    >
                      {isBuyingNow ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      ) : (
                        <Zap
                          size={18}
                          className="transition-transform group-hover:animate-pulse"
                        />
                      )}
                      <span className="relative z-10 whitespace-nowrap">
                        {isBuyingNow ? "Processing..." : "Buy Now"}
                      </span>
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    </button>
                    <button
                      onClick={() => setPreviewActive(true)}
                      className="flex items-center justify-center gap-2 border-2 border-amber-100 bg-white hover:bg-amber-50 text-amber-800 py-2.5 px-5 rounded-lg transition-all duration-300 shadow-sm hover:shadow min-w-0 flex-shrink-0"
                      aria-label={`Preview ${book.title}`}
                    >
                      <BookOpen size={18} />
                      <span className="whitespace-nowrap">
                        {isAvailableOnline ? "Preview" : "Preview (Limited)"}
                      </span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 border-2 border-stone-300 bg-white hover:bg-stone-50 text-stone-700 py-2.5 px-5 rounded-lg transition-all duration-300 shadow-sm hover:shadow min-w-0 flex-shrink-0"
                      aria-label={`Borrow ${book.title}`}
                    >
                      <Bookmark size={18} />
                      <span className="whitespace-nowrap">Borrow</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-amber-50/70 p-2.5 rounded-lg">
                    <span className="text-stone-700 font-medium text-sm">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium text-amber-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Book Details List with improved styling */}
                <div className="border-t border-amber-100 pt-5">
                  <h2 className="text-lg font-serif font-medium text-stone-800 mb-3 flex items-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Book Details
                  </h2>
                  <dl className="space-y-3 bg-amber-50/50 p-3 rounded-lg text-sm md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-3 md:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <dt className="flex items-center text-stone-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0">
                        <BookCopy size={14} className="mr-1.5 text-amber-700" />
                        Format:
                      </dt>
                      <dd className="font-medium text-stone-800 break-words">
                        {book.format ? book.format.toLowerCase() : "Paperback"}
                      </dd>
                    </div>

                    {book?.isbn && (
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="flex items-center text-stone-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0">
                          <Hash size={14} className="mr-1.5 text-amber-700" />
                          ISBN:
                        </dt>
                        <dd className="font-medium text-stone-800 break-all">
                          {book.isbn}
                        </dd>
                      </div>
                    )}

                    {book?.publisher && (
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="flex items-center text-stone-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0">
                          <User size={14} className="mr-1.5 text-amber-700" />
                          Publisher:
                        </dt>
                        <dd className="font-medium text-stone-800 break-words">
                          {book.publisher}
                        </dd>
                      </div>
                    )}

                    {book?.publishDate && (
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="flex items-center text-stone-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0">
                          <Calendar
                            size={14}
                            className="mr-1.5 text-amber-700"
                          />
                          Published:
                        </dt>
                        <dd className="font-medium text-stone-800 break-words">
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
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="flex items-center text-stone-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5 text-amber-700"
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
                          className={`font-medium break-words ${
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
                      <div className="flex flex-col sm:flex-row sm:items-start md:col-span-2">
                        <dt className="flex items-center text-stone-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5 text-amber-700"
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
                          <div className="flex flex-wrap gap-1.5">
                            {book.categories.map((category, index) => (
                              <Link
                                key={index}
                                to={`/category/${category
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs px-2.5 py-0.5 rounded-full transition-colors"
                              >
                                {category}
                              </Link>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Book Description with improved styling */}
          {book.description && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6 border border-amber-100 transition-all duration-300 hover:shadow-lg">
              <div className="px-6 py-5">
                <h2 className="text-lg font-serif font-medium text-stone-800 mb-3 flex items-center">
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
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  Description
                </h2>
                <div className="prose prose-amber prose-stone max-w-none">
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed whitespace-pre-line bg-amber-50/30 p-4 rounded-lg border-l-4 border-amber-200">
                    {book.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section with improved styling */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6 border border-amber-100 transition-all duration-300 hover:shadow-lg">
            <div className="px-6 py-5">
              <div className="border-b border-amber-100 pb-4 mb-6">
                <h2 className="flex items-center text-lg font-serif font-medium text-stone-800 mb-4">
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Customer Reviews
                </h2>

                {book.ratings && book.ratings.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-800">
                          {averageRating.toFixed(1)}
                        </div>
                        <div className="flex mb-1 justify-center">
                          {renderRatingStars(averageRating)}
                        </div>
                        <div className="text-xs text-stone-500">
                          {book.ratings.length}{" "}
                          {book.ratings.length === 1 ? "review" : "reviews"}
                        </div>
                      </div>

                      <div className="hidden md:block h-16 w-px bg-amber-100 mx-2"></div>

                      <div className="hidden md:flex flex-col gap-1">
                        {[5, 4, 3, 2, 1].map((starCount) => {
                          const count = book.ratings.filter(
                            (r) =>
                              Math.round(r.rating || r.score || 0) === starCount
                          ).length;
                          const percentage = book.ratings.length
                            ? Math.round((count / book.ratings.length) * 100)
                            : 0;

                          return (
                            <div
                              key={starCount}
                              className="flex items-center text-xs"
                            >
                              <span className="w-1 mr-2">{starCount}</span>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2 overflow-hidden">
                                <div
                                  className="bg-amber-500 h-full rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-stone-500">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-5 rounded-md transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <MessageSquare size={16} />
                      Write a Review
                    </button>
                  </div>
                ) : null}
              </div>

              {book.ratings && book.ratings.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-stone-800">
                      {book.ratings.length}{" "}
                      {book.ratings.length === 1 ? "Review" : "Reviews"}
                    </h3>
                    <select className="text-sm border border-amber-200 rounded py-1 px-2 bg-amber-50/50 text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500">
                      <option value="newest">Newest First</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    {book.ratings.map((review) => (
                      <div
                        key={
                          review.ratingId ||
                          review.id ||
                          Math.random().toString()
                        }
                        className="bg-white rounded-lg shadow-sm border border-amber-50 p-4 hover:shadow-md transition-shadow"
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
                              {(review.createdAt || review.created_at) && (
                                <span className="text-xs text-stone-500">
                                  {new Date(
                                    review.createdAt || review.created_at
                                  ).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg mb-1">
                              <div className="flex mr-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < (review.rating || review.score || 0)
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-medium text-amber-800 ml-1">
                                {review.rating || review.score || 0}
                              </span>
                            </div>
                            <span className="text-xs text-stone-400">
                              Verified Purchase
                            </span>
                          </div>
                        </div>
                        {(review.review || review.comment) && (
                          <div className="bg-amber-50/30 p-4 rounded-lg">
                            <p className="text-stone-700 leading-relaxed">
                              {review.review || review.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-amber-800 hover:bg-amber-900 text-white py-2.5 px-6 rounded-md transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <MessageSquare size={18} />
                      Write Your Review
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 border border-amber-100 rounded-lg bg-amber-50/30">
                  <div className="w-16 h-16 mx-auto mb-4 text-amber-300">
                    <BookOpen size={64} />
                  </div>
                  <h3 className="text-lg font-medium text-stone-800 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-stone-500 mb-6 max-w-md mx-auto">
                    Be the first to share your thoughts about this book with
                    other readers!
                  </p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-amber-800 hover:bg-amber-900 text-white py-2.5 px-6 rounded-md transition-colors flex items-center gap-2 mx-auto shadow-sm"
                  >
                    <MessageSquare size={18} />
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Related Books Section */}
          {book.categories && book.categories.length > 0 && (
            <>
              {/* Section Divider */}
              <div className="flex items-center justify-center mt-8 mb-6">
                <div className="border-t border-amber-200 flex-grow"></div>
                <div className="px-4 text-amber-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="border-t border-amber-200 flex-grow"></div>
              </div>

              <RelatedBooks
                categories={book.categories}
                currentBookId={book.bookId}
                limit={8}
              />
            </>
          )}
        </div>
      </main>

      {/* Newsletter signup */}
      <section className="bg-amber-100/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-serif font-bold text-stone-800 mb-3">
              Stay updated with new releases
            </h2>
            <p className="text-stone-600 mb-5 text-sm">
              Join our newsletter and be the first to know about new book
              arrivals
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 flex-grow border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
              <button className="bg-amber-800 hover:bg-amber-900 text-white py-2.5 px-5 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setShowCartModal(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-10 transform transition-all animate-fadeIn">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center text-gray-900 mb-2">
              Added to Cart
            </h3>
            <p className="text-center text-gray-600 mb-4">
              {book.title} has been added to your cart.
            </p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowCartModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <Link
                to="/cart"
                className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
              >
                <ShoppingBag size={18} />
                View Cart
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setShowReviewModal(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-10 transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900">
                Write a Review
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        star <= userRating
                          ? "fill-amber-500 text-amber-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="review"
                rows={4}
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors disabled:opacity-70"
              >
                {isSubmittingReview ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render PDF viewer if preview is active */}
      {renderPdfViewer()}
    </div>
  );
};

export default BookDetails;
