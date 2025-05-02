import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { loginUser } from "../../utils/authApi";
import { redirectBasedOnRole } from "../../utils/roleUtils";
import FeaturedBook5 from "../../assets/FeaturedBooksImages/FeaturedBook5.png";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
=======
import { apiRequest } from "../../utils/api";
import "./Login.css";
import BookCoverImage from "../../assets/HeaderBooks/headerBook1.png";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
>>>>>>> 7838768 (authentication)
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  const [, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  // Check if user was redirected due to session expiration
  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("expired") === "true") {
      setSessionExpired(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    setShowVerificationLink(false);

    try {
<<<<<<< HEAD
      const response = await loginUser(formData);
=======
      const response = await apiRequest("auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
>>>>>>> 7838768 (authentication)

      // Store the token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

<<<<<<< HEAD
      // Redirect based on user role
      if (response.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
=======
      // Redirect to home page
      navigate("/");
>>>>>>> 7838768 (authentication)
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
<<<<<<< HEAD
  // Remove JSX fragment that was outside the return statement
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
                src={FeaturedBook5}
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
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
              <h1 className="text-3xl font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                Welcome Back
              </h1>
            </div>
            <div className="h-px w-20 bg-amber-200 my-3 ml-12"></div>
            <p className="text-stone-600 ml-12">
              Sign in to continue to OpenLib88
            </p>
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

          {showVerificationLink && (
            <div className="mb-6 p-5 border-l-4 border-amber-500 bg-amber-50 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-full opacity-30 -mr-6 -mt-6"></div>
              <div className="relative z-10">
                <p className="text-amber-800 mb-2 font-medium flex items-center">
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
                    className="mr-2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                  Your account needs verification
                </p>
                <Link
                  to={`/verify?email=${encodeURIComponent(
                    formData.identifier
                  )}`}
                  className="text-amber-700 font-medium hover:text-amber-900 inline-flex items-center group"
                >
                  <span className="underline-offset-4 decoration-amber-300 underline">
                    Click here to verify your account
                  </span>
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
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
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
=======
  // Add this state

  // Then in your JSX after the auth-error div
  {
    showVerificationLink && (
      <div className="auth-info">
        <Link to={`/verify?email=${encodeURIComponent(formData.email)}`}>
          Click here to verify your account
        </Link>
      </div>
    );
  }
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src={BookCoverImage} alt="Book cover" />
        </div>
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue to Open Library</p>

          {error && <div className="auth-error">{error}</div>}
          {showVerificationLink && (
            <div className="auth-info">
              <Link to={`/verify?email=${encodeURIComponent(formData.email)}`}>
                Click here to verify your account
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="auth-redirect">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
>>>>>>> 7838768 (authentication)
        </div>
      </div>
    </div>
  );
}
