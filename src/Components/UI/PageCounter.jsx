import React from "react";

const PageCounter = ({ currentPage, totalPages }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 select-none">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-5 py-2 border border-amber-100 flex items-center gap-3">
        {/* Book icon */}
        <div className="bg-amber-100 rounded-full p-1.5">
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

        {/* Page numbers */}
        <div className="flex items-baseline">
          <span className="font-bold text-amber-800 text-lg">
            {currentPage}
          </span>
          <span className="text-stone-500 mx-1">/</span>
          <span className="text-stone-600">{totalPages}</span>
        </div>

        {/* Reading progress bar */}
        <div className="w-32 h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PageCounter;
