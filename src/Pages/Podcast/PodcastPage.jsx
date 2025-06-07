import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Play,
  Clock,
  Calendar,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  Mic,
  Loader2,
} from "lucide-react";
import { searchPodcasts, getFeaturedPodcasts } from "../../utils/podcastApi";

const PodcastPage = () => {
  const [searchParams] = useSearchParams();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Podcast categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health & Fitness" },
    { value: "news", label: "News & Politics" },
    { value: "comedy", label: "Comedy" },
    { value: "arts", label: "Arts & Culture" },
  ];

  // Load podcasts on component mount
  useEffect(() => {
    const loadPodcasts = async () => {
      setLoading(true);
      setError(null);

      try {
        let results = [];

        if (searchQuery) {
          // Search for specific query
          results = await searchPodcasts(searchQuery, "podcast", 20);
        } else {
          // Load featured podcasts
          results = await getFeaturedPodcasts(20);
        }

        setPodcasts(results);
      } catch (error) {
        console.error("Error loading podcasts:", error);
        setError("Failed to load podcasts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPodcasts();
  }, [searchQuery]);

  // Handle search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      // Load featured podcasts if no query
      const featured = await getFeaturedPodcasts(20);
      setPodcasts(featured);
      return;
    }

    setLoading(true);
    try {
      const results = await searchPodcasts(query, "podcast", 20);
      setPodcasts(results);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter podcasts by category
  const filteredPodcasts =
    selectedCategory === "all"
      ? podcasts
      : podcasts.filter((podcast) =>
          podcast.category
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase())
        );

  // Format episode count
  const formatEpisodeCount = (count) => {
    if (count === 0) return "No episodes";
    if (count === 1) return "1 episode";
    return `${count} episodes`;
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently updated";
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Premium header skeleton */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-6 mb-10 shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/80 rounded-full mr-4"></div>
              <div>
                <div className="h-8 w-40 bg-stone-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-56 bg-stone-100 animate-pulse rounded mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium loading state with enhanced visual treatment */}
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-amber-50 p-8 relative overflow-hidden">
          {/* Premium top accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
          <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

          <div className="relative mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-white rounded-full shadow-inner flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            </div>
            <div className="absolute -inset-2 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -inset-4 bg-amber-200/20 rounded-full blur-md"></div>
          </div>

          <h3 className="text-xl font-serif font-medium text-stone-800 mb-2">
            Loading Podcasts
          </h3>
          <p className="text-stone-600 text-center">
            Discovering amazing content for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Luxurious premium header with enhanced gradient and visual elements */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-8 mb-10 shadow-md border border-amber-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-amber-100/10 rounded-full -mr-16 -mt-16 blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-300/20 to-amber-100/5 rounded-full -ml-10 -mb-10 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-amber-300/20 rounded-full blur-sm"></div>

        {/* Golden accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 rounded-t-2xl"></div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'%3E%3C/path%3E%3Cpath d='M19 10v2a7 7 0 0 1-14 0v-2'%3E%3C/path%3E%3Cline x1='12' y1='19' x2='12' y2='23'%3E%3C/line%3E%3Cline x1='8' y1='23' x2='16' y2='23'%3E%3C/line%3E%3C/svg%3E")`,
            backgroundSize: "60px",
          }}
        ></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-5 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md group"
            >
              <ChevronLeft
                size={20}
                className="text-amber-700 group-hover:text-amber-900 transition-colors"
              />
            </Link>
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-serif font-medium text-stone-800 flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <span className="text-amber-800">🎙️</span>
                    <div className="absolute -inset-1 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  Discover Podcasts
                </h1>
              </div>
              <p className="text-stone-600 mt-1 text-lg">
                Explore thousands of podcasts across various topics and
                interests
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="inline-flex items-center px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-sm text-amber-700">
              <span className="mr-1.5 font-medium">
                {filteredPodcasts.length}
              </span>
              {filteredPodcasts.length === 1 ? "podcast" : "podcasts"} found
            </div>
          </div>
        </div>
      </div>

      {/* Premium filtering and view controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 bg-white p-5 rounded-xl shadow-sm border border-amber-50 relative">
        {/* Subtle corner accent */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-200 rounded-tl-xl"></div>

        {/* Search Bar */}
        <div className="w-full md:w-auto md:max-w-md mb-4 md:mb-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600"
              size={20}
            />
            <input
              type="text"
              placeholder="Search podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-amber-50/30 placeholder-stone-500"
            />
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-amber-600" />
              <span className="text-stone-700 font-medium">Filter:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-all"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-700 font-medium">View:</span>
            <div className="flex border border-amber-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-all ${
                  viewMode === "grid"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-amber-50"
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-all ${
                  viewMode === "list"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-amber-50"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-300 to-red-400"></div>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Podcast Grid/List */}
      {filteredPodcasts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100 hover:border-amber-200 relative overflow-hidden ${
                viewMode === "list"
                  ? "flex items-center p-4"
                  : "p-6 flex flex-col h-full"
              }`}
            >
              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-200 rounded-tl-lg opacity-30"></div>

              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="aspect-square mb-3 relative overflow-hidden rounded-lg bg-amber-50 border border-amber-100">
                    {podcast.coverImage ? (
                      <img
                        src={podcast.coverImage}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/src/assets/podcast-default.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Mic size={32} className="text-amber-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-stone-800 mb-2 line-clamp-2">
                      {podcast.title}
                    </h3>
                    <p className="text-amber-700 text-sm mb-2 font-medium">
                      {podcast.author}
                    </p>
                    <p className="text-stone-500 text-xs mb-3 line-clamp-2 flex-grow">
                      {podcast.description}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatEpisodeCount(podcast.totalEpisodes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(podcast.lastUpdated)}
                        </span>
                      </div>
                      <Link
                        to={`/podcast/${podcast.id}`}
                        className="block w-full text-center py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md"
                      >
                        Listen Now
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <>
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-amber-50 border border-amber-100 flex-shrink-0 mr-4">
                    {podcast.coverImage ? (
                      <img
                        src={podcast.coverImage}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/src/assets/podcast-default.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Mic size={20} className="text-amber-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-semibold text-stone-800 mb-1 truncate">
                      {podcast.title}
                    </h3>
                    <p className="text-amber-700 text-sm mb-1 font-medium">
                      {podcast.author}
                    </p>
                    <p className="text-stone-500 text-xs mb-2 line-clamp-2 flex-grow">
                      {podcast.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500 mt-auto">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatEpisodeCount(podcast.totalEpisodes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(podcast.lastUpdated)}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/podcast/${podcast.id}`}
                    className="ml-4 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all font-medium flex-shrink-0 shadow-sm hover:shadow-md self-start"
                  >
                    Listen
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
            {/* Premium top accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
            <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-amber-100 rounded-full opacity-30"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-100 rounded-full opacity-40 blur-sm"></div>

            {/* Podcast icon background pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'%3E%3C/path%3E%3Cpath d='M19 10v2a7 7 0 0 1-14 0v-2'%3E%3C/path%3E%3Cline x1='12' y1='19' x2='12' y2='23'%3E%3C/line%3E%3Cline x1='8' y1='23' x2='16' y2='23'%3E%3C/line%3E%3C/svg%3E")`,
                backgroundSize: "60px",
              }}
            ></div>

            {/* Premium podcast icon */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
                <Mic className="text-amber-500" size={46} />
              </div>
              <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -inset-3 bg-amber-200/20 rounded-full blur-md"></div>

              {/* Decorative circles */}
              <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-100 rounded-full shadow-inner"></div>
              <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-amber-200 rounded-full shadow-inner"></div>
            </div>

            <h3 className="text-xl font-serif font-medium text-stone-800 mb-2">
              No podcasts found
            </h3>
            <p className="text-stone-600 mb-6">
              Try adjusting your search terms or category filter
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                handleSearch("");
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all inline-flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              <Mic size={16} />
              Show All Podcasts
            </button>

            <div className="mt-8 text-stone-400 text-sm italic relative z-10 flex items-center justify-center">
              <span className="inline-block w-12 h-px bg-stone-200 mr-3"></span>
              Discover amazing content today
              <span className="inline-block w-12 h-px bg-stone-200 ml-3"></span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PodcastPage;
