import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import BookCoverImage from "../../assets/HeaderBooks/headerBook3.png";
import {
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function Verification() {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from URL if present
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest("auth/verify", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(
        "Email verified successfully! You can now login to your account."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Verification failed. Please check the code and try again."
      );
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await apiRequest("auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });
      setSuccess(
        "Verification email sent successfully. Please check your inbox."
      );
    } catch (err) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100/30 to-amber-50/10 rounded-full -mt-20 -mr-20 blur-md"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/20 to-amber-100/5 rounded-full -mb-10 -ml-10 blur-sm"></div>

        {/* Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-amber-100 to-amber-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
          {/* Enhanced decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-amber-100/10 rounded-full -mr-16 -mt-16 blur-sm"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-300/20 to-amber-100/5 rounded-full -ml-10 -mb-10 blur-sm"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"></div>
          <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-amber-300/20 rounded-full blur-sm"></div>

          {/* Golden accent line */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23b45309' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "150px",
            }}
          ></div>

          <div className="relative z-10 transition-transform duration-500 hover:scale-105">
            <div className="relative">
              <img
                src={BookCoverImage}
                alt="Book cover"
                className="w-full h-auto max-h-[400px] object-contain drop-shadow-xl rounded-lg"
              />
              <div className="absolute -inset-1 bg-amber-400/20 rounded-xl blur-md -z-10"></div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col relative">
          {/* Subtle corner accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-200 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-200 rounded-bl-xl"></div>

          <div className="mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-inner">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <h1 className="text-3xl font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                Verify Email
              </h1>
            </div>
            <div className="h-px w-20 bg-amber-200 my-3 ml-12"></div>
            <p className="text-stone-600 ml-12">
              Complete your account verification
            </p>
          </div>

          {error && (
            <div className="mb-6 p-5 border-l-4 border-red-500 bg-red-50 text-red-700 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full opacity-30 -mr-6 -mt-6"></div>
              <div className="relative z-10 flex items-start">
                <div className="mr-3 mt-0.5">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-5 border-l-4 border-green-500 bg-green-50 text-green-700 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full opacity-30 -mr-6 -mt-6"></div>
              <div className="relative z-10 flex items-start">
                <div className="mr-3 mt-0.5">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="token"
                className="block text-sm font-medium text-stone-700"
              >
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  required
                  placeholder="Enter the 6-digit verification code"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Shield className="h-5 w-5 mr-2" />
              )}
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-600 mb-4">
              Didn't receive the verification code?
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={loading}
              className="text-sm font-medium text-amber-700 hover:text-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 inline mr-1" />
              Resend verification email
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-600">
              Already verified?{" "}
              <Link
                to="/login"
                className="font-medium text-amber-700 hover:text-amber-900"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
