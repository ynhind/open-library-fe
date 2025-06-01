import React, { useState, useEffect } from "react";
import { BookOpen, Heart, Star, Coffee, Lightbulb, Bookmark } from "lucide-react";

const ReadingStickers = ({ pageNumber, totalPages, isVisible = true }) => {
  const [animationState, setAnimationState] = useState("idle");
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Cute character climbing the side
  const ClimbingCharacter = ({ side = "left" }) => (
    <div
      className={`fixed ${
        side === "left" ? "left-2" : "right-2"
      } top-1/2 transform -translate-y-1/2 z-40 pointer-events-none`}
    >
      <div className="relative">
        {/* Rope or vine for climbing */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-48 bg-gradient-to-b from-green-400 to-green-600 opacity-60 rounded-full animate-pulse"></div>
        
        {/* Cute reading mascot */}
        <div className="relative bg-gradient-to-br from-amber-200 to-amber-300 rounded-full w-12 h-12 shadow-lg animate-bounce flex items-center justify-center border-2 border-amber-400">
          <div className="text-lg">🐨</div>
          {/* Speech bubble */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 text-xs text-amber-800 shadow-md whitespace-nowrap animate-fade-in">
            Keep reading! 📚
          </div>
        </div>
        
        {/* Floating hearts */}
        <div className="absolute -top-2 -right-2 text-red-400 animate-ping">
          <Heart size={12} className="fill-current" />
        </div>
      </div>
    </div>
  );

  // Floating stickers around the screen
  const FloatingSticker = ({ icon: Icon, position, delay = 0, emoji = null }) => (
    <div
      className={`fixed ${position} pointer-events-none z-30 animate-float`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-amber-200 hover:scale-110 transition-transform duration-300">
        {emoji ? (
          <span className="text-lg">{emoji}</span>
        ) : (
          <Icon size={20} className="text-amber-600" />
        )}
      </div>
    </div>
  );

  // Reading progress indicator with cute animations
  const ReadingProgress = () => {
    const progress = (pageNumber / totalPages) * 100;
    
    return (
      <div className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-amber-200">
        <div className="relative w-16 h-16">
          {/* Progress circle */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-amber-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="text-amber-500"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center emoji that changes based on progress */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl animate-bounce">
              {progress < 25 ? "🌱" : progress < 50 ? "🌿" : progress < 75 ? "🌳" : "🎉"}
            </span>
          </div>
        </div>
        
        {/* Progress text */}
        <div className="text-center mt-1">
          <div className="text-xs font-medium text-amber-800">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-amber-600">
            {pageNumber}/{totalPages}
          </div>
        </div>
      </div>
    );
  };

  // Bookmark tabs on the side
  const BookmarkTab = ({ text, position, color = "amber" }) => (
    <div
      className={`fixed ${position} z-30 transform rotate-90 origin-bottom`}
    >
      <div className={`bg-${color}-400 text-white px-3 py-1 rounded-t-lg shadow-lg text-xs font-medium hover:bg-${color}-500 transition-colors cursor-pointer`}>
        {text}
      </div>
    </div>
  );

  // Corner decorations
  const CornerDecoration = ({ corner, emoji }) => (
    <div
      className={`fixed ${corner} z-30 pointer-events-none`}
    >
      <div className="relative">
        <div className="text-4xl opacity-60 animate-pulse">
          {emoji}
        </div>
        {/* Sparkle effect */}
        <div className="absolute top-0 right-0 text-yellow-400 animate-ping">
          ✨
        </div>
      </div>
    </div>
  );

  // Encouragement messages
  const EncouragementBubble = () => {
    const messages = [
      "Great job reading! 📖",
      "You're doing amazing! ⭐",
      "Keep up the good work! 💪",
      "Almost there! 🎯",
      "Reading superhero! 🦸‍♀️"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-slide-up">
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
          {randomMessage}
        </div>
      </div>
    );
  };

  // Show encouragement at certain milestones
  useEffect(() => {
    const progress = (pageNumber / totalPages) * 100;
    if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }
  }, [pageNumber, totalPages]);

  if (!isVisible) return null;

  return (
    <>
      {/* Climbing characters */}
      <ClimbingCharacter side="left" />
      <ClimbingCharacter side="right" />
      
      {/* Floating stickers */}
      <FloatingSticker
        emoji="📚"
        position="top-8 left-8"
        delay={0}
      />
      <FloatingSticker
        icon={Coffee}
        position="top-20 right-20"
        delay={1}
      />
      <FloatingSticker
        emoji="✨"
        position="bottom-20 left-16"
        delay={2}
      />
      <FloatingSticker
        icon={Lightbulb}
        position="bottom-32 right-8"
        delay={0.5}
      />
      <FloatingSticker
        emoji="🎭"
        position="top-1/3 left-4"
        delay={1.5}
      />
      <FloatingSticker
        emoji="🌟"
        position="bottom-1/3 right-12"
        delay={2.5}
      />
      
      {/* Reading progress */}
      <ReadingProgress />
      
      {/* Bookmark tabs */}
      <BookmarkTab
        text="Chapter 1"
        position="top-32 -left-8"
        color="red"
      />
      <BookmarkTab
        text="Notes"
        position="top-48 -left-8"
        color="blue"
      />
      <BookmarkTab
        text="Favorite"
        position="top-64 -left-8"
        color="green"
      />
      
      {/* Corner decorations */}
      <CornerDecoration corner="top-2 left-2" emoji="📖" />
      <CornerDecoration corner="top-2 right-2" emoji="🎨" />
      <CornerDecoration corner="bottom-2 left-2" emoji="🌸" />
      <CornerDecoration corner="bottom-2 right-2" emoji="🦋" />
      
      {/* Encouragement bubble */}
      {showEncouragement && <EncouragementBubble />}
      
      {/* Reading companion that follows the mouse */}
      <div className="fixed bottom-4 right-4 z-30 pointer-events-none">
        <div className="relative">
          <div className="bg-gradient-to-br from-pink-200 to-pink-300 rounded-full w-16 h-16 shadow-lg animate-bounce flex items-center justify-center border-2 border-pink-400">
            <span className="text-2xl">🐱</span>
          </div>
          {/* Thought bubble */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-1 text-xs text-gray-700 shadow-md whitespace-nowrap animate-fade-in">
            Enjoying the story?
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadingStickers;
