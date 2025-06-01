import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-amber-100/30" />
      
      {/* Animated shapes */}
      <div className="absolute w-20 h-20 bg-amber-100/50 rounded-full top-[10%] left-[5%] animate-float" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute w-12 h-12 bg-amber-200/50 rounded-full top-[70%] left-[8%] animate-float" 
           style={{ animationDuration: '9s', animationDelay: '1s' }} />
      <div className="absolute w-16 h-16 bg-amber-100/50 rounded-full top-[20%] right-[7%] animate-float" 
           style={{ animationDuration: '7s', animationDelay: '0.5s' }} />
      <div className="absolute w-10 h-10 bg-amber-200/50 rounded-full top-[80%] right-[10%] animate-float" 
           style={{ animationDuration: '10s', animationDelay: '1.5s' }} />
      
      {/* Dotted pattern */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `radial-gradient(circle, rgba(251, 191, 36, 0.1) 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }} />
    </div>
  );
};

export default AnimatedBackground;
