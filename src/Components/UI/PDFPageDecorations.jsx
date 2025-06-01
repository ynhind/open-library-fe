import React, { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, Star, MessageCircle } from "lucide-react";

const PDFPageDecorations = ({ 
  pageNumber, 
  totalPages, 
  isVisible = true,
  onBookmark,
  onNote,
  onHighlight 
}) => {
  const [bookmarks, setBookmarks] = useState(new Set());
  const [highlights, setHighlights] = useState(new Set());
  const [showTooltip, setShowTooltip] = useState(null);
  const [pageNotes, setPageNotes] = useState({});

  // Fun page corner decorations
  const PageCornerSticker = ({ corner, children, onClick }) => {
    const positions = {
      'top-left': 'top-2 left-2',
      'top-right': 'top-2 right-2', 
      'bottom-left': 'bottom-2 left-2',
      'bottom-right': 'bottom-2 right-2'
    };

    return (
      <div 
        className={`absolute ${positions[corner]} z-20 cursor-pointer transform hover:scale-110 transition-all duration-200`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(corner)}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <div className="relative">
          {children}
          
          {/* Tooltip */}
          {showTooltip === corner && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in">
              Click me!
            </div>
          )}
        </div>
      </div>
    );
  };

  // Animated bookmark ribbon
  const BookmarkRibbon = ({ isBookmarked, onClick }) => (
    <div 
      className={`absolute -top-2 right-4 z-20 cursor-pointer transform transition-all duration-300 ${
        isBookmarked ? 'rotate-0' : 'rotate-12 hover:rotate-0'
      }`}
      onClick={onClick}
    >
      <div className={`relative ${
        isBookmarked 
          ? 'bg-gradient-to-b from-red-400 to-red-600' 
          : 'bg-gradient-to-b from-gray-300 to-gray-500'
      } w-6 h-12 rounded-t-md shadow-lg`}>
        {/* Ribbon cut */}
        <div className="absolute bottom-0 left-0 w-0 h-0 border-l-3 border-r-3 border-t-4 border-l-transparent border-r-transparent border-t-current"></div>
        
        {/* Bookmark icon */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <Bookmark size={12} className="text-white fill-current" />
        </div>
        
        {/* Sparkle when bookmarked */}
        {isBookmarked && (
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-sparkle">
            ✨
          </div>
        )}
      </div>
    </div>
  );

  // Cute reading progress animals
  const ProgressAnimal = () => {
    const progress = (pageNumber / totalPages) * 100;
    let animal, message;
    
    if (progress < 25) {
      animal = "🐣";
      message = "Just starting!";
    } else if (progress < 50) {
      animal = "🐱";
      message = "Getting into it!";
    } else if (progress < 75) {
      animal = "🦊";
      message = "Halfway there!";
    } else if (progress < 100) {
      animal = "🦉";
      message = "Almost done!";
    } else {
      animal = "🎉";
      message = "Finished!";
    }

    return (
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-amber-200 animate-bounce">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{animal}</span>
            <span className="text-xs font-medium text-amber-800 whitespace-nowrap">
              {message}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Interactive page decorations
  const PageDecorations = () => (
    <>
      {/* Top decorations */}
      <PageCornerSticker 
        corner="top-left"
        onClick={() => {
          setBookmarks(prev => {
            const newBookmarks = new Set(prev);
            if (newBookmarks.has(pageNumber)) {
              newBookmarks.delete(pageNumber);
            } else {
              newBookmarks.add(pageNumber);
            }
            return newBookmarks;
          });
          onBookmark?.(pageNumber);
        }}
      >
        <div className="bg-gradient-to-br from-pink-200 to-pink-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-heartbeat">
          <Heart 
            size={16} 
            className={`${bookmarks.has(pageNumber) ? 'text-red-600 fill-current' : 'text-pink-600'} transition-colors`} 
          />
        </div>
      </PageCornerSticker>

      <PageCornerSticker 
        corner="top-right"
        onClick={() => {
          const note = prompt("Add a note for this page:");
          if (note) {
            setPageNotes(prev => ({ ...prev, [pageNumber]: note }));
            onNote?.(pageNumber, note);
          }
        }}
      >
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-wiggle">
          <MessageCircle size={16} className="text-blue-600" />
          {pageNotes[pageNumber] && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </PageCornerSticker>

      {/* Bottom decorations */}
      <PageCornerSticker 
        corner="bottom-left"
        onClick={() => {
          setHighlights(prev => {
            const newHighlights = new Set(prev);
            if (newHighlights.has(pageNumber)) {
              newHighlights.delete(pageNumber);
            } else {
              newHighlights.add(pageNumber);
            }
            return newHighlights;
          });
          onHighlight?.(pageNumber);
        }}
      >
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-pulse">
          <Star 
            size={16} 
            className={`${highlights.has(pageNumber) ? 'text-yellow-600 fill-current' : 'text-yellow-600'} transition-colors`} 
          />
        </div>
      </PageCornerSticker>

      <PageCornerSticker 
        corner="bottom-right"
        onClick={() => alert("Page saved to favorites!")}
      >
        <div className="bg-gradient-to-br from-green-200 to-green-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-bounce">
          <span className="text-lg">📁</span>
        </div>
      </PageCornerSticker>
    </>
  );

  // Floating reading companion
  const ReadingCompanion = () => {
    const [companionState, setCompanionState] = useState("reading");
    
    useEffect(() => {
      const states = ["reading", "thinking", "excited", "sleepy"];
      const interval = setInterval(() => {
        setCompanionState(states[Math.floor(Math.random() * states.length)]);
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    const companions = {
      reading: { emoji: "🤓", message: "Loving this story!" },
      thinking: { emoji: "🤔", message: "Hmm, interesting..." },
      excited: { emoji: "😍", message: "This is amazing!" },
      sleepy: { emoji: "😴", message: "Bedtime story?" }
    };

    return (
      <div className="fixed bottom-20 right-4 z-30 pointer-events-none">
        <div className="relative animate-float">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-amber-200">
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-bounce">{companions[companionState].emoji}</span>
              <div className="text-xs font-medium text-gray-700 max-w-20">
                {companions[companionState].message}
              </div>
            </div>
          </div>
          
          {/* Speech bubble tail */}
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/90"></div>
        </div>
      </div>
    );
  };

  // Page number with cute styling
  const CutePageNumber = () => (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-full px-4 py-2 shadow-lg border border-white/50">
        <div className="flex items-center space-x-2">
          <span className="text-sm">📄</span>
          <span className="text-sm font-bold text-purple-800">
            {pageNumber} of {totalPages}
          </span>
          <span className="text-sm">📄</span>
        </div>
      </div>
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="relative pdf-sticker-container">
      {/* Main page decorations */}
      <PageDecorations />
      
      {/* Progress indicator */}
      <ProgressAnimal />
      
      {/* Bookmark ribbon */}
      <BookmarkRibbon 
        isBookmarked={bookmarks.has(pageNumber)}
        onClick={() => {
          setBookmarks(prev => {
            const newBookmarks = new Set(prev);
            if (newBookmarks.has(pageNumber)) {
              newBookmarks.delete(pageNumber);
            } else {
              newBookmarks.add(pageNumber);
            }
            return newBookmarks;
          });
        }}
      />
      
      {/* Page number */}
      <CutePageNumber />
      
      {/* Reading companion */}
      <ReadingCompanion />
      
      {/* Floating sparkles around highlighted pages */}
      {highlights.has(pageNumber) && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-4 right-8 text-yellow-400 animate-sparkle">✨</div>
          <div className="absolute bottom-8 left-8 text-yellow-400 animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-1/2 left-4 text-yellow-400 animate-sparkle" style={{ animationDelay: '1s' }}>✨</div>
        </div>
      )}
      
      {/* Love hearts around favorited pages */}
      {bookmarks.has(pageNumber) && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-8 left-8 text-red-400 animate-bounce">💕</div>
          <div className="absolute bottom-12 right-12 text-red-400 animate-bounce" style={{ animationDelay: '0.3s' }}>💕</div>
          <div className="absolute top-1/3 right-8 text-red-400 animate-bounce" style={{ animationDelay: '0.6s' }}>💕</div>
        </div>
      )}
    </div>
  );
};

export default PDFPageDecorations;
