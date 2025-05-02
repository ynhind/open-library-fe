import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import FeaturedBook7 from "../../assets/FeaturedBooksImages/FeaturedBook7.png";
import { Eye, EyeOff, Mail, Lock, User, MapPin, UserPlus } from "lucide-react";
=======
import "./Register.css";
import BookCoverImage from "../../assets/HeaderBooks/headerBook2.png";
>>>>>>> 7838768 (authentication)

import { registerUser } from "../../utils/authApi";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

=======
  const navigate = useNavigate();

>>>>>>> 7838768 (authentication)
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Remove confirmPassword from payload
<<<<<<< HEAD
    const { ...registerPayload } = formData;
=======
    const { confirmPassword, ...registerPayload } = formData;
>>>>>>> 7838768 (authentication)

    try {
      await registerUser(registerPayload);

      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/verification");
      }, 3000);
    } catch (err) {
<<<<<<< HEAD
      console.error("Registration error:", err);

      // Handle specific error messages more user-friendly
      if (
        err.message &&
        err.message.toLowerCase().includes("username already taken")
      ) {
        setError("This username is already taken. Please choose another one.");
      } else if (
        err.message &&
        err.message.toLowerCase().includes("email already exists")
      ) {
        setError(
          "An account with this email already exists. Please login instead."
        );
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
=======
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
>>>>>>> 7838768 (authentication)
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Premium background decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-100/30 to-amber-50/10 rounded-full -mt-20 -ml-20 blur-md"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tr from-amber-200/20 to-amber-100/5 rounded-full -mb-10 -mr-10 blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-amber-100/20 rounded-full blur-md animate-pulse"></div>

        {/* Image Section with Premium Styling */}
        <div className="md:w-1/2 bg-gradient-to-br from-amber-100 to-amber-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden order-1 md:order-2">
          {/* Enhanced premium decorative elements */}
          <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-amber-200/40 to-amber-100/10 rounded-full -ml-16 -mt-16 blur-sm"></div>
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tr from-amber-300/30 to-amber-100/5 rounded-full -mr-10 -mb-10 blur-sm"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-amber-200/30 rounded-full blur-sm"></div>
          <div className="absolute bottom-1/3 right-1/2 w-10 h-10 bg-amber-300/20 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-gradient-to-tr from-amber-400/10 to-amber-200/10 rounded-full blur-sm animate-pulse duration-7000"></div>

          {/* Premium gold decorative elements */}
          <div className="absolute top-8 right-8 w-20 h-1 bg-gradient-to-r from-amber-300 to-transparent rounded-full"></div>
          <div className="absolute top-12 right-12 w-12 h-1 bg-gradient-to-r from-amber-300 to-transparent rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-1 h-20 bg-gradient-to-b from-amber-300 to-transparent rounded-full"></div>
          <div className="absolute bottom-12 left-12 w-1 h-12 bg-gradient-to-b from-amber-300 to-transparent rounded-full"></div>

          {/* Golden premium accent line */}
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-l from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Luxury pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23b45309' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "150px",
            }}
          ></div>

          {/* Book showcase with premium effects */}
          <div className="relative z-10 transition-transform duration-500 hover:scale-105 group">
            <div className="relative">
              <img
                src={FeaturedBook7}
                alt="Book cover"
                className="w-full h-auto max-h-[400px] object-contain drop-shadow-xl rounded-lg transition-all duration-700 group-hover:brightness-105"
              />
              <div className="absolute -inset-1 bg-amber-400/20 rounded-xl blur-md -z-10 group-hover:bg-amber-400/30 transition-all duration-700"></div>

              {/* Premium shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-700"></div>
            </div>

            {/* Premium floating decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-amber-300/70 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-amber-300/70 rounded-br-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </div>
        </div>

        {/* Form Section - Premium Styled */}
        <div className="md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col order-2 md:order-1 relative">
          {/* Subtle premium corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-200 rounded-tl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-200 rounded-br-xl"></div>

          {/* Premium decorative elements */}
          <div className="absolute top-1/4 right-8 w-12 h-12 bg-amber-100/30 rounded-full blur-md"></div>
          <div className="absolute bottom-1/4 left-10 w-8 h-8 bg-amber-100/20 rounded-full blur-sm"></div>

          <div className="mb-8 relative">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-inner">
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
                  className="text-amber-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                Create Account
              </h1>
            </div>
            <div className="h-px w-20 bg-amber-200 my-3 ml-12"></div>
            <p className="text-stone-600 ml-12">Join OpenLib88 today</p>
          </div>

          {error && (
            <div className="mb-6 p-5 border-l-4 border-red-500 bg-red-50 text-red-700 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full opacity-30 -mr-6 -mt-6"></div>
              <div className="relative z-10 flex items-start">
                <div className="mr-3 mt-0.5">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
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
                    className="text-green-700"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-stone-700"
              >
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors"
=======
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-image">
          <img src={BookCoverImage} alt="Book cover" />
        </div>
        <div className="auth-form-container">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join Open Library today</p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
>>>>>>> 7838768 (authentication)
                />
              </div>
            </div>

<<<<<<< HEAD
            <div className="space-y-1.5">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-stone-700"
              >
                Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your address"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create password"
                    className="block w-full pl-10 pr-10 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors"
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

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-stone-700"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    className="block w-full pl-10 pr-10 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 transition-colors"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 focus:ring-offset-1 border-stone-300 rounded transition-all"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree" className="text-stone-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-amber-700 hover:text-amber-800 font-medium transition-colors relative group"
                  >
                    Terms of Service
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-amber-700 hover:text-amber-800 font-medium transition-colors relative group"
                  >
                    Privacy Policy
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 transform hover:-translate-y-0.5 active:translate-y-0"
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
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </span>
              )}
            </button>
          </form>

          <div className="relative mt-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200/60"></div>
            </div>
            <div className="relative px-4 bg-white">
              <span className="text-sm text-stone-500">or</span>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-amber-700 hover:text-amber-800 transition-colors relative group"
            >
              Sign in
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-700 to-amber-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>
=======
            <div className="form-agreement">
              <input type="checkbox" id="agree" required />
              <label htmlFor="agree">
                I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-redirect">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
>>>>>>> 7838768 (authentication)
        </div>
      </div>
    </div>
  );
}
