import React, { useState, useEffect } from "react";
import bookworm from "../../assets/stickers/bookworm.svg";
import star from "../../assets/stickers/star.svg";
import cat from "../../assets/stickers/cat.svg";
import coffee from "../../assets/stickers/coffee.svg";
import book from "../../assets/stickers/book.svg";
import pencil from "../../assets/stickers/pencil.svg";
import paper from "../../assets/stickers/paper.svg";
import smartbook from "../../assets/stickers/smartbook.svg";
import StickerTooltip from "./StickerTooltip";
import SparkleEffect from "./SparkleEffect";
import confetti from "canvas-confetti";

// Define positions for stickers
const stickerPositions = {
  topLeft: "absolute top-[-30px] left-[-25px] transform rotate-[-15deg] z-10",
  topRight: "absolute top-[-20px] right-[-15px] transform rotate-[10deg] z-10",
  bottomLeft:
    "absolute bottom-[-15px] left-[20px] transform rotate-[5deg] z-10",
  bottomRight:
    "absolute bottom-[-25px] right-[10px] transform rotate-[-10deg] z-10",
  rightCenter: "absolute top-1/3 right-[-30px] transform rotate-[15deg] z-10",
  leftCenter: "absolute top-2/3 left-[-20px] transform rotate-[-5deg] z-10",
  rightBottom:
    "absolute bottom-1/4 right-[-25px] transform rotate-[20deg] z-10",
  leftTop: "absolute top-1/4 left-[-25px] transform rotate-[-10deg] z-10",
};

// Sticker sizes
const stickerSizes = {
  small: "w-12 h-12",
  medium: "w-16 h-16",
  large: "w-20 h-20",
};

const stickers = {
  bookworm: {
    src: bookworm,
    alt: "Cute bookworm sticker",
  },
  star: {
    src: star,
    alt: "Cute star sticker",
  },
  cat: {
    src: cat,
    alt: "Cute cat sticker",
  },
  coffee: {
    src: coffee,
    alt: "Cute coffee sticker",
  },
  book: {
    src: book,
    alt: "Cute book sticker",
  },
  pencil: {
    src: pencil,
    alt: "Cute pencil sticker",
  },
  paper: {
    src: paper,
    alt: "Cute paper sticker",
  },
  smartbook: {
    src: smartbook,
    alt: "Cute smart book sticker",
  },
};

const PdfStickers = () => {
  const [clickCount, setClickCount] = useState(0);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Trigger confetti when clicking multiple stickers
    if (clickCount === 5) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [clickCount]);

  const handleStickerClick = (event) => {
    setClickCount((prev) => prev + 1);

    // Add sparkle effect at click position
    const newSparkle = {
      id: `sparkle-${Date.now()}`,
      x: event.clientX,
      y: event.clientY,
    };

    setSparkles((prev) => [...prev, newSparkle]);

    // Small confetti burst on each click
    confetti({
      particleCount: 30,
      spread: 50,
      startVelocity: 20,
      origin: {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      },
    });
  };

  const removeSparkle = (id) => {
    setSparkles((prev) => prev.filter((sparkle) => sparkle.id !== id));
  };

  return (
    <>
      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <SparkleEffect
          key={sparkle.id}
          x={sparkle.x}
          y={sparkle.y}
          onComplete={() => removeSparkle(sparkle.id)}
        />
      ))}

      {/* Bookworm sticker climbing on the left side */}
      <StickerTooltip text="Hi there! I love reading!">
        <img
          src={stickers.bookworm.src}
          alt={stickers.bookworm.alt}
          className={`${stickerPositions.leftCenter} ${stickerSizes.medium} drop-shadow-md animate-bounce cursor-pointer`}
          style={{ animationDuration: "3s" }}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Star sticker on the top right */}
      <StickerTooltip text="★ Rate this book!">
        <img
          src={stickers.star.src}
          alt={stickers.star.alt}
          className={`${stickerPositions.topRight} ${stickerSizes.small} drop-shadow-md animate-pulse cursor-pointer`}
          style={{ animationDuration: "2s" }}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Cat sticker at the bottom */}
      <StickerTooltip text="Meow! Reading time!">
        <img
          src={stickers.cat.src}
          alt={stickers.cat.alt}
          className={`${stickerPositions.bottomRight} ${stickerSizes.medium} drop-shadow-md hover:scale-110 transition-transform cursor-pointer animate-wiggle`}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Another star sticker on the top left */}
      <StickerTooltip text="Favorite this book!">
        <img
          src={stickers.star.src}
          alt={stickers.star.alt}
          className={`${stickerPositions.topLeft} ${stickerSizes.small} drop-shadow-md animate-pulse cursor-pointer`}
          style={{ animationDuration: "4s" }}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Coffee sticker */}
      <StickerTooltip text="Coffee and books - perfect combo!">
        <img
          src={stickers.coffee.src}
          alt={stickers.coffee.alt}
          className={`${stickerPositions.rightCenter} ${stickerSizes.medium} drop-shadow-lg hover:rotate-12 transition-transform cursor-pointer`}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Book sticker */}
      <StickerTooltip text="Books are magical!">
        <img
          src={stickers.book.src}
          alt={stickers.book.alt}
          className={`${stickerPositions.bottomLeft} ${stickerSizes.medium} drop-shadow-md hover:scale-110 transition-transform cursor-pointer`}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Pencil sticker */}
      <StickerTooltip text="Take notes while reading!">
        <img
          src={stickers.pencil.src}
          alt={stickers.pencil.alt}
          className={`${stickerPositions.leftTop} ${stickerSizes.medium} drop-shadow-md animate-float cursor-pointer`}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Paper sticker */}
      <StickerTooltip text="Bookmark this page!">
        <img
          src={stickers.paper.src}
          alt={stickers.paper.alt}
          className={`${stickerPositions.rightBottom} ${stickerSizes.small} drop-shadow-md hover:scale-110 transition-transform cursor-pointer`}
          onClick={(e) => handleStickerClick(e)}
        />
      </StickerTooltip>

      {/* Smart Book sticker - only appears after clicking other stickers */}
      {clickCount >= 3 && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-sm"></div>
          <div className="relative">
            <StickerTooltip text="You found the secret smart book! Click me!">
              <img
                src={stickers.smartbook.src}
                alt={stickers.smartbook.alt}
                className={`${stickerSizes.large} drop-shadow-xl animate-swing cursor-pointer`}
                onClick={() => {
                  // Easter egg with big confetti celebration
                  confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5, x: 0.5 },
                    colors: [
                      "#FFC107",
                      "#FF9800",
                      "#FFEB3B",
                      "#4CAF50",
                      "#03A9F4",
                    ],
                  });

                  // Reset after celebration
                  setTimeout(() => {
                    setClickCount(0);
                  }, 2000);
                }}
              />
            </StickerTooltip>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 shadow-lg">
              <p className="text-sm text-amber-800 font-medium">
                🎉 You found the magic book! 📚✨
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PdfStickers;
