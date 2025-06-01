import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../../utils/orderApi";
import { BookOpen, Package, Truck, CheckCircle, XCircle } from "lucide-react";

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
          50% { transform: translateY(-6px); }
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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getUserOrders();
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

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

  // Format status with appropriate color classes
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
        return <CheckCircle size={14} className="mr-1" />;
      case "PENDING":
        return <Package size={14} className="mr-1" />;
      case "CANCELLED":
        return <XCircle size={14} className="mr-1" />;
      case "PROCESSING":
        return <Truck size={14} className="mr-1" />;
      default:
        return <BookOpen size={14} className="mr-1" />;
    }
  };
  return (
    <>
      <AnimationStyles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-amber-100">
          {/* Luxurious premium header with gradient background */}
          <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white px-6 py-8 md:py-12 relative overflow-hidden">
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

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-white rounded-full border border-amber-200 shadow-inner flex items-center justify-center">
                  <Package
                    size={24}
                    className="text-amber-700"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-medium text-stone-800">
                    Your Orders
                  </h1>
                  <p className="text-stone-600 mt-1 flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                    View and manage all your book orders in one place
                  </p>
                </div>
              </div>

              {orders.length > 0 && !loading && !error && (
                <div className="mt-4 pt-4 pl-14">
                  <div className="inline-flex items-center px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-sm text-amber-700">
                    <span className="mr-1.5 font-medium">{orders.length}</span>
                    {orders.length === 1 ? "order" : "orders"} in your account
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Order Filter Navigation */}
          <div className="bg-gradient-to-r from-amber-50/50 to-white border-b border-amber-100 relative">
            {/* Subtle shading effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-50/20"></div>

            <nav className="flex -mb-px px-6 overflow-x-auto relative z-10">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-all relative group ${
                  activeTab === "all"
                    ? "text-amber-800"
                    : "text-stone-500 hover:text-amber-700"
                }`}
              >
                All Orders
                {activeTab === "all" ? (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
                ) : (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-amber-200/50 transition-all duration-300"></div>
                )}
                {activeTab === "all" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-all relative group ${
                  activeTab === "pending"
                    ? "text-amber-800"
                    : "text-stone-500 hover:text-amber-700"
                }`}
              >
                Pending
                {activeTab === "pending" ? (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
                ) : (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-amber-200/50 transition-all duration-300"></div>
                )}
                {activeTab === "pending" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("processing")}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-all relative group ${
                  activeTab === "processing"
                    ? "text-amber-800"
                    : "text-stone-500 hover:text-amber-700"
                }`}
              >
                Processing
                {activeTab === "processing" ? (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
                ) : (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-amber-200/50 transition-all duration-300"></div>
                )}
                {activeTab === "processing" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-all relative group ${
                  activeTab === "completed"
                    ? "text-amber-800"
                    : "text-stone-500 hover:text-amber-700"
                }`}
              >
                Completed
                {activeTab === "completed" ? (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
                ) : (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-amber-200/50 transition-all duration-300"></div>
                )}
                {activeTab === "completed" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-all relative group ${
                  activeTab === "cancelled"
                    ? "text-amber-800"
                    : "text-stone-500 hover:text-amber-700"
                }`}
              >
                Cancelled
                {activeTab === "cancelled" ? (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400"></div>
                ) : (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-amber-200/50 transition-all duration-300"></div>
                )}
                {activeTab === "cancelled" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Orders Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 py-16 relative overflow-hidden">
                {/* Premium top accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
                <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

                <div className="relative mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-white rounded-full shadow-inner flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500 animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -inset-4 bg-amber-200/20 rounded-full blur-md"></div>
                </div>

                <span className="mt-6 text-2xl text-stone-700 font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                  Loading your orders...
                </span>

                <div className="relative w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full animate-loadingBar"></div>
                </div>

                <p className="text-stone-500 mt-5 max-w-xs text-center leading-relaxed">
                  We're retrieving your order information
                  <span className="block mt-1 text-amber-700 font-serif">
                    This will only take a moment
                  </span>
                </p>

                {/* Animated package icons */}
                <div className="flex items-center gap-5 mt-8">
                  <div
                    className="w-8 h-8 border border-amber-200 rounded-sm flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "1.5s" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500"
                    >
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                  <div
                    className="w-7 h-7 border border-amber-200 rounded-sm flex items-center justify-center animate-bounce"
                    style={{
                      animationDelay: "200ms",
                      animationDuration: "1.3s",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500"
                    >
                      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                      <path d="M16.5 9.4 7.55 4.24" />
                      <polyline points="3.29 7 12 12 20.71 7" />
                      <line x1="12" y1="22" x2="12" y2="12" />
                      <circle cx="18.5" cy="15.5" r="2.5" />
                      <path d="M20.27 17.27 22 19" />
                    </svg>
                  </div>
                  <div
                    className="w-9 h-9 border border-amber-200 rounded-sm flex items-center justify-center animate-bounce"
                    style={{
                      animationDelay: "400ms",
                      animationDuration: "1.7s",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500"
                    >
                      <path d="M10.5 3.75H12a3.75 3.75 0 0 1 3.75 3.75v16.5H3.75V7.5A3.75 3.75 0 0 1 7.5 3.75h3Z" />
                      <path d="M15 11.25h6" />
                      <path d="M15 15h6" />
                      <path d="M15 18.75h6" />
                      <path d="M15 7.5h4.5" />
                      <path d="M8.25 3.75V7.5" />
                      <path d="M14.25 3.75V7.5" />
                      <path d="M10.5 2.25v1.5" />
                      <path d="M10.5 16.5h3v3h-3z" />
                    </svg>
                  </div>
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
                        <XCircle className="h-8 w-8 text-red-500" />
                      </div>
                      <div className="absolute -inset-1 bg-red-400/20 rounded-full blur-sm"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-medium text-stone-800">
                        Unable to load your orders
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
                          to="/"
                          className="px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm hover:shadow"
                        >
                          Return to Homepage
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
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
                {/* Premium top accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
                <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
                <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

                {/* Book icon background pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: "60px",
                  }}
                ></div>

                {/* Premium empty package icon */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
                    {activeTab === "all" ? (
                      <Package className="text-amber-500" size={46} />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="46"
                        height="46"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-amber-500"
                      >
                        <rect width="8" height="8" x="2" y="2" rx="1" />
                        <path d="M14 2c.36 0 .71.15.96.42l6.62 7.27c.25.27.39.64.39 1.01v8.8a2.5 2.5 0 0 1-2.5 2.5h-8.67a2.5 2.5 0 0 1-2.29-1.5" />
                        <rect width="8" height="8" x="2" y="14" rx="1" />
                      </svg>
                    )}
                  </div>
                  <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

                  {/* Decorative circles */}
                  <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
                  <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
                </div>

                <h2 className="text-3xl font-serif font-medium mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                  {activeTab === "all"
                    ? "Your order history is empty"
                    : `No ${activeTab} orders found`}
                </h2>

                <p className="text-stone-600 mb-8 max-w-lg mx-auto relative z-10 leading-relaxed">
                  {activeTab === "all"
                    ? "Browse our collection and place your first order to see it appear here."
                    : `You don't currently have any orders with ${activeTab} status.`}
                  <span className="block mt-2 italic text-amber-700 font-serif">
                    {activeTab === "all"
                      ? "Your order history will be stored here for easy access."
                      : "Check other tabs or come back later."}
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                  <Link
                    to="/"
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all inline-flex items-center gap-2.5 font-medium shadow-md hover:shadow-lg group"
                  >
                    <BookOpen
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>Browse Collection</span>
                    <span className="ml-1 text-amber-200 group-hover:ml-2 transition-all">
                      →
                    </span>
                  </Link>

                  {activeTab !== "all" && (
                    <button
                      onClick={() => setActiveTab("all")}
                      className="px-8 py-3.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow"
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
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      View All Orders
                    </button>
                  )}
                </div>

                {/* Premium recommendation text */}
                <div className="mt-10 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
                  <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
                  Discover and order your next favorite read today
                  <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white border border-amber-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group relative"
                  >
                    {/* Status accent line */}
                    <div
                      className={`absolute top-0 left-0 w-1.5 h-full ${
                        order.status.toUpperCase() === "COMPLETED"
                          ? "bg-gradient-to-b from-green-400 to-green-300"
                          : order.status.toUpperCase() === "PENDING"
                          ? "bg-gradient-to-b from-amber-400 to-amber-300"
                          : order.status.toUpperCase() === "CANCELLED"
                          ? "bg-gradient-to-b from-red-400 to-red-300"
                          : "bg-gradient-to-b from-blue-400 to-blue-300"
                      }`}
                    ></div>

                    {/* Subtle corner accents */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-200 rounded-tl-lg opacity-50"></div>
                    <div className="absolute bottom-0 left-8 w-8 h-8 border-b-2 border-l-2 border-amber-200 rounded-tr-lg opacity-50"></div>

                    <div className="px-8 py-6 border-b border-amber-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-50/30 via-white to-white">
                      <div>
                        <span className="text-xs text-stone-500 mb-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M9 3v18" />
                          </svg>
                          Order ID
                        </span>
                        <span className="font-medium text-stone-800 font-serif">
                          #{order.orderId}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 block mb-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
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
                          Order Date
                        </span>
                        <span className="font-medium text-stone-800">
                          {formatDate(order.order_date)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 block mb-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 17v.01" />
                            <path d="M12 13.5a1.5 1.5 0 1 1 1.14-2.5" />
                          </svg>
                          Total Amount
                        </span>
                        <span className="font-medium text-lg text-amber-700 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                          ${order.total_amount.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 block mb-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <Link
                        to={`/orders/${order.orderId}`}
                        className="ml-auto text-sm font-medium text-amber-800 hover:text-white bg-gradient-to-r from-amber-50 to-white hover:from-amber-600 hover:to-amber-500 border border-amber-200 hover:border-amber-500 px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow group-hover:shadow"
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
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                          View Details
                        </span>
                      </Link>
                    </div>

                    {/* Items preview */}
                    <div className="px-8 py-5">
                      <div className="flex items-center mb-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-2 shadow-inner">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-amber-600"
                          >
                            <path d="M9 3h6v11h4l-7 7-7-7h4z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-medium text-stone-700">
                          {order.orderItems?.length || 0}{" "}
                          {order.orderItems?.length === 1 ? "item" : "items"} in
                          order
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {order.orderItems?.slice(0, 2).map((item) => (
                          <div
                            key={`${order.orderId}-${item.bookId}`}
                            className="flex items-center space-x-4 bg-amber-50/40 p-3 rounded-lg border border-amber-100/50 hover:border-amber-200 transition-colors group-hover:bg-amber-50/70"
                          >
                            <div className="flex-shrink-0 h-16 w-12 bg-gradient-to-br from-amber-50 to-white rounded-md flex items-center justify-center overflow-hidden border border-amber-100 group-hover:border-amber-200 transition-all relative">
                              {item.book?.coverImage ? (
                                <img
                                  src={item.book.coverImage}
                                  alt={item.book.title}
                                  className="object-cover h-full w-full rounded-md group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <BookOpen
                                  className="h-6 w-6 text-amber-300"
                                  strokeWidth={1.5}
                                />
                              )}

                              {/* Book shadow overlay */}
                              <div className="absolute inset-0 shadow-inner rounded-md"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-stone-800 truncate group-hover:text-amber-800 transition-colors">
                                {item.book?.title || "Book Title Not Available"}
                              </p>
                              <div className="flex items-center mt-1">
                                {item.book?.author && (
                                  <p className="text-xs text-stone-500 mr-3">
                                    by {item.book.author}
                                  </p>
                                )}
                                <p className="text-xs text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full inline-flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-1"
                                  >
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                    <path d="M4 22h16" />
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                  </svg>
                                  {item.quantity} × $
                                  {item.price_per_unit?.toFixed(2) || "0.00"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {order.orderItems?.length > 2 && (
                          <Link
                            to={`/orders/${order.orderId}`}
                            className="text-sm text-amber-700 hover:text-amber-800 flex items-center mt-2 group"
                          >
                            <span className="inline-block w-8 h-px bg-amber-200 mr-2"></span>
                            + {order.orderItems.length - 2} more{" "}
                            {order.orderItems.length - 2 === 1
                              ? "item"
                              : "items"}
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
                              className="ml-1 group-hover:translate-x-1 transition-transform"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Footer with actions */}
                    <div className="px-8 py-4 bg-gradient-to-r from-amber-50/50 to-white flex justify-end space-x-3 border-t border-amber-100">
                      {order.status === "PENDING" && (
                        <button className="text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 py-2.5 px-5 border border-red-200 hover:border-red-600 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2">
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
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                          Cancel Order
                        </button>
                      )}

                      {order.status === "COMPLETED" && (
                        <button className="text-sm font-medium text-amber-700 hover:text-white hover:bg-amber-700 py-2.5 px-5 border border-amber-200 hover:border-amber-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2">
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
                          >
                            <path d="M17 2.1l4 4-4 4" />
                            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                            <path d="m7 21-4-4 4-4" />
                            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                          </svg>
                          Buy Again
                        </button>
                      )}

                      <Link
                        to={`/orders/${order.orderId}`}
                        className="text-sm font-medium text-stone-700 hover:text-amber-800 bg-white hover:bg-amber-50 py-2.5 px-5 border border-stone-200 hover:border-amber-300 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
                      >
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
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
