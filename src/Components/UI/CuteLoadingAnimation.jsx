import React from "react";

const CuteLoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="relative w-24 h-24 mb-4">
        {/* Book */}
        <div className="absolute inset-0 bg-amber-500 rounded-r-md rounded-b-md">
          <div className="absolute left-[10%] right-[10%] top-[10%] bottom-[10%] bg-white rounded-r-sm rounded-b-sm p-1">
            <div className="w-full h-[4px] bg-amber-500 mb-1 rounded-full"></div>
            <div className="w-3/4 h-[4px] bg-amber-500 mb-1 rounded-full"></div>
            <div className="w-full h-[4px] bg-amber-500 mb-1 rounded-full"></div>
            <div className="w-2/3 h-[4px] bg-amber-500 rounded-full"></div>
          </div>
        </div>

        {/* Page flip animation */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full bg-stone-100 rounded-tr-md origin-left animate-[flip_1.5s_ease-in-out_infinite]"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 p-2">
            <div className="w-full h-[3px] bg-stone-300 mb-1 rounded-full"></div>
            <div className="w-1/2 h-[3px] bg-stone-300 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="text-amber-800 text-center">
        <p className="font-medium text-lg mb-1">Loading your book</p>
        <div className="flex justify-center items-center">
          <span className="animate-bounce mx-[2px] delay-75">.</span>
          <span className="animate-bounce mx-[2px] delay-150">.</span>
          <span className="animate-bounce mx-[2px] delay-300">.</span>
        </div>
      </div>
    </div>
  );
};

export default CuteLoadingAnimation;
