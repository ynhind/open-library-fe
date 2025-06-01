import React from "react";

const ScrollIndicator = ({ progress }) => {
  // Calculate styles based on progress (0-100)
  const progressPercentage = Math.min(100, Math.max(0, progress)); // Clamp between 0-100

  return (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 flex flex-col items-center">
      <div className="h-52 w-2 bg-amber-100/70 rounded-full relative">
        <div
          className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-amber-500 to-amber-300"
          style={{ height: `${progressPercentage}%` }}
        />
        {/* Progress marker */}
        <div
          className="absolute w-5 h-5 bg-amber-500 rounded-full border-2 border-white shadow-md -ml-1.5"
          style={{
            bottom: `${progressPercentage}%`,
            transform: "translateY(50%)",
          }}
        />

        {/* Reading indicator icon at the top */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full shadow-sm border border-amber-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-amber-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        {/* Reading indicator label at the bottom */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-amber-800 font-medium">
          {progressPercentage}%
        </div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
