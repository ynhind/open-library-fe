import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/authApi";
import FeaturedBook5 from "../../assets/FeaturedBooksImages/FeaturedBook5.png";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    setShowVerificationLink(false);

    try {
      const response = await loginUser(formData);

      // Store the token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home page
      navigate("/");
      setShowVerificationLink(true);
    } catch (err) {
      console.error("Login error:", err);

      // Check if the error is about verification
      if (err.message && err.message.toLowerCase().includes("not verified")) {
        setError(
          "Your account needs verification. Please check your email or verify now."
        );
        setShowVerificationLink(true);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Remove JSX fragment that was outside the return statement
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-amber-100 to-amber-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-800 opacity-10 rounded-lg m-3"></div>
          <div className="relative z-10 transition-transform duration-500 hover:scale-105">
            <img
              src={FeaturedBook5}
              alt="Book cover"
              className="w-full h-auto max-h-[500px] object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-stone-600">
              Sign in to continue to Open Library
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          {showVerificationLink && (
            <div className="mb-6 p-4 border-l-4 border-amber-500 bg-amber-50 rounded">
              <p className="text-amber-800 mb-2">
                Your account needs verification.
              </p>
              <Link
                to={`/verify?email=${encodeURIComponent(formData.identifier)}`}
                className="text-amber-700 font-medium hover:text-amber-900 underline"
              >
                Click here to verify your account
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-stone-700"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username or email"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-stone-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-amber-700 hover:text-amber-900"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-amber-700 hover:text-amber-900"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
