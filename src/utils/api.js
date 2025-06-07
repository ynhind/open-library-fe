const API_URL = import.meta.env.VITE_API_URL || "/api";

console.log("API URL being used:", API_URL);

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}/${endpoint}`;
  // console.log("Original options:", JSON.stringify(options, null, 2));
  // console.log("Making request to:", url);
  // console.log("Using HTTP method from options:", options.method);

  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Build fetch config - completely rewritten to ensure method is preserved
  const config = {};

  // Set the method explicitly first (most important)
  config.method = options.method || "GET";

  // Add standard configs
  config.mode = "cors";
  config.credentials = "include";

  // Add headers with proper merging
  config.headers = { ...defaultHeaders };
  if (options.headers) {
    Object.keys(options.headers).forEach((key) => {
      config.headers[key] = options.headers[key];
    });
  }

  // Add remaining options (except method and headers which we've handled)
  Object.keys(options).forEach((key) => {
    if (key !== "method" && key !== "headers") {
      config[key] = options[key];
    }
  });

  // console.log("Final config:", JSON.stringify(config, null, 2));

  // Nếu body là FormData thì không set Content-Type (browser tự set)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    // JSON stringify body nếu là object bình thường
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Log the actual request that was made
    // console.log(
    //   `${config.method || "GET"} request to ${url} returned status: ${
    //     response.status
    //   }`
    // );

    if (!response.ok) {
      // Cố gắng lấy message lỗi từ response JSON
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.error ||
          errorData.message ||
          `API Error: ${response.status}`;
        console.log("API Error response:", errorData);
      } catch {
        errorMessage = `API Error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Hàm test kết nối API đơn giản
export async function testApiConnection() {
  try {
    const response = await fetch(API_URL, {
      mode: "cors",
      credentials: "include",
    });

    if (response.ok) {
      return "API connection successful";
    } else {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error("API connection test failed:", error);
    throw error;
  }
}

// Function to fetch quotes from multiple external APIs with fallbacks
export async function fetchExternalQuote(category = "books") {
  // List of API endpoints to try in sequence - using only CORS-friendly APIs with proxies where needed
  const apiEndpoints = [
    {
      name: "Quotable API",
      // This API is CORS-friendly
      url: "https://api.quotable.io/random",
      transform: (data) => ({
        content: data?.content || "",
        author: data?.author || "Unknown",
        tags: data?.tags || [category],
      }),
    },
    {
      name: "Programming Quotes",
      // This API is CORS-friendly
      url: "https://programming-quotes-api.herokuapp.com/quotes/random",
      transform: (data) => ({
        content: data?.en || "",
        author: data?.author || "Unknown",
        tags: ["programming", "technology"],
      }),
    },
    {
      name: "Quotable Tags API",
      // Trying with specific tags
      url: "https://api.quotable.io/random?tags=wisdom,knowledge",
      transform: (data) => ({
        content: data?.content || "",
        author: data?.author || "Unknown",
        tags: data?.tags || [category],
      }),
    },
    {
      name: "Public APIs Quotes",
      // Using a CORS proxy to avoid CORS issues
      url: "https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/random",
      transform: (data) => ({
        content: data[0]?.q || "",
        author: data[0]?.a || "Unknown",
        tags: [category],
      }),
    },
  ];

  // Use local storage to cache quotes
  try {
    // Check if we have cached quotes and they're not too old
    const cachedQuoteData = localStorage.getItem("cachedQuotes");
    if (cachedQuoteData) {
      const { quotes, timestamp } = JSON.parse(cachedQuoteData);
      const oneHour = 60 * 60 * 1000; // milliseconds
      if (quotes && quotes.length > 0 && Date.now() - timestamp < oneHour) {
        console.log("Using cached quotes");
        // Return a random quote from the cache
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
      }
    }
  } catch (err) {
    console.error("Error accessing localStorage:", err);
  }

  // Try each API in sequence until one works
  for (const api of apiEndpoints) {
    try {
      console.log(`Attempting to fetch quote from ${api.name}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const fetchOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(api.headers || {}), // Add any API-specific headers
        },
        signal: controller.signal,
      };

      // Add error handling for the fetch
      const response = await Promise.race([
        fetch(api.url, fetchOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 8000)
        ),
      ]);

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully fetched quote from ${api.name}`);

        const transformedQuote = api.transform(data);

        // Cache successful quotes for later use
        try {
          const cachedQuoteData = localStorage.getItem("cachedQuotes");
          let quotes = [];
          if (cachedQuoteData) {
            const parsedData = JSON.parse(cachedQuoteData);
            quotes = parsedData.quotes || [];
          }

          // Add the new quote if it's not already in the cache
          if (!quotes.some((q) => q.content === transformedQuote.content)) {
            quotes.push(transformedQuote);
          }

          // Keep only the last 20 quotes
          if (quotes.length > 20) {
            quotes = quotes.slice(-20);
          }

          localStorage.setItem(
            "cachedQuotes",
            JSON.stringify({
              quotes,
              timestamp: Date.now(),
            })
          );
        } catch (err) {
          console.error("Error caching quotes:", err);
        }

        return transformedQuote;
      }
    } catch (error) {
      console.error(`Error fetching from ${api.name}:`, error.message);
    }
  }

  // Last resort: Use a hardcoded quote collection (these will always work)
  console.log("All APIs failed, using hardcoded quotes");
  const hardcodedQuotes = [
    {
      content:
        "The library is the temple of learning, and learning has liberated more people than all the wars in history.",
      author: "Carl T. Rowan",
      tags: ["books", "libraries", "learning"],
    },
    {
      content:
        "Google can bring you back 100,000 answers. A librarian can bring you back the right one.",
      author: "Neil Gaiman",
      tags: ["books", "libraries", "knowledge"],
    },
    {
      content: "A room without books is like a body without a soul.",
      author: "Cicero",
      tags: ["books", "reading", "wisdom"],
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
      content: "Knowledge is power.",
      author: "Francis Bacon",
      tags: ["knowledge", "power", "wisdom"],
    },
    {
      content: "The only true wisdom is in knowing you know nothing.",
      author: "Socrates",
      tags: ["wisdom", "knowledge", "philosophy"],
    },
  ];

  // Cache these quotes too for future use
  try {
    localStorage.setItem(
      "cachedQuotes",
      JSON.stringify({
        quotes: hardcodedQuotes,
        timestamp: Date.now(),
      })
    );
  } catch (err) {
    console.error("Error caching hardcoded quotes:", err);
  }

  // Return a random hardcoded quote
  const randomIndex = Math.floor(Math.random() * hardcodedQuotes.length);
  return hardcodedQuotes[randomIndex];
}
