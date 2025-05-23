import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle the sign-out process
    const signOut = () => {
      try {
        // Remove the authentication token from localStorage
        localStorage.removeItem("token");

        // Show success message
        toast.success("You have been successfully signed out", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error("Error during sign out:", error);
        toast.error("An error occurred while signing out", {
          position: "top-right",
          autoClose: 3000,
        });

        // Redirect to home page even if there was an error
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    };

    // Call the sign-out function when the component mounts
    signOut();
  }, [navigate]);

  // Show loading spinner during sign-out process
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <Loader
          size={40}
          className="animate-spin text-amber-700 mx-auto mb-4"
        />
        <h1 className="text-2xl font-serif font-bold text-stone-800 mb-2">
          Signing Out
        </h1>
        <p className="text-stone-600">
          Please wait while we complete the sign-out process...
        </p>
      </div>
    </div>
  );
};

export default SignOut;
