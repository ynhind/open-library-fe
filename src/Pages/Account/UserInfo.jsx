import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserInformation } from "../../utils/userApi";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  MapPin,
  ChevronLeft,
  Home,
  Calendar,
  Shield,
  BookOpen,
  Package,
  Clock,
  Edit,
  ArrowRight,
} from "lucide-react";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await getUserInformation();
        setUserInfo(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load user information:", err);
        setError("Failed to load user information. Please try again later.");
        toast.error("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Animated floating particles background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-amber-200/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${
                    3 + Math.random() * 2
                  }s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Loading skeleton with same layout as actual content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            {/* Left column skeleton - User card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative h-full">
                {/* Animated golden accent line */}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                  <div className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12 animate-pulse"></div>
                <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm animate-pulse"></div>

                <div className="px-6 py-8 flex flex-col items-center relative z-10">
                  {/* Avatar skeleton with pulsing rings */}
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full animate-pulse"></div>
                    <div className="absolute -inset-1 bg-amber-300/20 rounded-full blur-sm animate-ping"></div>
                    <div className="absolute -inset-2 bg-amber-200/10 rounded-full blur-md animate-pulse"></div>
                  </div>

                  {/* Username skeleton */}
                  <div className="h-6 bg-amber-100 rounded-lg w-32 mb-2 animate-pulse"></div>

                  {/* Member badge skeleton */}
                  <div className="h-5 bg-amber-50 rounded-full w-20 mb-4 animate-pulse"></div>

                  {/* Join date skeleton */}
                  <div className="h-4 bg-stone-100 rounded w-28 mb-6 animate-pulse"></div>

                  {/* Edit button skeleton */}
                  <div className="w-full h-12 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg animate-pulse"></div>
                </div>

                {/* Stats skeleton */}
                <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="h-6 bg-amber-100 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-stone-100 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-amber-100 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 bg-stone-100 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column skeleton - Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative h-full">
                {/* Header skeleton */}
                <div className="px-8 py-6 border-b border-amber-100 bg-gradient-to-r from-amber-50/80 to-white">
                  <div className="h-7 bg-amber-100 rounded-lg w-48 animate-pulse"></div>
                </div>

                {/* Content skeleton */}
                <div className="px-8 py-8">
                  <div className="space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-10 w-10 rounded-md bg-amber-50 mr-4 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-stone-100 rounded w-20 mb-2 animate-pulse"></div>
                          <div className="h-5 bg-stone-150 rounded w-48 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom buttons skeleton */}
                <div className="flex px-8 py-6 bg-amber-50/40 border-t border-amber-100 gap-4">
                  <div className="flex-1 h-12 bg-amber-100 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-12 bg-amber-100 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Premium card skeleton */}
              {/* <div className="mt-6 bg-gradient-to-r from-amber-200 to-amber-300 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-amber-100/20 rounded-full -mr-20 -mt-20 blur-md animate-pulse"></div>
                <div className="flex items-start relative z-10">
                  <div className="flex-1">
                    <div className="h-6 bg-white/30 rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-white/20 rounded w-64 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-white/20 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="h-10 bg-white/40 rounded-lg w-28 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Central loading indicator */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-amber-200/50">
              <div className="flex flex-col items-center">
                {/* Multi-ring spinner */}
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                  <div
                    className="absolute inset-2 rounded-full border-2 border-amber-300 border-b-transparent animate-spin animation-reverse"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                  <div
                    className="absolute inset-4 rounded-full border border-amber-400 border-l-transparent animate-spin"
                    style={{ animationDuration: "2s" }}
                  ></div>
                </div>

                {/* Loading text with typewriter effect */}
                <div className="text-center">
                  <h3 className="text-lg font-serif font-semibold text-amber-800 mb-2">
                    Loading Your Profile
                  </h3>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-stone-600">
                      Preparing your account
                    </span>
                    <div className="flex space-x-1">
                      <div
                        className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS for additional animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
          .animation-reverse {
            animation-direction: reverse;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 to-amber-100/40 py-10 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full border border-red-200 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-300 via-red-500 to-red-300"></div>

          {/* Error icon with enhanced styling */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full shadow-inner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-red-200/30 rounded-full blur-sm"></div>
          </div>

          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 text-center">
            Error Loading Profile
          </h2>
          <p className="text-stone-600 mb-8 text-center">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <Clock className="mr-2 h-4 w-4 animate-spin" />
            Try Again
          </button>

          {/* Premium recommendation text */}
          <div className="mt-8 text-stone-400 text-sm italic flex items-center justify-center">
            <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
            Please try refreshing the page
            <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 to-amber-100/40 py-10 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full border border-amber-100 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>

          {/* Premium icon container */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="text-amber-500" size={40} />
            </div>
            <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm"></div>
            <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>
          </div>

          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 text-center relative z-10">
            No Profile Found
          </h2>
          <p className="text-stone-600 mb-8 text-center relative z-10">
            No user information is available. Please make sure you are logged in
            to access your profile.
          </p>

          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <User className="mr-2 h-4 w-4" />
            Log In
          </Link>

          {/* Premium recommendation text */}
          <div className="mt-8 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
            <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
            Join our community of book lovers today
            <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
          </div>
        </div>
      </div>
    );
  }

  // Format account created date if available
  const createdDate = userInfo.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 to-amber-100/40 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Enhanced Breadcrumb navigation */}

        {/* Main content area with premium styling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - User card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative">
              {/* Golden accent line */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
              <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>

              <div className="px-6 py-8 flex flex-col items-center relative z-10">
                {/* Premium avatar */}
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner border border-amber-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-serif font-bold text-amber-800">
                      {userInfo.username
                        ? userInfo.username.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  </div>
                  <div className="absolute -inset-1 bg-amber-300/20 rounded-full blur-sm"></div>
                </div>

                <h2 className="text-xl font-serif font-bold text-stone-800 mb-1">
                  {userInfo.username}
                </h2>

                <div className="inline-flex h-5 items-center px-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                  Member
                </div>

                {createdDate && (
                  <div className="flex items-center text-sm text-stone-500 mb-6">
                    <Calendar size={14} className="mr-1.5 text-amber-500" />
                    <span>Joined {createdDate}</span>
                  </div>
                )}

                <Link
                  to="/account/edit"
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white py-3 px-5 rounded-lg transition-all duration-300 text-sm flex items-center justify-center shadow-md hover:shadow-lg mt-2"
                >
                  <Edit size={14} className="mr-2" />
                  Edit Profile
                </Link>
              </div>

              {/* User stats */}
              <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <span className="block text-amber-800 font-bold text-xl">
                      12
                    </span>
                    <span className="text-xs text-stone-500">Books Read</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-amber-800 font-bold text-xl">
                      5
                    </span>
                    <span className="text-xs text-stone-500">Wishlisted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - User details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative">
              {/* Golden accent line */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

              <div className="px-8 py-6 border-b border-amber-100 bg-gradient-to-r from-amber-50/80 to-white flex justify-between items-center">
                <h2 className="text-2xl font-serif font-semibold text-stone-800 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-amber-700" />
                  Account Details
                </h2>
              </div>

              <div className="px-8 py-8">
                <div className="grid grid-cols-1 gap-y-6">
                  {/* Username */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100">
                      <User className="text-amber-700" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Username</p>
                      <p className="font-medium text-stone-800 text-md">
                        {userInfo.username}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100">
                      <Mail className="text-amber-700" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">
                        Email Address
                      </p>
                      <p className="font-medium text-stone-800 text-md">
                        {userInfo.email}
                      </p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100">
                      <BookOpen className="text-amber-700" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Full Name</p>
                      <p className="font-medium text-stone-800 text-md">
                        {userInfo.firstName || "(Not set)"}{" "}
                        {userInfo.lastName || ""}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100">
                      <MapPin className="text-amber-700" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">
                        Shipping Address
                      </p>
                      <p className="font-medium text-stone-800 text-md">
                        {userInfo.address || "(Not set)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex px-8 py-6 bg-amber-50/40 border-t border-amber-100 gap-4">
                <Link
                  to="/my-library"
                  className="flex-1 flex justify-center items-center py-3 px-4 bg-white hover:bg-amber-50 border border-amber-200 text-stone-700 rounded-lg transition-colors shadow-sm hover:shadow group"
                >
                  <BookOpen size={16} className="mr-2 text-amber-700" />
                  <span>My Library</span>
                </Link>

                <Link
                  to="/orders"
                  className="flex-1 flex justify-center items-center py-3 px-4 bg-white hover:bg-amber-50 border border-amber-200 text-stone-700 rounded-lg transition-colors shadow-sm hover:shadow group"
                >
                  <Package size={16} className="mr-2 text-amber-700" />
                  <span>My Orders</span>
                </Link>
              </div>
            </div>

            {/* Premium recommendations */}
            <div className="mt-6 bg-gradient-to-r from-amber-700 to-amber-800 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-amber-600/20 rounded-full -mr-20 -mt-20 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/30 rounded-full -ml-10 -mb-10 blur-md"></div>

              <div className="flex items-start relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-serif mb-2">
                    Discover Premium Benefits
                  </h3>
                  <p className="text-amber-100 text-sm mb-4">
                    Unlock exclusive access to rare books, early releases, and
                    member-only events.
                  </p>
                  <Link
                    to="/premium"
                    className="inline-flex items-center bg-white text-amber-800 py-2 px-4 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium group"
                  >
                    <span>Learn More</span>
                    <ArrowRight
                      size={14}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100/10 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="text-amber-100 h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
