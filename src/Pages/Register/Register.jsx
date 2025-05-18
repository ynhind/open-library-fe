import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FeaturedBook7 from "../../assets/FeaturedBooksImages/FeaturedBook7.png";
import { Eye, EyeOff, Mail, Lock, User, MapPin, UserPlus } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Remove confirmPassword from payload
    const { confirmPassword, ...registerPayload } = formData;

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-amber-100 to-amber-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden order-1 md:order-2">
          <div className="absolute inset-0 bg-amber-800 opacity-10 rounded-lg m-3"></div>
          <div className="relative z-10 transition-transform duration-500 hover:scale-105">
            <img
              src={FeaturedBook7}
              alt="Book cover"
              className="w-full h-auto max-h-[500px] object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col order-2 md:order-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">
              Create Account
            </h1>
            <p className="text-stone-600">Join Open Library today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-stone-700"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Email
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
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-stone-700"
              >
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your address"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Create password"
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

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-stone-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-stone-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    className="block w-full pl-10 pr-10 py-3 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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

            <div className="mt-4 flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree" className="text-stone-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
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

          <p className="mt-8 text-center text-sm text-stone-800">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-amber-700 hover:text-amber-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
