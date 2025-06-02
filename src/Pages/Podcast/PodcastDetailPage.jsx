import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Clock,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Share2,
  ChevronLeft,
  Mic,
  Loader2,
  Headphones,
} from "lucide-react";
import { getPodcastDetails } from "../../utils/podcastApi";

const PodcastDetailPage = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPodcastDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const details = await getPodcastDetails(id);
        setPodcast(details);
      } catch (err) {
        console.error("Error loading podcast details:", err);
        setError("Failed to load podcast details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPodcastDetails();
    }
  }, [id]);

  // Format episode duration
  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format publish date
  const formatPublishDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                <div className="h-8 w-48 bg-stone-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-64 bg-stone-100 animate-pulse rounded mt-2"></div>
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
            Loading Podcast Details
          </h3>
          <p className="text-stone-600 text-center">
            Preparing your listening experience...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Premium header with gradient background */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-6 mb-10 shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <Link
                to="/podcast"
                className="mr-4 p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-sm"
              >
                <ChevronLeft size={20} className="text-amber-800" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-medium text-stone-800">
                  Podcast Details
                </h1>
                <p className="text-stone-500 mt-1">Something went wrong</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium error state */}
        <div className="bg-white border border-red-100 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-300 to-red-400"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-red-50 rounded-full opacity-50 blur-sm"></div>

          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-white rounded-full shadow-inner flex items-center justify-center">
              <span className="text-6xl">😞</span>
            </div>
            <div className="absolute -inset-1.5 bg-red-300/30 rounded-full blur-sm animate-pulse"></div>
          </div>

          <h2 className="text-2xl font-serif font-medium text-stone-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            to="/podcast"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Podcasts
          </Link>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Premium header with gradient background */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-2xl p-6 mb-10 shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <Link
                to="/podcast"
                className="mr-4 p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-sm"
              >
                <ChevronLeft size={20} className="text-amber-800" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-medium text-stone-800">
                  Podcast Details
                </h1>
                <p className="text-stone-500 mt-1">Podcast not found</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium not found state */}
        <div className="bg-white border border-amber-50 shadow-sm rounded-xl p-12 text-center relative overflow-hidden">
          {/* Premium top accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full opacity-70 -mb-12 -mr-12"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-amber-50 rounded-full opacity-50 blur-sm"></div>

          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
              <Mic className="text-amber-500" size={46} />
            </div>
            <div className="absolute -inset-1.5 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
          </div>

          <h2 className="text-2xl font-serif font-medium text-stone-800 mb-4">
            Podcast not found
          </h2>
          <p className="text-stone-600 mb-6">
            The podcast you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/podcast"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Podcasts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Premium breadcrumb navigation */}
      <div className="mb-4 flex justify-between items-center bg-white/70 px-3 py-2 rounded shadow-sm border border-amber-50">
        <nav className="flex flex-wrap text-xs md:text-sm items-center">
          <Link
            to="/"
            className="text-amber-700 hover:text-amber-900 transition-colors duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              />
            </svg>
            Home
          </Link>
          <span className="mx-1 text-stone-400">/</span>
          <Link
            to="/podcast"
            className="text-amber-700 hover:text-amber-900 transition-colors"
          >
            Podcasts
          </Link>
          <span className="mx-1 text-stone-400">/</span>
          <span className="text-stone-500 truncate max-w-[120px] sm:max-w-[180px] md:max-w-sm overflow-hidden">
            {podcast.title}
          </span>
        </nav>
        <Link
          to="/podcast"
          className="inline-flex items-center text-amber-800 hover:text-amber-900 ml-2"
        >
          <ChevronLeft size={12} />
          <span className="ml-0.5">Back</span>
        </Link>
      </div>

      {/* Podcast Header */}
      <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-8 mb-8 relative overflow-hidden">
        {/* Premium top accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

        {/* Subtle corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-200 rounded-tl-xl opacity-50"></div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Podcast Cover */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-xl overflow-hidden bg-amber-50 border border-amber-100 mx-auto md:mx-0 relative">
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
                  <Mic size={64} className="text-amber-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Podcast Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-serif font-bold text-stone-800 mb-3">
              {podcast.title}
            </h1>
            <p className="text-xl text-amber-700 mb-4 font-medium">
              {podcast.author}
            </p>

            <div className="flex flex-wrap gap-4 mb-6 text-stone-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{podcast.totalEpisodes || 0} episodes</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Updated regularly</span>
              </div>
              {podcast.category && (
                <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200">
                  {podcast.category}
                </div>
              )}
            </div>

            <p className="text-stone-700 mb-6 leading-relaxed">
              {podcast.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md">
                <Play size={16} />
                Play Latest Episode
              </button>

              {podcast.website && (
                <a
                  href={podcast.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-amber-200 text-stone-700 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all"
                >
                  <ExternalLink size={16} />
                  Visit Website
                </a>
              )}

              <button className="flex items-center gap-2 px-6 py-3 border border-amber-200 text-stone-700 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-8 relative overflow-hidden">
        {/* Premium top accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"></div>

        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
          <Headphones size={24} className="text-amber-600" />
          Episodes
        </h2>

        {podcast.episodes && podcast.episodes.length > 0 ? (
          <div className="space-y-4">
            {podcast.episodes.map((episode, index) => (
              <div
                key={episode.id || index}
                className="border border-amber-100 rounded-lg p-6 hover:bg-amber-50/30 transition-all relative overflow-hidden group"
              >
                {/* Subtle hover accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-stone-800 flex-1 mr-4 group-hover:text-amber-800 transition-colors">
                    {episode.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-stone-500 flex-shrink-0">
                    {episode.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDuration(episode.duration)}
                      </span>
                    )}
                    {episode.publishDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatPublishDate(episode.publishDate)}
                      </span>
                    )}
                  </div>
                </div>

                {episode.description && (
                  <p className="text-stone-600 mb-4 line-clamp-3">
                    {episode.description}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all text-sm font-medium shadow-sm hover:shadow-md">
                    <Play size={14} />
                    Play Episode
                  </button>
                  {episode.audioUrl && (
                    <a
                      href={episode.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-amber-200 text-stone-700 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all text-sm"
                    >
                      <ExternalLink size={14} />
                      Direct Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-100 rounded-full opacity-50 -mb-8 -mr-8"></div>
            <div className="absolute top-1/4 left-1/6 w-12 h-12 bg-amber-100 rounded-full opacity-30 blur-sm"></div>

            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-full shadow-inner flex items-center justify-center">
                <Headphones className="text-amber-500" size={32} />
              </div>
              <div className="absolute -inset-1 bg-amber-300/30 rounded-full blur-sm animate-pulse"></div>
            </div>

            <h3 className="text-xl font-serif font-medium text-stone-800 mb-2">
              No episodes available
            </h3>
            <p className="text-stone-600">
              Episodes will appear here when they're available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastDetailPage;
