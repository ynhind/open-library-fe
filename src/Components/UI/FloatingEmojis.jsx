import React from 'react';

const FloatingEmojis = () => {
  const emojis = ['📚', '🤓', '✨', '📖', '💡', '🔖', '👀', '❤️', '🎯', '🎨'];
  
  // Generate positions for emojis, some intentionally offscreen so they appear to float in
  const generatePositions = () => {
    return emojis.map((emoji, index) => {
      const isRight = Math.random() > 0.5;
      const isBottom = Math.random() > 0.5;
      
      // Random animation duration between 15-40 seconds
      const animDuration = Math.floor(Math.random() * 25) + 15;
      
      // Random position
      const horizontalPos = Math.floor(Math.random() * 120) - 20; // Some off-screen
      const verticalPos = Math.floor(Math.random() * 120) - 20; // Some off-screen
      
      // Random rotation
      const rotation = Math.floor(Math.random() * 360);
      const rotationEnd = rotation + (Math.random() > 0.5 ? 360 : -360);
      
      return {
        emoji,
        style: {
          position: 'absolute',
          [isRight ? 'right' : 'left']: `${horizontalPos}%`,
          [isBottom ? 'bottom' : 'top']: `${verticalPos}%`,
          fontSize: `${Math.floor(Math.random() * 16) + 14}px`,
          opacity: 0.7,
          transform: `rotate(${rotation}deg)`,
          animation: `float ${animDuration}s ease-in-out infinite, rotate ${animDuration * 1.5}s linear infinite`,
          animationDelay: `${index * 1.5}s`,
          zIndex: 5,
          pointerEvents: 'none', // Don't interfere with clicks
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
        },
        rotationStyle: {
          animationName: 'customRotate',
          animationDuration: `${animDuration * 1.5}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        }
      };
    });
  };
  
  const emojiPositions = generatePositions();
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojiPositions.map((item, index) => (
        <div key={index} style={item.style} className="emoji-float">
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingEmojis;
