import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Parse the JWT token to get user information
        // JWT tokens consist of three parts: header.payload.signature
        const payload = token.split(".")[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);

        setIsLoggedIn(true);
        setUsername(userData.username || "");
      } catch (error) {
        console.error("Error parsing token data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Control typing animation
  useEffect(() => {
    if (!isLoggedIn || !username) return;

    const fullText = `Welcome, ${username}`;

    if (charIndex < fullText.length) {
      // Calculate typing speed - slow down slightly when typing username for emphasis
      const isTypingUsername = charIndex >= 8; // "Welcome, " is 9 chars
      const baseSpeed = isTypingUsername ? 80 : 50;
      const variation = isTypingUsername ? 40 : 30;
      const typingSpeed = Math.random() * variation + baseSpeed;

      const typingTimer = setTimeout(() => {
        setCharIndex(charIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(typingTimer);
    } else {
      setTypingComplete(true);

      // Start cursor blinking after typing is complete
      const cursorInterval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [isLoggedIn, username, charIndex]);

  // Separate effect for cursor blinking even during typing
  useEffect(() => {
    if (!isLoggedIn) return;

    const cursorBlinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorBlinkInterval);
  }, [isLoggedIn]);

  // Get the typed text up to the current character index
  const getTypedText = () => {
    if (!isLoggedIn || !username) return "";

    const fullText = `Welcome, ${username}`;
    return fullText.slice(0, charIndex);
  };

  return (
    <section className="pt-20 pb-20 md:pt-28 md:pb-24 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-amber-300 rounded-full opacity-10 blur-3xl"></div>

      <div className="container pt-4 mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 drop-shadow-sm">
          <span className="text-stone-800">Explore Literary </span>
          <span className="text-amber-800 relative">Worlds.</span>
        </h1>

        <p className="text-lg md:text-xl text-stone-700 mb-10 max-w-2xl mx-auto leading-relaxed ">
          With a modernized navigation experience, browse our collection with
          ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-800 border border-amber-700 text-amber-50 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg group relative overflow-hidden"
          >
            <span className="absolute inset-0 w-0 bg-amber-900 transition-all duration-300 ease-out group-hover:w-full"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-amber-50 relative z-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <span className="relative z-10">Explore Collection</span>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center h-12 sm:h-14 min-w-[200px] sm:min-w-[250px] px-3 sm:px-5 py-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-md shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
              <span className="animate-wave inline-block text-xl sm:text-2xl mr-1 sm:mr-2">
                👋
              </span>
              <div className="flex items-center font-serif text-base sm:text-lg flex-1 justify-center">
                <span className="text-stone-800">
                  {getTypedText().split(",")[0]}
                </span>
                {getTypedText().includes(",") && (
                  <>
                    <span className="text-stone-800">,</span>
                    <span className="font-bold text-amber-800 animate-color-shift ml-1">
                      {getTypedText().split(",")[1]}
                    </span>
                  </>
                )}
                <span
                  className={`h-5 sm:h-6 w-0.5 bg-amber-800 ml-0.5 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-100`}
                ></span>
              </div>
              {typingComplete && (
                <div className="ml-1 sm:ml-2 overflow-hidden">
                  <div className="animate-bounce-in delay-500">
                    <span className="text-xs bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 shadow-inner flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-pulse"></span>
                      member
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-100 to-amber-200  hover:bg-stone-100 text-stone-800 border border-solid border-amber-200 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-0 bg-stone-800 transition-all duration-300 ease-out group-hover:w-full"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-amber-800 group-hover:text-amber-200 relative z-10 transition-colors"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="relative z-10 group-hover:text-white transition-colors">
                Being a Member
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
