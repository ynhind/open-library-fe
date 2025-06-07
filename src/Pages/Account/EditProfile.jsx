import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserInformation,
  updateUserProfile,
  requestPasswordChange,
  confirmPasswordChange,
} from "../../utils/userApi";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  MapPin,
  Save,
  Shield,
  Clock,
  ArrowLeft,
  Check,
  X,
  FileEdit,
  Lock,
  KeyRound,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    verificationToken: "",
  });
  const [passwordChangeStep, setPasswordChangeStep] = useState(0); // 0: not started, 1: requested, 2: entering token
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await getUserInformation();
        setUserInfo(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          address: data.address || "",
        });
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRequestPasswordChange = useCallback(
    async (e) => {
      e.preventDefault();

      if (!passwordFormData.currentPassword) {
        toast.warning("Please enter your current password");
        return;
      }

      if (passwordChangeStep === 1) {
        if (
          !passwordFormData.verificationToken ||
          !passwordFormData.newPassword
        ) {
          toast.warning("Both token and new password are required");
          return;
        }

        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }

        try {
          setPasswordLoading(true);
          setPasswordError(null);

          const response = await confirmPasswordChange(
            passwordFormData.verificationToken,
            passwordFormData.newPassword
          );

          toast.success(response.message || "Password changed successfully!");
          setPasswordChangeStep(0);
          setPasswordFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            verificationToken: "",
          });
        } catch (err) {
          console.error("Failed to confirm password change:", err);
          const errorMessage =
            err.error ||
            err.message ||
            "Failed to change password. Please try again.";
          toast.error(errorMessage);
          setPasswordError(errorMessage);
        } finally {
          setPasswordLoading(false);
        }
      } else {
        try {
          setPasswordLoading(true);
          setPasswordError(null);

          const response = await requestPasswordChange(
            passwordFormData.currentPassword
          );

          toast.success(
            response.message || "Verification token sent to your email!"
          );
          setPasswordChangeStep(1);
        } catch (err) {
          console.error("Failed to request password change:", err);
          const errorMessage =
            err.error ||
            err.message ||
            "Failed to request password change. Please try again.";
          toast.error(errorMessage);
          setPasswordError(errorMessage);
        } finally {
          setPasswordLoading(false);
        }
      }
    },
    [passwordFormData, passwordChangeStep]
  );

  const handleCancelPasswordChange = useCallback(() => {
    setPasswordChangeStep(0);
    setPasswordError(null);
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      verificationToken: "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Prepare data for submission - only include fields that have values and have been changed
      const updateData = {};
      if (
        formData.firstName !== undefined &&
        formData.firstName.trim() !== (userInfo.firstName || "")
      )
        updateData.firstName = formData.firstName.trim();

      if (
        formData.lastName !== undefined &&
        formData.lastName.trim() !== (userInfo.lastName || "")
      )
        updateData.lastName = formData.lastName.trim();

      if (
        formData.address !== undefined &&
        formData.address.trim() !== (userInfo.address || "")
      )
        updateData.address = formData.address.trim();

      // Check if there are any changes to submit
      if (Object.keys(updateData).length === 0) {
        toast.warning(
          "No changes detected. Please modify at least one field to update your profile."
        );
        return;
      }

      try {
        setLoading(true);
        console.log("Sending profile update data:", updateData);
        console.log("Starting profile update with XMLHttpRequest...");
        const response = await updateUserProfile(updateData);
        console.log("Profile update response:", response);

        // Handle the updated response format from the backend
        if (response && response.message) {
          toast.success(response.message);
        } else {
          toast.success("Profile updated successfully!");
        }

        // Update user info with the returned data if available
        if (response && response.data) {
          setUserInfo(response.data);
        }

        navigate("/account");
      } catch (err) {
        console.error("Failed to update profile:", err);
        console.error("Error details:", JSON.stringify(err, null, 2));
        // Handle the updated error format from the backend
        const errorMessage =
          err.error ||
          err.message ||
          "Failed to update profile. Please try again later.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [formData, userInfo, navigate]
  );

  if (loading && !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 to-amber-100/40 py-10 flex items-center justify-center">
        <div className="relative">
          {/* Premium Loading Animation */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 animate-pulse opacity-20"></div>
            <div className="absolute inset-2 bg-white rounded-full shadow-inner"></div>
            <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-200 rounded-full shadow-inner"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-300 rounded-full shadow-inner"></div>
          </div>
          <p className="mt-6 text-amber-800 font-medium tracking-wide animate-pulse">
            Loading your profile...
          </p>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 to-amber-100/40 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Enhanced Breadcrumb navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative">
              {/* Golden accent line */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
              <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>

              <div className="px-6 py-8 flex flex-col items-center relative z-10">
                {/* Premium avatar */}
                <div className="relative w-24 h-24 mb-6 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner border border-amber-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileEdit className="text-amber-700" size={32} />
                  </div>
                  <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm"></div>
                </div>

                <h2 className="text-xl font-serif font-bold text-stone-800 mb-6 text-center">
                  Profile Information
                </h2>

                <div className="space-y-4 w-full">
                  <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-100 flex items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-1.5 bg-amber-100 rounded-md mr-3 flex-shrink-0">
                      <Check size={14} className="text-amber-700" />
                    </div>
                    <p className="text-sm text-stone-600">
                      Update your personal details for a personalized experience
                    </p>
                  </div>

                  <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-100 flex items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-1.5 bg-amber-100 rounded-md mr-3 flex-shrink-0">
                      <Check size={14} className="text-amber-700" />
                    </div>
                    <p className="text-sm text-stone-600">
                      Add your shipping address for faster checkout
                    </p>
                  </div>

                  <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-100 flex items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-1.5 bg-amber-100 rounded-md mr-3 flex-shrink-0">
                      <Check size={14} className="text-amber-700" />
                    </div>
                    <p className="text-sm text-stone-600">
                      Your email and username cannot be changed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative">
              {/* Golden accent line */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

              <div className="px-8 py-6 border-b border-amber-100 bg-gradient-to-r from-amber-50/80 to-white flex justify-between items-center">
                <h2 className="text-2xl font-serif font-semibold text-stone-800 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-amber-700" />
                  Edit Your Profile
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8">
                <div className="grid grid-cols-1 gap-y-6">
                  {/* Username - Read-only */}
                  <div className="flex flex-col">
                    <label className="text-xs text-stone-500 mb-2 block">
                      Username
                    </label>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                        <User className="text-amber-700" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center h-[42px] w-full border border-amber-100 bg-amber-50/30 rounded-lg px-4 py-2.5">
                          <p className="font-medium text-stone-800">
                            {userInfo.username}
                          </p>
                          <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-100">
                            Read-only
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email - Read-only */}
                  <div className="flex flex-col">
                    <label className="text-xs text-stone-500 mb-2 block">
                      Email Address
                    </label>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                        <Mail className="text-amber-700" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center h-[42px] w-full border border-amber-100 bg-amber-50/30 rounded-lg px-4 py-2.5">
                          <p className="font-medium text-stone-800">
                            {userInfo.email}
                          </p>
                          <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-100">
                            Read-only
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="text-xs text-stone-500 mb-2 block"
                    >
                      First Name
                    </label>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                        <User className="text-amber-700" size={18} />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="w-full h-[42px] border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="text-xs text-stone-500 mb-2 block"
                    >
                      Last Name
                    </label>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                        <User className="text-amber-700" size={18} />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="w-full h-[42px] border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="address"
                      className="text-xs text-stone-500 mb-2 block"
                    >
                      Shipping Address
                    </label>
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                        <MapPin className="text-amber-700" size={18} />
                      </div>
                      <div className="flex-1">
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your shipping address"
                          rows="2"
                          className="w-full border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center ${
                      loading
                        ? "bg-amber-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900"
                    } text-white py-3 px-6 rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg flex-1`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <Link
                    to="/account"
                    className={`flex items-center justify-center ${
                      loading
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "hover:bg-amber-50"
                    } bg-white border border-amber-200 text-stone-700 py-3 px-6 rounded-lg transition-all duration-300 text-sm shadow-sm hover:shadow flex-1`}
                    onClick={(e) => loading && e.preventDefault()}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Password Change Section */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative">
              {/* Golden accent line */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

              <div className="px-8 py-6 border-b border-amber-100 bg-gradient-to-r from-amber-50/80 to-white flex justify-between items-center">
                <h2 className="text-2xl font-serif font-semibold text-stone-800 flex items-center">
                  <Lock className="h-6 w-6 mr-2 text-amber-700" />
                  Change Password
                </h2>
              </div>

              <form
                onSubmit={handleRequestPasswordChange}
                className="px-8 py-8"
              >
                <div className="grid grid-cols-1 gap-y-6">
                  {/* Current Password */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="currentPassword"
                      className="text-xs text-stone-500 mb-2 block"
                    >
                      Current Password
                    </label>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                        <KeyRound className="text-amber-700" size={18} />
                      </div>
                      <div className="flex-1">
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordFormData.currentPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Enter your current password"
                          className="w-full h-[42px] border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          disabled={passwordChangeStep === 1}
                        />
                      </div>
                    </div>
                  </div>

                  {passwordChangeStep === 1 && (
                    <>
                      {/* Verification Token */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="verificationToken"
                          className="text-xs text-stone-500 mb-2 block"
                        >
                          Verification Token
                        </label>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                            <KeyRound className="text-amber-700" size={18} />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              id="verificationToken"
                              name="verificationToken"
                              value={passwordFormData.verificationToken}
                              onChange={handlePasswordInputChange}
                              placeholder="Enter the verification token from your email"
                              className="w-full h-[42px] border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          Check your email for a verification token
                        </p>
                      </div>

                      {/* New Password */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="newPassword"
                          className="text-xs text-stone-500 mb-2 block"
                        >
                          New Password
                        </label>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                            <Lock className="text-amber-700" size={18} />
                          </div>
                          <div className="flex-1">
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={passwordFormData.newPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="Enter your new password"
                              className="w-full h-[42px] border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="confirmPassword"
                          className="text-xs text-stone-500 mb-2 block"
                        >
                          Confirm New Password
                        </label>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4 shadow-sm border border-amber-100 flex-shrink-0">
                            <Lock className="text-amber-700" size={18} />
                          </div>
                          <div className="flex-1">
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordFormData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="Confirm your new password"
                              className="w-full h-[42px] border border-amber-200 bg-amber-50/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                      <AlertTriangle className="text-red-500 h-5 w-5 mr-3 flex-shrink-0" />
                      <p className="text-sm text-red-700">{passwordError}</p>
                    </div>
                  )}
                </div>

                <div className="mt-10 flex space-x-4">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className={`flex items-center justify-center ${
                      passwordLoading
                        ? "bg-amber-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900"
                    } text-white py-3 px-6 rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg flex-1`}
                  >
                    {passwordLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {passwordChangeStep === 0
                          ? "Sending Token..."
                          : "Updating Password..."}
                      </>
                    ) : (
                      <>
                        {passwordChangeStep === 0 ? (
                          <>
                            <KeyRound size={16} className="mr-2" />
                            Request Password Change
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} className="mr-2" />
                            Confirm Password Change
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {passwordChangeStep === 1 && (
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      disabled={passwordLoading}
                      className={`flex items-center justify-center ${
                        passwordLoading
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "hover:bg-amber-50"
                      } bg-white border border-amber-200 text-stone-700 py-3 px-6 rounded-lg transition-all duration-300 text-sm shadow-sm hover:shadow flex-1`}
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Premium recommendations */}
            <div className="mt-6 bg-gradient-to-r from-amber-700 to-amber-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-amber-600/20 rounded-full -mr-20 -mt-20 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/30 rounded-full -ml-10 -mb-10 blur-md"></div>

              <div className="flex items-start relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-serif mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-amber-100 text-sm mb-4">
                    A complete profile helps us personalize your book
                    recommendations and improve your shopping experience.
                  </p>
                  <div className="inline-flex items-center bg-white text-amber-800 py-2 px-4 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium group">
                    <span>Thank you!</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100/10 flex items-center justify-center backdrop-blur-sm border border-amber-100/30">
                  <User className="text-amber-100 h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
