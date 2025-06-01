import React, { useState } from 'react';

const StickerTooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-3 py-1 bg-white/90 backdrop-blur-sm text-stone-800 text-xs rounded-lg shadow-lg whitespace-nowrap z-30 border border-amber-100">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-white border-r border-b border-amber-100"></div>
        </div>
      )}
    </div>
  );
};

export default StickerTooltip;
