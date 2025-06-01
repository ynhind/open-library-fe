import React, { useState, useEffect, useRef } from "react";

const ReadingAtmosphere = ({ isActive = true, theme = "cozy" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (isActive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isActive]);

  // Create floating particles
  useEffect(() => {
    if (!isActive) return;

    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 2 + 0.5,
      emoji: ["✨", "📚", "💫", "🌟", "📖", "💝"][Math.floor(Math.random() * 6)],
      opacity: Math.random() * 0.8 + 0.2,
      drift: (Math.random() - 0.5) * 2,
    });

    const initialParticles = Array.from({ length: 8 }, createParticle);
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((particle) => ({
            ...particle,
            y: particle.y - particle.speed,
            x: particle.x + particle.drift,
            opacity: particle.y < 100 ? particle.opacity * 0.98 : particle.opacity,
          }))
          .filter((particle) => particle.y > -50 && particle.opacity > 0.1);

        // Add new particle occasionally
        if (Math.random() < 0.3 && newParticles.length < 15) {
          newParticles.push(createParticle());
        }

        return newParticles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  // Floating reading quotes
  const ReadingQuote = () => {
    const quotes = [
      "A book is a dream you hold in your hands",
      "Reading is dreaming with open eyes",
      "Books are a uniquely portable magic",
      "Every book is a new adventure",
      "Words have no single fixed meaning"
    ];

    const [currentQuote, setCurrentQuote] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
      }, 8000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/50 animate-fade-in">
          <p className="text-sm text-gray-700 font-medium italic text-center max-w-xs">
            "{quotes[currentQuote]}"
          </p>
        </div>
      </div>
    );
  };

  // Interactive cursor follower
  const CursorFollower = () => (
    <div
      className="fixed pointer-events-none z-30 transition-transform duration-200 ease-out"
      style={{
        left: mousePosition.x - 20,
        top: mousePosition.y - 20,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative">
        {/* Main cursor decoration */}
        <div className="w-8 h-8 bg-gradient-to-br from-amber-200/60 to-amber-400/60 rounded-full animate-pulse"></div>
        
        {/* Trailing sparkles */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400/80 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400/80 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
      </div>
    </div>
  );

  // Ambient background patterns
  const BackgroundPattern = () => (
    <div className="fixed inset-0 pointer-events-none z-10 opacity-30">
      {/* Subtle book pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z' fill='%23d97706'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      ></div>
    </div>
  );

  // Reading mood indicator
  const MoodIndicator = () => {
    const [mood, setMood] = useState("focused");
    
    const moods = {
      focused: { emoji: "🧘‍♀️", color: "blue", text: "Deep Focus" },
      inspired: { emoji: "💡", color: "yellow", text: "Inspired" },
      relaxed: { emoji: "😌", color: "green", text: "Chill Mode" },
      excited: { emoji: "🤩", color: "purple", text: "Page Turner!" }
    };

    useEffect(() => {
      const moodKeys = Object.keys(moods);
      const interval = setInterval(() => {
        setMood(moodKeys[Math.floor(Math.random() * moodKeys.length)]);
      }, 10000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="fixed bottom-4 left-4 z-40">
        <div className={`bg-${moods[mood].color}-100 border border-${moods[mood].color}-300 rounded-full px-4 py-2 shadow-lg animate-heartbeat`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{moods[mood].emoji}</span>
            <span className={`text-sm font-medium text-${moods[mood].color}-800`}>
              {moods[mood].text}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Page turn effect
  const PageTurnEffect = () => (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Subtle paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23d4aa7d' fill-opacity='0.3' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );

  if (!isActive) return null;

  return (
    <>
      {/* Background atmosphere */}
      <BackgroundPattern />
      <PageTurnEffect />
      
      {/* Interactive elements */}
      <CursorFollower />
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-lg animate-float"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              fontSize: `${particle.size * 2}px`,
              animationDuration: `${4 + particle.speed}s`,
              animationDelay: `${particle.id % 2}s`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
      
      {/* UI elements */}
      <ReadingQuote />
      <MoodIndicator />
      
      {/* Corner magic effects */}
      <div className="fixed top-4 left-4 pointer-events-none z-30">
        <div className="relative">
          <span className="text-3xl animate-wiggle">🪄</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"></div>
        </div>
      </div>
      
      <div className="fixed bottom-16 right-16 pointer-events-none z-30">
        <div className="relative">
          <span className="text-2xl animate-bounce">🌙</span>
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-60"></div>
        </div>
      </div>
    </>
  );
};

export default ReadingAtmosphere;
