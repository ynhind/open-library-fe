import React, { useState, useEffect } from "react";

const CuteCharacter = ({
  isVisible = true,
  message = "Buy to unlock all pages! 📖✨",
  onBuyClick,
  bookTitle = "this amazing book",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  const messages = [
    `Buy to unlock all pages! 📖✨`,
    `Don't miss out on ${bookTitle}! 🌟`,
    `Unlock the full story! 📚💫`,
    `Purchase now for complete access! 🔓`,
    `The adventure continues... 🚀📖`,
  ];

  // Different positions along the modal frame
  const positions = [
    { position: "right-4 top-1/4", bubblePosition: "-left-64 top-2", bubbleDirection: "left" },
    { position: "right-4 top-1/2", bubblePosition: "-left-64 -top-4", bubbleDirection: "left" },
    { position: "right-4 top-3/4", bubblePosition: "-left-64 -top-8", bubbleDirection: "left" },
    { position: "right-1/4 top-4", bubblePosition: "-top-24 -left-8", bubbleDirection: "top" },
    { position: "right-1/2 top-4", bubblePosition: "-top-24 -left-16", bubbleDirection: "top" },
  ];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);

      // Cycle through messages every 4 seconds
      const messageInterval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 4000);

      // Change position every 8 seconds for climbing animation
      const positionInterval = setInterval(() => {
        setCurrentPosition((prev) => (prev + 1) % positions.length);
      }, 8000);

      return () => {
        clearInterval(messageInterval);
        clearInterval(positionInterval);
      };
    }
  }, [isVisible, messages.length, positions.length]);

  if (!isVisible) return null;

  const currentPos = positions[currentPosition];

  return (
    <div className={`fixed ${currentPos.position} z-30 pointer-events-none transition-all duration-1000`}>
      {/* Character container with climbing animation */}
      <div
        className={`relative transition-all duration-1000 ${
          isAnimating
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Speech bubble with dynamic positioning */}
        <div className={`absolute ${currentPos.bubblePosition} pointer-events-auto`}>
          <div className="relative bg-white rounded-2xl shadow-xl border-2 border-amber-200 px-4 py-3 max-w-xs">
            {/* Dynamic bubble tail based on direction */}
            {currentPos.bubbleDirection === "left" && (
              <>
                <div className="absolute right-0 top-6 w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent transform translate-x-full"></div>
                <div className="absolute right-0 top-6 w-0 h-0 border-l-[14px] border-l-amber-200 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent transform translate-x-full -translate-y-0.5"></div>
              </>
            )}
            
            {currentPos.bubbleDirection === "top" && (
              <>
                <div className="absolute bottom-0 left-8 w-0 h-0 border-t-[12px] border-t-white border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent transform translate-y-full"></div>
                <div className="absolute bottom-0 left-8 w-0 h-0 border-t-[14px] border-t-amber-200 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent transform translate-y-full translate-x-0.5"></div>
              </>
            )}

            {/* Message with typewriter effect */}
            <p className="text-sm font-medium text-amber-800 mb-2 animate-pulse">
              {messages[currentMessage]}
            </p>

            {/* Buy button */}
            <button
              onClick={onBuyClick}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              🛒 Buy Now!
            </button>
          </div>
        </div>

        {/* Cute character (owl) with enhanced climbing features */}
        <div className="relative">
          {/* Character body with climbing animation */}
          <div
            className={`transform transition-transform duration-2000 ${
              isAnimating ? "animate-bounce" : ""
            }`}
          >
            <div className="relative w-16 h-20">
              {/* Character shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-amber-900/20 rounded-full blur-sm"></div>

              {/* Main body */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full border-2 border-amber-600 shadow-lg">
                {/* Eyes with dynamic blinking */}
                <div className={`absolute top-2 left-2 w-2.5 h-2.5 bg-white rounded-full border border-amber-700 transition-all duration-200 ${currentMessage % 2 === 0 ? 'scale-y-100' : 'scale-y-50'}`}>
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-amber-900 rounded-full"></div>
                </div>
                <div className={`absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full border border-amber-700 transition-all duration-200 ${currentMessage % 2 === 0 ? 'scale-y-100' : 'scale-y-50'}`}>
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-amber-900 rounded-full"></div>
                </div>

                {/* Beak */}
                <div
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1 bg-orange-400 border border-orange-500"
                  style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }}
                ></div>

                {/* Cheeks with breathing effect */}
                <div className={`absolute top-3 left-1 w-2 h-2 bg-amber-300 rounded-full opacity-70 transition-all duration-1000 ${isAnimating ? 'animate-pulse' : ''}`}></div>
                <div className={`absolute top-3 right-1 w-2 h-2 bg-amber-300 rounded-full opacity-70 transition-all duration-1000 ${isAnimating ? 'animate-pulse' : ''}`}></div>
              </div>

              {/* Wings with flapping animation */}
              <div className={`absolute bottom-4 left-1 w-3 h-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transform shadow-md transition-transform duration-500 ${currentPosition % 2 === 0 ? '-rotate-12' : '-rotate-6'}`}>
                <div className="absolute top-1 left-0.5 w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
              </div>
              <div className={`absolute bottom-4 right-1 w-3 h-4 bg-gradient-to-l from-amber-600 to-amber-500 rounded-full transform shadow-md transition-transform duration-500 ${currentPosition % 2 === 0 ? 'rotate-12' : 'rotate-6'}`}>
                <div className="absolute top-1 right-0.5 w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
              </div>

              {/* Enhanced climbing gear */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-green-600 rounded-full opacity-60"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
              
              {/* Climbing claws/grips */}
              <div className="absolute -left-1 bottom-3 w-1.5 h-1.5 bg-gray-600 rounded-sm transform rotate-45 opacity-80"></div>
              <div className="absolute -right-1 bottom-3 w-1.5 h-1.5 bg-gray-600 rounded-sm transform rotate-45 opacity-80"></div>
            </div>
          </div>

          {/* Enhanced sparkles with varied positions */}
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-amber-300 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 -left-3 w-1 h-1 bg-amber-400 rounded-full animate-bounce"></div>
          <div
            className="absolute bottom-2 -right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating hearts and stars */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="animate-ping">❤️</div>
          </div>
          <div className="absolute -top-4 -left-4">
            <div className="animate-pulse text-yellow-400">⭐</div>
          </div>
          
          {/* Climbing trail effect */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-amber-300 rounded-full opacity-30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CuteCharacter;
