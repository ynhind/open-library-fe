// Podcast API utilities for external podcast data integration

const LISTEN_NOTES_API_KEY = import.meta.env.VITE_LISTEN_NOTES_API_KEY;
const BASE_URL = "https://listen-api.listennotes.com/api/v2";

// Fallback API configuration for free tier
const FALLBACK_API_CONFIG = {
  // Using iTunes Search API as a free fallback
  ITUNES_BASE_URL: "https://itunes.apple.com/search",
  // Podcast Index API (free alternative)
  PODCAST_INDEX_BASE_URL: "https://api.podcastindex.org/api/1.0",
};

/**
 * Search podcasts using Listen Notes API (with fallback to iTunes)
 * @param {string} query - Search query
 * @param {string} type - Search type ('podcast' or 'episode')
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Array of podcast results
 */
export const searchPodcasts = async (query, type = "podcast", limit = 10) => {
  try {
    // Primary API: Listen Notes (if API key is available)
    if (LISTEN_NOTES_API_KEY) {
      return await searchWithListenNotes(query, type, limit);
    }

    // Fallback: iTunes Search API (free)
    return await searchWithiTunes(query, limit);
  } catch (error) {
    console.error("Error searching podcasts:", error);
    // Return mock data as ultimate fallback
    return getMockPodcasts(query);
  }
};

/**
 * Get featured/trending podcasts
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Array of featured podcasts
 */
