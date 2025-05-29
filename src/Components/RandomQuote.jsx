import React, { useState, useEffect, useCallback } from "react";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaRedoAlt,
  FaBook,
  FaStar,
} from "react-icons/fa";
import { fetchExternalQuote } from "../utils/api";

// Fallback quotes in case the API is unavailable
const fallbackQuotes = [
  {
    content:
      "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    tags: ["books", "reading", "fantasy"],
  },
  {
    content: "Books are a uniquely portable magic.",
    author: "Stephen King",
    tags: ["books", "reading"],
  },
  {
    content: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    tags: ["books", "friendship"],
  },
  {
    content: "A book is a dream that you hold in your hand.",
    author: "Neil Gaiman",
    tags: ["books", "dreams"],
  },
  {
    content: "Reading is to the mind what exercise is to the body.",
    author: "Joseph Addison",
    tags: ["books", "reading", "mind"],
  },
  {
    content:
      "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    tags: ["books", "learning", "knowledge"],
  },
  {
    content:
      "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers.",
    author: "Charles W. Eliot",
    tags: ["books", "friendship", "wisdom"],
  },
  {
    content:
      "Until I feared I would lose it, I never loved to read. One does not love breathing.",
    author: "Harper Lee",
    tags: ["books", "reading", "literature"],
  },
  {
    content: "Think before you speak. Read before you think.",
    author: "Fran Lebowitz",
    tags: ["books", "reading", "thinking"],
  },
  {
    content: "I have always imagined that Paradise will be a kind of library.",
    author: "Jorge Luis Borges",
    tags: ["books", "libraries", "paradise"],
  },
  {
    content: "Never trust anyone who has not brought a book with them.",
    author: "Lemony Snicket",
    tags: ["books", "trust", "humor"],
  },
  {
    content:
      "You can never get a cup of tea large enough or a book long enough to suit me.",
    author: "C.S. Lewis",
    tags: ["books", "tea", "reading"],
  },
  {
    content: "Classic - a book which people praise and don't read.",
    author: "Mark Twain",
    tags: ["books", "classics", "humor"],
  },
  {
    content:
      "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.",
    author: "Haruki Murakami",
    tags: ["books", "thinking", "individuality"],
  },
];

const RandomQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const getRandomFallbackQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }, []);

  const getAndSetFallbackQuote = useCallback(() => {
    const fallbackQuote = getRandomFallbackQuote();
    setQuote(fallbackQuote);
    setError(null);
  }, [getRandomFallbackQuote]);

  // Simple cache to prevent excessive API calls
  const shouldThrottleRequest = useCallback(() => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    // Only allow new requests after 5 seconds to avoid rate limiting
    return timeSinceLastFetch < 5000;
  }, [lastFetchTime]);

  const fetchRandomQuote = async () => {
    setLoading(true);
    setError(null);

    // Check if we should throttle this request
    if (shouldThrottleRequest()) {
      console.log("Throttling API request - using fallback");
      getAndSetFallbackQuote();
      setLoading(false);
      return;
    }

    setLastFetchTime(Date.now());

    try {
      // Attempt to fetch a quote using our multi-API helper function
      console.log("Fetching quote from multiple APIs...");

      // Use a category related to books or knowledge
      const categories = ["books", "knowledge", "learning", "education"];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const quoteData = await fetchExternalQuote(randomCategory);

      // Check if we got a valid quote
      if (quoteData && quoteData.content) {
        console.log("Successfully fetched quote from external API");
        setQuote(quoteData);
      } else {
        // If we got an empty quote, use fallback
        console.log("Empty quote received, using fallback");
        getAndSetFallbackQuote();
      }
    } catch (err) {
      console.error("Quote fetch error:", err.message);
      // Use a fallback quote if there was an error
      console.log("All API requests failed, using fallback quote");
      getAndSetFallbackQuote();
    } finally {
      setLoading(false);
    }
  };

  // Using useCallback to memoize the fetchRandomQuote function
  const memoizedFetchRandomQuote = useCallback(fetchRandomQuote, [
    getAndSetFallbackQuote,
    shouldThrottleRequest,
  ]);

  useEffect(() => {
    memoizedFetchRandomQuote();
  }, [memoizedFetchRandomQuote]);

  return (
    <section className="bg-gradient-to-r from-amber-100/80 to-amber-200/40 py-8 md:py-10 relative overflow-hidden">
      {/* Refined premium decorative elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300/60 via-amber-500/80 to-amber-300/60"></div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300/60 via-amber-500/80 to-amber-300/60"></div>
      <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-gradient-to-br from-amber-200/30 to-amber-100/10 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-gradient-to-tr from-amber-200/30 to-amber-100/10 blur-xl"></div>
      {/* Subtle premium pattern */}
      <div className="absolute top-1/3 right-1/3 w-20 h-px bg-amber-300/15 rotate-45"></div>
      <div className="absolute bottom-1/3 left-1/3 w-20 h-px bg-amber-300/15 rotate-45"></div>{" "}
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Premium compact card design */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-amber-200/80 relative transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
          {/* Refined gold frame accents */}
          <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
          <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-amber-300 via-amber-500/50 to-amber-300"></div>
          <div className="absolute right-0 top-0 h-full w-0.5 bg-gradient-to-b from-amber-300 via-amber-500/50 to-amber-300"></div>
          {/* Enhanced premium decorative elements */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-50 rounded-full opacity-60 -mb-16 -mr-16 blur-sm"></div>
          <div className="absolute top-1/4 left-1/6 w-20 h-20 bg-amber-50 rounded-full opacity-40 blur-md"></div>
          <div className="px-6 py-6 text-center relative z-10">
            {/* Premium elegant title */}
            <h2 className="text-xl md:text-2xl font-serif font-semibold text-stone-800 mb-1.5 flex items-center justify-center">
              <span className="inline-block w-10 h-0.5 bg-gradient-to-r from-amber-300 to-amber-500 mr-3"></span>
              Oh, my message today is...
              <span className="inline-block w-10 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 ml-3"></span>
            </h2>
            <p className="text-amber-700 text-xs italic mb-4 px-4">
              A thoughtful quote to inspire your reading journey
            </p>

            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="relative">
                  {/* Premium loading animation */}
                  <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shadow-sm"></div>
                  <div
                    className="absolute inset-0 w-12 h-12 border-2 border-amber-200 border-b-transparent rounded-full animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  ></div>
                  {/* Premium book icon in center of spinner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaBook className="text-amber-500 text-sm animate-pulse" />
                  </div>
                  {/* Premium gold ring */}
                  <div className="absolute -inset-1 border border-amber-300/30 rounded-full"></div>
                </div>
                <p className="absolute mt-16 text-amber-700 text-xs font-medium animate-pulse">
                  Finding your literary inspiration...
                </p>
              </div>
            ) : error ? (
              <div className="py-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-500 mb-3 font-medium text-sm">{error}</p>
                <button
                  onClick={fetchRandomQuote}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center mx-auto text-sm"
                >
                  <FaRedoAlt className="mr-2 text-xs" /> Try Again
                </button>
              </div>
            ) : quote ? (
              <div className="py-3">
                <div className="relative">
                  {/* Premium book icon with gold accent */}
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-md p-0.5">
                    <div className="absolute inset-0.5 bg-white rounded-full"></div>
                    <FaBook className="h-4 w-4 text-amber-500 relative z-10" />
                  </div>

                  {/* Premium compact quote card */}
                  <div className="bg-gradient-to-br from-amber-50/90 to-white rounded-lg p-4 md:p-5 mt-3 shadow-md border border-amber-100">
                    {/* Premium corner accents */}
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-60"></div>
                    <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-60"></div>
                    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-60"></div>
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-60"></div>

                    {/* Premium quote display */}
                    <blockquote className="text-base md:text-lg text-stone-700 font-light mb-4 px-3 relative">
                      <FaQuoteLeft className="text-amber-400 absolute -top-2 -left-2 opacity-70 text-base" />
                      <span className="relative z-10 font-serif leading-relaxed">
                        {quote.content}
                      </span>
                      <FaQuoteRight className="text-amber-400 absolute -bottom-2 -right-2 opacity-70 text-base" />
                    </blockquote>

                    {/* Premium gold gradient divider */}
                    <div className="h-0.5 w-1/3 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3 rounded-full shadow-sm"></div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                      <div>
                        <p className="text-stone-700 text-sm">
                          —{" "}
                          <span className="text-amber-800 font-semibold">
                            {quote.author}
                          </span>
                        </p>
                        {quote.tags && quote.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 justify-center sm:justify-start">
                            {quote.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100 shadow-sm hover:bg-amber-100/80 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-center sm:justify-start mt-1.5">
                          <div className="flex items-center gap-0.5">
                            <FaStar className="text-amber-500 text-xs" />
                            <FaStar className="text-amber-500 text-xs" />
                            <FaStar className="text-amber-500 text-xs" />
                          </div>
                          <div className="w-1 h-1 bg-green-500 rounded-full mx-2 shadow-sm"></div>
                          <p className="text-[10px] text-green-700 font-medium">
                            Daily Pick
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={fetchRandomQuote}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm rounded-md hover:from-amber-500 hover:to-amber-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 mt-2 sm:mt-0 group"
                        aria-label="Get a new quote"
                      >
                        <FaRedoAlt className="text-xs group-hover:rotate-90 transition-transform duration-300" />
                        <span>New Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>{" "}
          {/* Premium footer accent */}
          <div className="mt-3 h-0.5 w-1/3 mx-auto bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 rounded-full shadow-sm"></div>
          {/* Premium book page styling */}
          <div className="flex justify-center gap-1.5 my-2">
            <div className="w-1 h-1 rounded-full bg-amber-300 opacity-60"></div>
            <div className="w-1 h-1 rounded-full bg-amber-300 opacity-60"></div>
            <div className="w-1 h-1 rounded-full bg-amber-300 opacity-60"></div>
          </div>
        </div>

        {/* Premium attribution */}
        <div className="flex justify-center items-center mt-3 gap-2">
          <span className="h-px w-4 bg-amber-300/40"></span>
          <p className="text-xs text-amber-700/80 italic font-serif">
            Daily literary inspiration for book lovers
          </p>
          <span className="h-px w-4 bg-amber-300/40"></span>
        </div>
      </div>
    </section>
  );
};

export default RandomQuote;
