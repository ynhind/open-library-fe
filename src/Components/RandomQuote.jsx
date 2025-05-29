import React, { useState, useEffect, useCallback } from "react";
import { FaQuoteLeft, FaQuoteRight, FaRedoAlt } from "react-icons/fa";

// Fallback quotes in case the API is unavailable
const fallbackQuotes = [
  {
    content:
      "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    tags: ["books", "reading", "fantasy"]
  },
  {
    content: "Books are a uniquely portable magic.",
    author: "Stephen King",
    tags: ["books", "reading"]
  },
  {
    content: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    tags: ["books", "friendship"]
  },
  {
    content: "A book is a dream that you hold in your hand.",
    author: "Neil Gaiman",
    tags: ["books", "dreams"]
  },
  {
    content: "Reading is to the mind what exercise is to the body.",
    author: "Joseph Addison",
    tags: ["books", "reading", "mind"]
  },
  {
    content:
      "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    tags: ["books", "learning", "knowledge"]
  },
  {
    content:
      "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers.",
    author: "Charles W. Eliot",
    tags: ["books", "friendship", "wisdom"]
  },
  {
    content:
      "Until I feared I would lose it, I never loved to read. One does not love breathing.",
    author: "Harper Lee",
    tags: ["books", "reading", "literature"]
  },
  {
    content: "Think before you speak. Read before you think.",
    author: "Fran Lebowitz",
    tags: ["books", "reading", "thinking"]
  },
  {
    content: "I have always imagined that Paradise will be a kind of library.",
    author: "Jorge Luis Borges",
    tags: ["books", "libraries", "paradise"]
  },
  {
    content: "Never trust anyone who has not brought a book with them.",
    author: "Lemony Snicket",
    tags: ["books", "trust", "humor"]
  },
  {
    content:
      "You can never get a cup of tea large enough or a book long enough to suit me.",
    author: "C.S. Lewis",
    tags: ["books", "tea", "reading"]
  },
  {
    content: "Classic - a book which people praise and don't read.",
    author: "Mark Twain",
    tags: ["books", "classics", "humor"]
  },
  {
    content:
      "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.",
    author: "Haruki Murakami",
    tags: ["books", "thinking", "individuality"]
  },
];

const RandomQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const getRandomFallbackQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }, []);

  const getAndSetFallbackQuote = useCallback(() => {
    const fallbackQuote = getRandomFallbackQuote();
    setQuote(fallbackQuote);
    setUsingFallback(true);
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
    setUsingFallback(false);

    // Check if we should throttle this request
    if (shouldThrottleRequest()) {
      console.log("Throttling API request - using fallback");
      getAndSetFallbackQuote();
      setLoading(false);
      return;
    }

    setLastFetchTime(Date.now());

    try {
      // Attempt to fetch from quotable.io directly with custom headers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // First try with book-related tags
      const apiUrl = "https://api.quotable.io/random?tags=books,literature,reading";
      
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'OldTomesLibrary/1.0'
        },
        signal: controller.signal
      };

      console.log("Fetching quote from API...");
      const response = await fetch(apiUrl, fetchOptions);
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Successfully fetched quote from API");
        setQuote(data);
      } else {
        // If tags request fails, try without tags
        console.log("Book tags request failed, trying without tags");
        const plainResponse = await fetch("https://api.quotable.io/random", fetchOptions);
        
        if (plainResponse.ok) {
          const data = await plainResponse.json();
          console.log("Successfully fetched general quote from API");
          setQuote(data);
        } else {
          console.log("All API requests failed, using fallback quote");
          throw new Error(`API returned ${plainResponse.status}: ${plainResponse.statusText}`);
        }
      }
    } catch (err) {
      console.error("Quote fetch error:", err.message);
      // Use a fallback quote if there was an error
      console.log("API request failed, using fallback quote");
      getAndSetFallbackQuote();
    } finally {
      setLoading(false);
    }
  };

  // Using useCallback to memoize the fetchRandomQuote function
  const memoizedFetchRandomQuote = useCallback(fetchRandomQuote, [
    getAndSetFallbackQuote, shouldThrottleRequest
  ]);

  useEffect(() => {
    memoizedFetchRandomQuote();
  }, [memoizedFetchRandomQuote]);

  return (
    <section className="bg-gradient-to-r from-amber-100/70 to-amber-100/60 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 relative">
          {/* Golden accent line */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>

          <div className="px-8 py-10 text-center relative z-10">
            <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-6 flex items-center justify-center">
              <span className="inline-block w-8 h-1 bg-amber-300 mr-3"></span>
              Your Message Today
              <span className="inline-block w-8 h-1 bg-amber-300 ml-3"></span>
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchRandomQuote}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center mx-auto"
                >
                  <FaRedoAlt className="mr-2" /> Try Again
                </button>
              </div>
            ) : quote ? (
              <div className="py-4">
                <blockquote className="text-lg md:text-xl text-stone-700 italic mb-6 px-4 md:px-8 relative">
                  <FaQuoteLeft className="text-amber-300 absolute top-0 left-0 opacity-30 text-xl" />
                  {quote.content}
                  <FaQuoteRight className="text-amber-300 absolute bottom-0 right-0 opacity-30 text-xl" />
                </blockquote>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-stone-600 font-medium">
                      — {quote.author}
                    </p>
                    {quote.tags && quote.tags.length > 0 && !usingFallback && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {quote.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {usingFallback && (
                      <p className="text-xs text-amber-600 mt-1">
                        Using locally stored quotes
                      </p>
                    )}
                  </div>
                  <button
                    onClick={fetchRandomQuote}
                    className="p-2 text-amber-700 hover:text-amber-900 transition-colors"
                    aria-label="Get a new quote"
                    title="Get another quote"
                  >
                    <FaRedoAlt />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RandomQuote;