export const getFeaturedPodcasts = async (limit = 10) => {
  try {
    if (LISTEN_NOTES_API_KEY) {
      const response = await fetch(`${BASE_URL}/best_podcasts?page=1`, {
        headers: {
          "X-ListenAPI-Key": LISTEN_NOTES_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch featured podcasts");
      }

      const data = await response.json();
      return transformListenNotesData(data.podcasts?.slice(0, limit) || []);
    }

    // Fallback to popular categories from iTunes
    return await getPopularPodcastsFromiTunes(limit);
  } catch (error) {
    console.error("Error fetching featured podcasts:", error);
    return getMockFeaturedPodcasts();
  }
};

/**
 * Get podcast details by ID
 * @param {string} podcastId - Podcast ID
 * @returns {Promise<Object>} Podcast details
 */
export const getPodcastDetails = async (podcastId) => {
  try {
    if (LISTEN_NOTES_API_KEY) {
      const response = await fetch(`${BASE_URL}/podcasts/${podcastId}`, {
        headers: {
          "X-ListenAPI-Key": LISTEN_NOTES_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch podcast details");
      }

      const data = await response.json();
      return transformPodcastDetails(data);
    }

    // Fallback implementation
    return getMockPodcastDetails(podcastId);
  } catch (error) {
    console.error("Error fetching podcast details:", error);
    return getMockPodcastDetails(podcastId);
  }
};

// Helper function for Listen Notes API
const searchWithListenNotes = async (query, type, limit) => {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(
      query
    )}&type=${type}&page_size=${limit}`,
    {
      headers: {
        "X-ListenAPI-Key": LISTEN_NOTES_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Listen Notes API request failed");
  }

  const data = await response.json();
  return transformListenNotesData(data.results || []);
};

// Helper function for iTunes Search API (free fallback)
const searchWithiTunes = async (query, limit) => {
  const response = await fetch(
    `${FALLBACK_API_CONFIG.ITUNES_BASE_URL}?term=${encodeURIComponent(
      query
    )}&media=podcast&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("iTunes API request failed");
  }

  const data = await response.json();
  return transformiTunesData(data.results || []);
};

// Helper function to get popular podcasts from iTunes
const getPopularPodcastsFromiTunes = async (limit) => {
  // Search for popular podcast terms to get diverse results
  const popularTerms = [
    "technology",
    "business",
    "education",
    "comedy",
    "news",
  ];
  const randomTerm =
    popularTerms[Math.floor(Math.random() * popularTerms.length)];

  return await searchWithiTunes(randomTerm, limit);
};

// Transform Listen Notes data to our standard format
const transformListenNotesData = (podcasts) => {
  return podcasts.map((podcast) => ({
    id: podcast.id || podcast.listennotes_url,
    title: podcast.title_original || podcast.title,
    author: podcast.publisher_original || podcast.publisher,
    description: podcast.description_original || podcast.description,
    coverImage: podcast.image || podcast.thumbnail,
    category: podcast.genre_ids?.[0] || "General",
    totalEpisodes: podcast.total_episodes || 0,
    type: "podcast",
    url: podcast.listennotes_url || podcast.website,
    lastUpdated: podcast.earliest_pub_date_ms || Date.now(),
  }));
};

// Transform iTunes data to our standard format
const transformiTunesData = (podcasts) => {
  return podcasts.map((podcast) => ({
    id: podcast.trackId || podcast.collectionId,
    title: podcast.trackName || podcast.collectionName,
    author: podcast.artistName,
    description: podcast.description || "No description available",
    coverImage: podcast.artworkUrl600 || podcast.artworkUrl100,
    category: podcast.primaryGenreName || "General",
    totalEpisodes: podcast.trackCount || 0,
    type: "podcast",
    url: podcast.trackViewUrl || podcast.collectionViewUrl,
    lastUpdated: Date.now(),
  }));
};

// Transform podcast details
const transformPodcastDetails = (podcast) => ({
  id: podcast.id,
  title: podcast.title,
  author: podcast.publisher,
  description: podcast.description,
  coverImage: podcast.image,
  category: podcast.genre_ids?.[0] || "General",
  totalEpisodes: podcast.total_episodes || 0,
  website: podcast.website,
  episodes:
    podcast.episodes?.map((episode) => ({
      id: episode.id,
      title: episode.title,
      description: episode.description,
      duration: episode.audio_length_sec,
      publishDate: episode.pub_date_ms,
      audioUrl: episode.audio,
    })) || [],
});

// Mock data for fallback scenarios
const getMockPodcasts = (query) => [
  {
    id: "mock-1",
    title: `${query} - Tech Talk`,
    author: "Tech Publishers",
    description: "A fascinating discussion about technology and innovation.",
    coverImage: "/src/assets/podcast-default.jpg",
    category: "Technology",
    totalEpisodes: 150,
    type: "podcast",
    url: "#",
    lastUpdated: Date.now(),
  },
  {
    id: "mock-2",
    title: `${query} - Business Insights`,
    author: "Business Network",
    description: "Insights and strategies for modern business.",
    coverImage: "/src/assets/podcast-default.jpg",
    category: "Business",
    totalEpisodes: 89,
    type: "podcast",
    url: "#",
    lastUpdated: Date.now(),
  },
];

const getMockFeaturedPodcasts = () => [
  {
    id: "featured-1",
    title: "The Daily Tech",
    author: "Tech Media",
    description: "Your daily dose of technology news and insights.",
    coverImage: "/src/assets/podcast-default.jpg",
    category: "Technology",
    totalEpisodes: 365,
    type: "podcast",
    url: "#",
    lastUpdated: Date.now(),
  },
  {
    id: "featured-2",
    title: "Business Leaders",
    author: "Leadership Network",
    description: "Conversations with successful business leaders.",
    coverImage: "/src/assets/podcast-default.jpg",
    category: "Business",
    totalEpisodes: 120,
    type: "podcast",
    url: "#",
    lastUpdated: Date.now(),
  },
  {
    id: "featured-3",
    title: "Learning Today",
    author: "Education Plus",
    description: "Educational content for lifelong learners.",
    coverImage: "/src/assets/podcast-default.jpg",
    category: "Education",
    totalEpisodes: 200,
    type: "podcast",
    url: "#",
    lastUpdated: Date.now(),
  },
];

const getMockPodcastDetails = (id) => ({
  id,
  title: "Sample Podcast",
  author: "Sample Publisher",
  description: "This is a sample podcast for demonstration purposes.",
  coverImage: "/src/assets/podcast-default.jpg",
  category: "General",
  totalEpisodes: 50,
  website: "#",
  episodes: [],
});

// Export all functions
export default {
  searchPodcasts,
  getFeaturedPodcasts,
  getPodcastDetails,
};
