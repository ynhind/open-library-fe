import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../../utils/orderApi";
import {
  ChevronLeft,
  BookOpen,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ShoppingBag,
  CreditCard,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Inject global CSS for animations
const AnimationStyles = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 2s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `,
      }}
    />
  );
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Convert orderId to number if it's a string from URL params
        const orderIdNum = parseInt(orderId, 10);
        const orderData = await getOrderById(orderIdNum);
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status style
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "PENDING":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border border-red-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-stone-100 text-stone-700 border border-stone-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircle size={16} className="mr-1" />;
      case "PENDING":
        return <Package size={16} className="mr-1" />;
      case "CANCELLED":
        return <XCircle size={16} className="mr-1" />;
      case "PROCESSING":
        return <Truck size={16} className="mr-1" />;
      default:
        return <ShoppingBag size={16} className="mr-1" />;
    }
  };

  // Calculate subtotal (excluding any future discounts or shipping fees)
  const calculateSubtotal = () => {
    if (!order?.orderItems) return 0;
    return order.orderItems.reduce((sum, item) => {
      return sum + item.price_per_unit * item.quantity;
    }, 0);
  };

  return (
    <>
      <AnimationStyles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium header with gradient background */}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-amber-50 p-8 relative overflow-hidden">
            {/* Premium top accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
            <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

            <div className="relative mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-white rounded-full shadow-inner flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
              <div className="absolute -inset-2 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -inset-4 bg-amber-200/20 rounded-full blur-md"></div>
            </div>

            <span className="mt-6 text-2xl text-stone-700 font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
              Loading order details...
            </span>

            <div className="relative w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full animate-loadingBar"></div>
            </div>

            <p className="text-stone-500 mt-5 max-w-xs text-center leading-relaxed">
              We're retrieving your order information.
              <span className="block mt-1 text-amber-700 font-serif">
                This will only take a moment.
              </span>
            </p>

            {/* Animated book icons */}
            <div className="flex items-center gap-3 mt-8">
              <div
                className="w-6 h-8 border border-amber-200 rounded-sm animate-bounce"
                style={{ animationDelay: "0ms", animationDuration: "1.5s" }}
              ></div>
              <div
                className="w-6 h-7 border border-amber-200 rounded-sm animate-bounce"
                style={{ animationDelay: "200ms", animationDuration: "1.3s" }}
              ></div>
              <div
                className="w-6 h-9 border border-amber-200 rounded-sm animate-bounce"
                style={{ animationDelay: "400ms", animationDuration: "1.7s" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-red-100">
            {/* Premium error accent */}
            <div className="h-1.5 bg-gradient-to-r from-red-300 via-red-500 to-red-300"></div>

            <div className="p-10 relative overflow-hidden">
              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='1'%3E%3Cpath d='M12 8v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundSize: "40px",
                }}
              ></div>

              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                {/* Enhanced error icon */}
                <div className="relative">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center shadow-inner border border-red-100">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="absolute -inset-1 bg-red-400/20 rounded-full blur-sm"></div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-medium text-stone-800">
                    Unable to load order details
                  </h3>
                  <div className="h-px w-16 bg-red-200 my-3"></div>
                  <p className="text-stone-600 mt-2 mb-6 leading-relaxed">
                    {error}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-3 shadow-md hover:shadow-lg"
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
                        className="animate-spin"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Try Again
                    </button>
                    <Link
                      to="/orders"
                      className="px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm hover:shadow"
                    >
                      Return to Orders
                    </Link>
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-100">
                    <p className="text-stone-500 flex items-center">
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
                        className="mr-2 text-amber-500"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      If this issue persists, please contact our
                      <a
                        href="#"
                        className="text-amber-600 hover:text-amber-700 ml-1 underline decoration-dotted underline-offset-4"
                      >
                        support team
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : order ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-amber-100">
            {/* Luxurious premium order header with rustic styling */}
            <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white px-6 py-8 relative overflow-hidden border-b border-amber-100">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-amber-100/10 rounded-full -mr-16 -mt-16 blur-sm"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-300/20 to-amber-100/5 rounded-full -ml-10 -mb-10 blur-sm"></div>
              <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"></div>
              <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-amber-300/20 rounded-full blur-sm"></div>

              {/* Golden accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23b45309' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: "150px",
                }}
              ></div>

              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-white rounded-full border border-amber-200 shadow-inner flex items-center justify-center mr-3">
                      <ShoppingBag
                        size={20}
                        className="text-amber-700"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h1 className="text-3xl font-serif font-medium text-stone-800">
                      Order #{order.orderId}
                    </h1>
                  </div>
                  <div className="flex items-center text-stone-600 ml-1">
                    <div className="flex items-center mr-4">
                      <Calendar
                        size={14}
                        className="mr-2 text-amber-600"
                        strokeWidth={1.5}
                      />
                      <p>Placed on {formatDate(order.order_date)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                      <span className="text-sm">
                        {order.orderItems?.length || 0} items in this order
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="md:col-span-2">
                  <div className="bg-white border border-amber-100 rounded-lg shadow-md overflow-hidden relative">
                    {/* Subtle corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-200 rounded-tl-lg opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-200 rounded-br-lg opacity-60"></div>

                    <div className="px-6 py-4 border-b border-amber-100 flex items-center bg-gradient-to-r from-amber-50/50 to-white">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-3 shadow-inner">
                        <BookOpen
                          size={16}
                          className="text-amber-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <h2 className="text-lg font-serif font-medium text-stone-800">
                        Order Items
                      </h2>
                      <div className="ml-auto bg-amber-100/50 px-3 py-1 rounded-full text-xs font-medium text-amber-800 border border-amber-200/50">
                        {order.orderItems?.length || 0} items
                      </div>
                    </div>

                    <div className="divide-y divide-amber-50">
                      {order.orderItems?.map((item) => (
                        <div
                          key={`${item.bookId}-${order.orderId}`}
                          className="px-6 py-5 flex items-center group hover:bg-amber-50/50 transition-colors relative"
                        >
                          {/* Hover accent line */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full"></div>

                          <div className="flex-shrink-0 h-24 w-16 bg-gradient-to-br from-amber-50 to-white rounded-md flex items-center justify-center mr-5 overflow-hidden shadow-sm border border-amber-100 group-hover:border-amber-200 transition-all relative">
                            {item.book?.coverImage ? (
                              <img
                                src={item.book.coverImage}
                                alt={item.book.title}
                                className="object-cover h-full w-full rounded-md group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <BookOpen
                                className="h-8 w-8 text-amber-300"
                                strokeWidth={1.5}
                              />
                            )}

                            {/* Book shadow overlay */}
                            <div className="absolute inset-0 shadow-inner rounded-md"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-serif font-medium text-stone-800 group-hover:text-amber-800 transition-colors">
                              {item.book?.title || "Book Title Not Available"}
                            </h3>
                            {item.book?.author && (
                              <p className="text-sm text-stone-600 mt-0.5 flex items-center">
                                <span className="inline-block w-1 h-1 rounded-full bg-amber-300 mr-1.5"></span>
                                by {item.book.author}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-sm text-stone-500">
                              <span className="bg-stone-50 px-2 py-1 rounded text-stone-600 border border-stone-100">
                                Unit Price:{" "}
                                <span className="text-amber-700 font-medium">
                                  {item.price_per_unit?.toLocaleString(
                                    "vi-VN"
                                  ) || "0"}{" "}
                                  VND
                                </span>
                              </span>
                              {item.book?.category && (
                                <span className="ml-3 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-100">
                                  {item.book.category}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex-shrink-0 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                              <p className="text-sm font-medium text-amber-700">
                                Qty:{" "}
                                <span className="text-amber-800">
                                  {item.quantity}
                                </span>
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <p className="text-base font-medium text-amber-800 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                                {(
                                  item.price_per_unit * item.quantity
                                ).toLocaleString("vi-VN")}{" "}
                                VND
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment information */}
                  {order.payments && order.payments.length > 0 && (
                    <div className="mt-8 bg-white border border-amber-100 rounded-lg shadow-md overflow-hidden relative">
                      {/* Subtle corner accents */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-200 rounded-tl-lg opacity-60"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-200 rounded-br-lg opacity-60"></div>

                      <div className="px-6 py-4 border-b border-amber-100 flex items-center bg-gradient-to-r from-amber-50/50 to-white">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-3 shadow-inner">
                          <CreditCard
                            size={16}
                            className="text-amber-600"
                            strokeWidth={1.5}
                          />
                        </div>
                        <h2 className="text-lg font-serif font-medium text-stone-800">
                          Payment Information
                        </h2>
                      </div>

                      <div className="p-6">
                        {order.payments.map((payment, index) => (
                          <div
                            key={payment.paymentId || index}
                            className="bg-amber-50/30 border border-amber-100 rounded-lg p-5 mb-5 last:mb-0 relative overflow-hidden"
                          >
                            {/* Decorative pattern */}
                            <div
                              className="absolute inset-0 opacity-[0.03]"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1'%3E%3Crect x='1' y='4' width='22' height='16' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='1' y1='10' x2='23' y2='10'%3E%3C/line%3E%3C/svg%3E")`,
                                backgroundSize: "40px",
                              }}
                            ></div>

                            <div className="relative z-10">
                              <div className="flex justify-between mb-4">
                                <span className="text-amber-800 font-serif text-lg font-medium">
                                  Payment #{index + 1}
                                </span>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                    payment.status?.toLowerCase() ===
                                    "completed"
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200"
                                  }`}
                                >
                                  {payment.status || "Unknown"}
                                </span>
                              </div>

                              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100/60">
                                  <dt className="text-sm font-medium text-stone-500 mb-1 flex items-center">
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
                                      className="mr-1 text-amber-600"
                                    >
                                      <rect
                                        width="20"
                                        height="14"
                                        x="2"
                                        y="5"
                                        rx="2"
                                      />
                                      <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                    Payment Method
                                  </dt>
                                  <dd className="text-stone-800 font-medium flex items-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                                    {payment.method || "Not specified"}
                                  </dd>
                                </div>

                                <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100/60">
                                  <dt className="text-sm font-medium text-stone-500 mb-1 flex items-center">
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
                                      className="mr-1 text-amber-600"
                                    >
                                      <rect
                                        width="18"
                                        height="18"
                                        x="3"
                                        y="4"
                                        rx="2"
                                        ry="2"
                                      />
                                      <line x1="16" x2="16" y1="2" y2="6" />
                                      <line x1="8" x2="8" y1="2" y2="6" />
                                      <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                    Payment Date
                                  </dt>
                                  <dd className="text-stone-800 font-medium flex items-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                                    {payment.payment_date
                                      ? formatDate(payment.payment_date)
                                      : "Not processed"}
                                  </dd>
                                </div>

                                <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100/60">
                                  <dt className="text-sm font-medium text-stone-500 mb-1 flex items-center">
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
                                      className="mr-1 text-amber-600"
                                    >
                                      <path d="M2 17a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-4H2Z" />
                                      <path d="M2 9a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4H2Z" />
                                    </svg>
                                    Amount Paid
                                  </dt>
                                  <dd className="text-amber-800 font-medium text-lg flex items-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                                    ${payment.amount?.toFixed(2) || "0.00"}
                                  </dd>
                                </div>

                                <div className="bg-white p-4 rounded-md shadow-sm border border-amber-100/60">
                                  <dt className="text-sm font-medium text-stone-500 mb-1 flex items-center">
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
                                      className="mr-1 text-amber-600"
                                    >
                                      <path d="M5.52 19A9 9 0 0 1 21 12a9 9 0 0 1-9 9 9 9 0 0 1-8.93-7.75" />
                                      <path d="M11 12a2 2 0 0 1 4 0 2 2 0 0 1-4 0Z" />
                                      <path d="M21 12H3" />
                                    </svg>
                                    Transaction ID
                                  </dt>
                                  <dd className="text-stone-800 font-medium flex items-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                                    {payment.paymentId || "Not available"}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column - Order summary */}
                <div>
                  <div className="bg-white border border-amber-100 rounded-lg shadow-sm overflow-hidden sticky top-6">
                    <div className="px-6 py-4 border-b border-amber-100 flex items-center">
                      <ShoppingBag
                        size={18}
                        className="text-amber-700 mr-2"
                        strokeWidth={1.5}
                      />
                      <h2 className="text-lg font-serif font-medium text-stone-800">
                        Order Summary
                      </h2>
                    </div>
                    <div className="p-6">
                      <dl className="space-y-4">
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-stone-600">Subtotal</dt>
                          <dd className="text-sm font-medium text-stone-800">
                            ${calculateSubtotal().toFixed(2)}
                          </dd>
                        </div>
                        {/* Add shipping, taxes, discounts here if applicable */}
                        <div className="border-t border-amber-100 pt-4 flex items-center justify-between">
                          <dt className="text-base font-serif font-medium text-stone-800">
                            Order Total
                          </dt>
                          <dd className="text-base font-medium text-amber-800">
                            ${order.total_amount.toFixed(2)}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-6 space-y-3">
                        {order.status === "PENDING" && (
                          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg shadow-sm py-3.5 px-4 text-base font-medium text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 group flex items-center justify-center space-x-2">
                            <XCircle
                              size={18}
                              className="group-hover:scale-110 transition-transform duration-200"
                            />
                            <span>Cancel Order</span>
                          </button>
                        )}
                        {order.status === "COMPLETED" && (
                          <button className="w-full bg-gradient-to-r from-amber-700 to-amber-800 border border-transparent rounded-lg shadow-sm py-3.5 px-4 text-base font-medium text-white hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 group flex items-center justify-center space-x-2">
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
                              className="group-hover:scale-110 transition-transform duration-200"
                            >
                              <path d="M17 2.1l4 4-4 4" />
                              <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                              <path d="m7 21-4-4 4-4" />
                              <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                            </svg>
                            <span>Buy Again</span>
                          </button>
                        )}
                        <Link
                          to="/orders"
                          className="w-full block text-center bg-white border border-amber-200 rounded-lg shadow-sm py-3.5 px-4 text-base font-medium text-stone-700 hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 group flex items-center justify-center space-x-2"
                        >
                          <ChevronLeft
                            size={18}
                            className="group-hover:-translate-x-1 transition-transform duration-200"
                          />
                          <span>Back to Orders</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-amber-100 relative overflow-hidden">
            {/* Premium top accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
            <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23b45309' fill-opacity='1'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: "100px",
              }}
            ></div>

            <div className="relative z-10">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center border border-amber-200/50">
                  <ShoppingBag
                    className="h-16 w-16 text-amber-300"
                    strokeWidth={1}
                  />
                </div>
                <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

                {/* Decorative circles */}
                <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
                <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
              </div>

              <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                Order Not Found
              </h2>

              <p className="text-stone-600 mb-8 max-w-lg mx-auto relative z-10 leading-relaxed">
                The order you're looking for doesn't seem to exist.
                <span className="block mt-2 italic text-amber-700 font-serif">
                  It may have been removed or the ID might be incorrect.
                </span>
              </p>

              <Link
                to="/orders"
                className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg group"
              >
                <ChevronLeft
                  size={18}
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                />
                <span>Return to Orders</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetail;
