import React, { useState } from 'react';

const BookmarkRibbon = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="absolute top-[-15px] right-[30px] z-20 cursor-pointer transform hover:scale-110 transition-transform duration-300">
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => alert('Page bookmarked! 🔖')}
      >
        {/* Ribbon */}
        <div className="w-12 h-[60px] bg-gradient-to-r from-red-500 to-red-600 rounded-b-lg shadow-lg relative overflow-hidden">
          {/* Inner shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-80"></div>
          
          {/* Fold in top corner */}
          <div className="absolute top-0 left-0 w-0 h-0 border-t-[8px] border-l-[8px] border-t-red-700 border-l-transparent"></div>
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[8px] border-r-[8px] border-t-red-700 border-r-transparent"></div>
          
          {/* Bookmark icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
            </svg>
          </div>
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-md shadow-lg p-2 text-xs text-stone-800 whitespace-nowrap z-30">
            Bookmark this page
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkRibbon;
