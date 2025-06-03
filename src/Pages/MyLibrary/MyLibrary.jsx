import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPurchasedBooks } from "../../utils/userApi";
import { toast } from "react-toastify";
import {
  BookOpen,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Library,
  Star,
  Download,
  Play,
  Bookmark,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  TrendingUp,
  Award,
  Target,
  Eye,
  Settings,
  MoreHorizontal,
  Calendar,
  BookMarked,
  Headphones,
  FileText,
  Users,
  Heart,
  MessageCircle,
  BarChart3,
  PlusCircle,
  Menu,
  X,
  Globe,
  Share2,
  Gift,
  Crown,
  DollarSign,
} from "lucide-react";

// Inject global CSS for animations
const AnimationStyles = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 2s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200px 100%;
        }
      `,
      }}
    />
  );
};

const MyLibrary = () => {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [activeSection, setActiveSection] = useState("dashboard"); // Current active section
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const navigate = useNavigate();

  // Library sections configuration - Updated with warm color palette
  const librarySections = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview of your reading activity",
      color: "primary",
    },
    {
      id: "my-books",
      label: "My Books",
      icon: BookOpen,
      description: "Your purchased books",
      color: "secondary",
      count: purchasedBooks.length,
    },
    {
      id: "reading-lists",
      label: "Reading Lists",
      icon: BookMarked,
      description: "Curated collections and lists",
      color: "warm",
      badge: "New",
    },
    {
      id: "my-friends",
      label: "My Friends",
      icon: Users,
      description: "Connect with fellow readers",
      color: "earth",
      comingSoon: true,
    },
    {
      id: "book-clubs",
      label: "Book Clubs",
      icon: MessageCircle,
      description: "Join discussions and clubs",
      color: "bronze",
      comingSoon: true,
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: TrendingUp,
      description: "Personalized book suggestions",
      color: "gold",
      comingSoon: true,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Award,
      description: "Reading milestones and badges",
      color: "honey",
      comingSoon: true,
    },
    {
      id: "reading-goals",
      label: "Reading Goals",
      icon: Target,
      description: "Set and track reading targets",
      color: "sage",
      comingSoon: true,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      description: "Your most loved books",
      color: "copper",
      comingSoon: true,
    },
    {
      id: "shared-library",
      label: "Shared Library",
      icon: Share2,
      description: "Books shared with friends",
      color: "vintage",
      comingSoon: true,
    },
    {
      id: "gifts",
      label: "Gifts",
      icon: Gift,
      description: "Books given and received",
      color: "caramel",
      comingSoon: true,
    },
    {
      id: "premium",
      label: "Premium Features",
      icon: Crown,
      description: "Exclusive premium content",
      color: "honey",
      comingSoon: true,
      premium: true,
    },
  ];

  // Fetch purchased books
  const fetchPurchasedBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPurchasedBooks();
      setPurchasedBooks(response.purchasedBooks || []);
    } catch (error) {
      console.error("Error fetching purchased books:", error);
      setError(error.message);

      // Handle authentication error
      if (
        error.message &&
        (error.message.includes("Authentication required") ||
          error.message.includes("Token has been expired"))
      ) {
        const isExpired = error.message.includes("Token has been expired");

        toast.error(
          <div>
            <div className="font-medium">
              {isExpired ? "Session Expired" : "Authentication Required"}
            </div>
            <div className="text-sm mt-1">
              {isExpired
                ? "Your session has expired. Please log in again."
                : "Please log in to access your library."}
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
            onClose: () => {
              if (isExpired) {
                setTimeout(() => {
                  navigate("/login");
                }, 100);
              }
            },
          }
        );
      } else {
        toast.error("Failed to load your library. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedBooks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter and sort books
  const filteredAndSortedBooks = React.useMemo(() => {
    let filtered = purchasedBooks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Format filter
    if (filterBy !== "all") {
      filtered = filtered.filter((book) => book.format === filterBy);
    }

    // Sort
    switch (sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "price":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default: // recent
        // Keep original order (most recent purchases first)
        break;
    }

    return filtered;
  }, [purchasedBooks, searchTerm, filterBy, sortBy]);

  // Statistics for dashboard
  const stats = React.useMemo(() => {
    const totalBooks = purchasedBooks.length;
    const totalSpent = purchasedBooks.reduce(
      (sum, book) => sum + (book.price || 0),
      0
    );
    const digitalBooks = purchasedBooks.filter(
      (book) => book.format === "Digital"
    ).length;
    const physicalBooks = purchasedBooks.filter(
      (book) => book.format === "Physical"
    ).length;
    const audioBooks = purchasedBooks.filter(
      (book) => book.format === "Audiobook"
    ).length;
    const onlineBooks = purchasedBooks.filter(
      (book) => book.isAvailableOnline
    ).length;

    return {
      totalBooks,
      totalSpent,
      digitalBooks,
      physicalBooks,
      audioBooks,
      onlineBooks,
    };
  }, [purchasedBooks]);

  // Get color classes for sections - Updated to match website's amber color palette
  function getColorClasses(color, isActive = false) {
    const colorMap = {
      primary: {
        bg: isActive ? "bg-amber-50" : "hover:bg-amber-50",
        text: isActive
          ? "text-amber-800"
          : "text-stone-600 hover:text-amber-800",
        icon: isActive ? "text-amber-700" : "text-stone-500",
        border: "border-amber-200",
        accent: "bg-amber-600",
      },
      secondary: {
        bg: isActive ? "bg-amber-100/50" : "hover:bg-amber-100/50",
        text: isActive
          ? "text-amber-900"
          : "text-stone-600 hover:text-amber-900",
        icon: isActive ? "text-amber-800" : "text-stone-500",
        border: "border-amber-300",
        accent: "bg-amber-700",
      },
      warm: {
        bg: isActive ? "bg-orange-50" : "hover:bg-orange-50",
        text: isActive
          ? "text-orange-800"
          : "text-stone-600 hover:text-orange-800",
        icon: isActive ? "text-orange-700" : "text-stone-500",
        border: "border-orange-200",
        accent: "bg-orange-600",
      },
      earth: {
        bg: isActive ? "bg-stone-100" : "hover:bg-stone-100",
        text: isActive
          ? "text-stone-800"
          : "text-stone-600 hover:text-stone-800",
        icon: isActive ? "text-stone-700" : "text-stone-500",
        border: "border-stone-300",
        accent: "bg-stone-600",
      },
      gold: {
        bg: isActive ? "bg-yellow-50" : "hover:bg-yellow-50",
        text: isActive
          ? "text-yellow-800"
          : "text-stone-600 hover:text-yellow-800",
        icon: isActive ? "text-yellow-700" : "text-stone-500",
        border: "border-yellow-200",
        accent: "bg-yellow-600",
      },
      bronze: {
        bg: isActive ? "bg-amber-100/30" : "hover:bg-amber-100/30",
        text: isActive
          ? "text-amber-900"
          : "text-stone-600 hover:text-amber-900",
        icon: isActive ? "text-amber-800" : "text-stone-500",
        border: "border-amber-300",
        accent: "bg-amber-800",
      },
      vintage: {
        bg: isActive ? "bg-orange-100/50" : "hover:bg-orange-100/50",
        text: isActive
          ? "text-orange-900"
          : "text-stone-600 hover:text-orange-900",
        icon: isActive ? "text-orange-800" : "text-stone-500",
        border: "border-orange-300",
        accent: "bg-orange-800",
      },
      sage: {
        bg: isActive ? "bg-green-50" : "hover:bg-green-50",
        text: isActive
          ? "text-green-800"
          : "text-stone-600 hover:text-green-800",
        icon: isActive ? "text-green-700" : "text-stone-500",
        border: "border-green-200",
        accent: "bg-green-600",
      },
      cream: {
        bg: isActive ? "bg-stone-50" : "hover:bg-stone-50",
        text: isActive
          ? "text-stone-800"
          : "text-stone-600 hover:text-stone-800",
        icon: isActive ? "text-stone-700" : "text-stone-500",
        border: "border-stone-200",
        accent: "bg-stone-500",
      },
      caramel: {
        bg: isActive ? "bg-amber-200/30" : "hover:bg-amber-200/30",
        text: isActive
          ? "text-amber-900"
          : "text-stone-600 hover:text-amber-900",
        icon: isActive ? "text-amber-800" : "text-stone-500",
        border: "border-amber-300",
        accent: "bg-amber-800",
      },
      copper: {
        bg: isActive ? "bg-orange-200/40" : "hover:bg-orange-200/40",
        text: isActive
          ? "text-orange-900"
          : "text-stone-600 hover:text-orange-900",
        icon: isActive ? "text-orange-800" : "text-stone-500",
        border: "border-orange-300",
        accent: "bg-orange-800",
      },
      honey: {
        bg: isActive ? "bg-yellow-100/60" : "hover:bg-yellow-100/60",
        text: isActive
          ? "text-yellow-900"
          : "text-stone-600 hover:text-yellow-900",
        icon: isActive ? "text-yellow-800" : "text-stone-500",
        border: "border-yellow-300",
        accent: "bg-yellow-800",
      },
    };

    return colorMap[color] || colorMap.primary;
  }

  // Main library view - Updated with amber theme
  return (
    <div className="min-h-screen bg-amber-50 flex">
      <AnimationStyles />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Updated with warm theme */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:h-auto border-r border-amber-200 lg:flex-shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header - Updated with amber accents */}
          <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="flex items-center group">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                    <Library className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                      My Library
                    </h1>
                    <p className="text-sm text-stone-500">
                      Personal Collection
                    </p>
                  </div>
                </Link>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-stone-500" />
              </button>
            </div>
          </div>

          {/* Library sections */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {librarySections.map((section) => {
                const isActive = activeSection === section.id;
                const colorClasses = getColorClasses(section.color, isActive);
                const IconComponent = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSidebarOpen(false);
                    }}
                    disabled={section.comingSoon}
                    className={`
                      w-full text-left p-3 rounded-xl transition-all duration-200 group relative
                      ${colorClasses.bg} ${colorClasses.text}
                      ${
                        section.comingSoon
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-sm"
                      }
                      ${isActive ? "shadow-sm" : ""}
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${colorClasses.accent} rounded-r-full`}
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <IconComponent
                          size={20}
                          className={`${colorClasses.icon} mr-3 flex-shrink-0 transition-colors`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {section.label}
                            </span>
                            {section.premium && (
                              <Crown
                                size={14}
                                className="text-amber-500 flex-shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-xs opacity-70 truncate mt-0.5">
                            {section.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {section.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded-full ${colorClasses.accent} text-white`}
                          >
                            {section.badge}
                          </span>
                        )}
                        {section.count !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded-full ${colorClasses.accent} text-white`}
                          >
                            {section.count}
                          </span>
                        )}
                        {section.comingSoon && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-stone-400 text-white">
                            Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Sidebar footer - Updated with amber theme */}
          <div className="p-4 border-t border-amber-200">
            <Link
              to="/account"
              className="flex items-center w-full p-3 rounded-xl hover:bg-amber-50 transition-colors group"
            >
              <Settings
                size={18}
                className="text-stone-500 mr-3 group-hover:text-amber-700"
              />
              <span className="text-stone-600 group-hover:text-amber-800 font-medium">
                Settings
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:ml-0 flex flex-col">
        {/* Top bar - Updated with amber theme */}
        <header className="bg-white border-b border-amber-200 p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors mr-3 flex-shrink-0"
              >
                <Menu size={20} className="text-stone-600" />
              </button>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-stone-800 capitalize truncate">
                  {librarySections.find((s) => s.id === activeSection)?.label ||
                    "Dashboard"}
                </h2>
                <p className="text-stone-500 text-sm truncate">
                  {
                    librarySections.find((s) => s.id === activeSection)
                      ?.description
                  }
                </p>
              </div>
            </div>

            {/* Quick actions - Updated with amber theme */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <Link
                to="/search"
                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                title="Search Books"
              >
                <Search
                  size={20}
                  className="text-stone-600 hover:text-amber-700"
                />
              </Link>
              <Link
                to="/"
                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                title="Back to Home"
              >
                <ChevronLeft
                  size={20}
                  className="text-stone-600 hover:text-amber-700"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-4 lg:p-6 w-full">{renderSectionContent()}</div>
      </main>
    </div>
  );

  // Render content based on active section
  function renderSectionContent() {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardContent
            stats={stats}
            purchasedBooks={purchasedBooks}
            loading={loading}
            setActiveSection={setActiveSection}
          />
        );
      case "my-books":
        return (
          <MyBooksContent
            books={filteredAndSortedBooks}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onRetry={fetchPurchasedBooks}
          />
        );
      default:
        return (
          <ComingSoonContent
            section={librarySections.find((s) => s.id === activeSection)}
          />
        );
    }
  }
};

// Dashboard Content Component
const DashboardContent = ({
  stats,
  purchasedBooks,
  loading,
  setActiveSection,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-amber-200 animate-pulse"
            >
              <div className="w-8 h-8 bg-amber-200 rounded-lg mb-4"></div>
              <div className="w-16 h-8 bg-amber-100 rounded mb-2"></div>
              <div className="w-24 h-4 bg-amber-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentBooks = purchasedBooks.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stats Overview - Updated with amber theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          color="primary"
          description="Books in your library"
        />
        <StatCard
          title="Total Spent"
          value={`${stats.totalSpent.toLocaleString()} VND`}
          icon={DollarSign}
          color="secondary"
          description="Amount invested in books"
        />
        <StatCard
          title="Digital Books"
          value={stats.digitalBooks}
          icon={FileText}
          color="warm"
          description="Instant access books"
        />
        <StatCard
          title="Audio Books"
          value={stats.audioBooks}
          icon={Headphones}
          color="earth"
          description="Listen anywhere"
        />
      </div>

      {/* Reading Activity - Updated with amber theme */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reading Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Reading Progress</h3>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-stone-600 text-sm">Coming Soon</p>
              <p className="text-stone-500 text-xs mt-1">
                Track your reading progress
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Quick Stats</h3>
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-600 text-sm">Online Available</span>
              <span className="font-medium text-amber-700">
                {stats.onlineBooks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600 text-sm">Physical Books</span>
              <span className="font-medium text-amber-800">
                {stats.physicalBooks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600 text-sm">Digital Books</span>
              <span className="font-medium text-orange-700">
                {stats.digitalBooks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600 text-sm">Audio Books</span>
              <span className="font-medium text-stone-700">
                {stats.audioBooks}
              </span>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Achievements</h3>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-stone-600 text-sm">Coming Soon</p>
            <p className="text-stone-500 text-xs mt-1">
              Unlock reading achievements
            </p>
          </div>
        </div>
      </div>

      {/* Recent Books - Updated with amber theme */}
      {recentBooks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-stone-800">Recently Added</h3>
            <Link
              to="#"
              onClick={() => setActiveSection("my-books")}
              className="text-amber-700 hover:text-amber-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {recentBooks.map((book, index) => (
              <div key={`${book.bookId}-${index}`} className="group">
                <div className="aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden mb-2">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-amber-600" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-sm text-stone-800 truncate group-hover:text-amber-800 transition-colors">
                  {book.title}
                </h4>
                <p className="text-xs text-stone-500 truncate">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component - Updated with amber color scheme
const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    primary: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      value: "text-amber-700",
    },
    secondary: {
      bg: "bg-amber-100/50",
      icon: "text-amber-700",
      value: "text-amber-800",
    },
    warm: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      value: "text-orange-700",
    },
    earth: {
      bg: "bg-stone-100",
      icon: "text-stone-600",
      value: "text-stone-700",
    },
  };

  const classes = colorClasses[color] || colorClasses.primary;

  // Fallback icon in case Icon is undefined
  const IconComponent = Icon || BookOpen;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 ${classes.bg} rounded-lg flex items-center justify-center mb-4`}
      >
        <IconComponent className={`w-6 h-6 ${classes.icon}`} />
      </div>
      <div className={`text-2xl font-bold ${classes.value} mb-1`}>{value}</div>
      <div className="text-stone-800 font-medium mb-1">{title}</div>
      <div className="text-stone-500 text-sm">{description}</div>
    </div>
  );
};

// My Books Content Component
const MyBooksContent = ({
  books,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-amber-200 rounded w-1/3"></div>
            <div className="h-4 bg-amber-100 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden animate-pulse"
            >
              <div className="h-64 bg-amber-100"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                <div className="h-3 bg-amber-100 rounded w-1/2"></div>
                <div className="h-8 bg-amber-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-medium text-stone-800 mb-2">
          Unable to Load Books
        </h3>
        <p className="text-stone-600 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 mx-auto"
        >
          <Loader2 size={16} className="animate-spin" />
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-12 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-amber-600" />
        </div>
        <h3 className="text-xl font-medium text-stone-800 mb-3">
          No Books Found
        </h3>
        <p className="text-stone-600 mb-8 max-w-md mx-auto">
          {searchTerm
            ? `No books match your search "${searchTerm}". Try different keywords.`
            : "Start building your library by purchasing books."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/categories"
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 font-medium"
          >
            <BookOpen size={18} />
            Browse Books
          </Link>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-8 py-3 bg-white border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
              />
            </div>
          </div>

          {/* Filters and controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white min-w-0 flex-shrink-0"
            >
              <option value="all">All Formats</option>
              <option value="Digital">Digital</option>
              <option value="Physical">Physical</option>
              <option value="Audiobook">Audiobook</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white min-w-0 flex-shrink-0"
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="price">Price High to Low</option>
            </select>

            <div className="bg-amber-50 p-1 rounded-lg flex border border-amber-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-amber-700 shadow-sm border border-amber-200"
                    : "text-stone-500 hover:text-amber-700 hover:bg-white/50"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-amber-700 shadow-sm border border-amber-200"
                    : "text-stone-500 hover:text-amber-700 hover:bg-white/50"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-amber-100">
          <p className="text-stone-600 text-sm">
            Showing {books.length} books
            {searchTerm && (
              <span className="ml-1">
                matching "
                <span className="font-medium text-amber-700">{searchTerm}</span>
                "
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Books */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <BookCard key={`${book.bookId}-${index}`} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 divide-y divide-amber-100">
          {books.map((book, index) => (
            <BookListItem key={`${book.bookId}-${index}`} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

// Coming Soon Content Component
const ComingSoonContent = ({ section }) => {
  const IconComponent = section?.icon || BookOpen;

  // Use local amber-themed color classes for coming soon content
  const getLocalColorClasses = (color) => {
    const colorMap = {
      primary: { bg: "bg-amber-50", icon: "text-amber-500" },
      secondary: { bg: "bg-amber-100", icon: "text-amber-600" },
      warm: { bg: "bg-orange-50", icon: "text-orange-500" },
      earth: { bg: "bg-stone-100", icon: "text-stone-500" },
      gold: { bg: "bg-yellow-50", icon: "text-yellow-500" },
      bronze: { bg: "bg-amber-100", icon: "text-amber-600" },
      vintage: { bg: "bg-orange-100", icon: "text-orange-600" },
      sage: { bg: "bg-green-50", icon: "text-green-500" },
      cream: { bg: "bg-stone-50", icon: "text-stone-500" },
      caramel: { bg: "bg-amber-200", icon: "text-amber-700" },
      copper: { bg: "bg-orange-200", icon: "text-orange-700" },
      honey: { bg: "bg-yellow-100", icon: "text-yellow-600" },
    };
    return colorMap[color] || colorMap.primary;
  };

  const colorClasses = section
    ? getLocalColorClasses(section.color)
    : getLocalColorClasses("primary");

  return (
    <div className="text-center py-16">
      <div
        className={`w-24 h-24 ${colorClasses.bg} rounded-full flex items-center justify-center mx-auto mb-8`}
      >
        <IconComponent className={`w-12 h-12 ${colorClasses.icon}`} />
      </div>

      <h2 className="text-3xl font-bold text-stone-800 mb-4">
        {section?.label || "Coming Soon"}
      </h2>

      <p className="text-stone-600 text-lg mb-8 max-w-md mx-auto">
        {section?.description || "This feature is in development"}
      </p>

      {section?.premium && (
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-8">
          <Crown size={16} />
          <span className="text-sm font-medium">Premium Feature</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8 max-w-md mx-auto">
        <h3 className="font-semibold text-stone-800 mb-4">What to expect:</h3>
        <ul className="text-left space-y-2 text-stone-600">
          {getFeatureList(section?.id)}
        </ul>
      </div>

      <div className="mt-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-sm hover:shadow font-medium"
        >
          <BookOpen size={18} />
          Browse Books Instead
        </Link>
      </div>
    </div>
  );

  function getFeatureList(sectionId) {
    const features = {
      "reading-lists": [
        <li key="1">📚 Create custom reading lists</li>,
        <li key="2">🏷️ Tag and categorize books</li>,
        <li key="3">📝 Add personal notes</li>,
        <li key="4">🔄 Share lists with friends</li>,
      ],
      "my-friends": [
        <li key="1">👥 Connect with fellow readers</li>,
        <li key="2">📖 See what friends are reading</li>,
        <li key="3">💬 Book discussions and reviews</li>,
        <li key="4">🏆 Reading challenges together</li>,
      ],
      "book-clubs": [
        <li key="1">📖 Join book clubs</li>,
        <li key="2">💬 Group discussions</li>,
        <li key="3">📅 Reading schedules</li>,
        <li key="4">🎯 Monthly book selections</li>,
      ],
      recommendations: [
        <li key="1">🤖 AI-powered suggestions</li>,
        <li key="2">👥 Friend recommendations</li>,
        <li key="3">📊 Based on reading history</li>,
        <li key="4">🔍 Discover new genres</li>,
      ],
      achievements: [
        <li key="1">🏆 Reading milestones</li>,
        <li key="2">📈 Progress tracking</li>,
        <li key="3">🎖️ Unlock badges</li>,
        <li key="4">🏅 Leaderboards</li>,
      ],
      "reading-goals": [
        <li key="1">🎯 Set yearly targets</li>,
        <li key="2">📊 Track progress</li>,
        <li key="3">📅 Monthly challenges</li>,
        <li key="4">🏆 Achievement rewards</li>,
      ],
    };

    return (
      features[sectionId] || [
        <li key="1">✨ Enhanced user experience</li>,
        <li key="2">📱 Mobile-optimized interface</li>,
        <li key="3">🔄 Real-time synchronization</li>,
        <li key="4">📊 Advanced analytics</li>,
      ]
    );
  }
};

// Book Card Component for Grid View - Updated with amber theme
const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Book cover */}
      <div className="relative h-64 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-amber-600" />
          </div>
        )}

        {/* Format badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-amber-600/90 text-white text-xs py-1 px-2 rounded backdrop-blur-sm font-medium shadow-sm flex items-center gap-1">
            {book.format === "Digital" && <FileText size={12} />}
            {book.format === "Audiobook" && <Headphones size={12} />}
            {book.format === "Physical" && <BookOpen size={12} />}
            {book.format}
          </span>
        </div>

        {/* Online availability badge */}
        {book.isAvailableOnline && (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-800/90 text-white text-xs py-1 px-2 rounded backdrop-blur-sm font-medium shadow-sm">
              Online
            </span>
          </div>
        )}

        {/* Action buttons overlay - Updated with amber theme */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/book/${book.bookId}`}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label="View details"
          >
            <Eye size={18} className="text-stone-700" />
          </Link>
          {book.isAvailableOnline && (
            <button className="p-3 bg-amber-600/90 backdrop-blur-sm rounded-full hover:bg-amber-700 transition-colors text-white">
              <Play size={18} />
            </button>
          )}
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Download size={18} className="text-stone-700" />
          </button>
        </div>
      </div>

      {/* Book info - Updated with amber theme */}
      <div className="p-5">
        <div className="mb-3">
          <Link to={`/book/${book.bookId}`}>
            <h3 className="font-medium text-lg mb-1 hover:text-amber-800 transition-colors line-clamp-2 group-hover:text-amber-800">
              {book.title}
            </h3>
          </Link>
          <p className="text-stone-500 text-sm line-clamp-1">{book.author}</p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-amber-700 font-semibold text-lg">
            {book.price ? `${book.price.toLocaleString("vi-VN")} VND` : "Free"}
          </span>
        </div>

        {/* Future features placeholders */}
        <div className="space-y-3">
          {/* Reading progress placeholder */}
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-500">Reading Progress</span>
              <span className="text-xs text-stone-400">Coming Soon</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5">
              <div className="bg-amber-200 h-1.5 rounded-full w-0"></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
              <BookOpen size={14} />
              {book.isAvailableOnline ? "Read Now" : "View"}
            </button>
            <button className="p-2 border border-amber-200 hover:bg-amber-50 rounded-lg text-amber-600 hover:text-amber-700 transition-all">
              <Bookmark size={14} />
            </button>
            <button className="p-2 border border-amber-200 hover:bg-amber-50 rounded-lg text-amber-600 hover:text-amber-700 transition-all">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Book List Item Component for List View - Updated with amber theme
const BookListItem = ({ book }) => {
  return (
    <div className="p-6 hover:bg-amber-50/30 transition-all group first:rounded-t-xl last:rounded-b-xl">
      <div className="flex gap-6 items-start">
        {/* Book cover */}
        <div className="flex-shrink-0">
          <div className="w-20 h-28 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
            )}
          </div>
        </div>

        {/* Book info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link to={`/book/${book.bookId}`}>
                <h3 className="font-medium text-lg mb-1 hover:text-amber-800 transition-colors truncate group-hover:text-amber-800">
                  {book.title}
                </h3>
              </Link>
              <p className="text-stone-500 mb-2">{book.author}</p>

              {/* Format and availability badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-100 text-amber-700 text-xs py-1 px-2 rounded-full font-medium flex items-center gap-1">
                  {book.format === "Digital" && <FileText size={10} />}
                  {book.format === "Audiobook" && <Headphones size={10} />}
                  {book.format === "Physical" && <BookOpen size={10} />}
                  {book.format}
                </span>
                {book.isAvailableOnline && (
                  <span className="bg-amber-200 text-amber-800 text-xs py-1 px-2 rounded-full font-medium">
                    Online
                  </span>
                )}
              </div>

              {/* Future features placeholder */}
              <div className="bg-stone-50 rounded-lg p-3 mb-3 lg:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-stone-500">
                    Reading Progress
                  </span>
                  <span className="text-xs text-stone-400">Coming Soon</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5">
                  <div className="bg-amber-200 h-1.5 rounded-full w-0"></div>
                </div>
              </div>
            </div>

            {/* Price and actions */}
            <div className="flex flex-col lg:items-end gap-3 lg:ml-6">
              <span className="text-amber-700 font-semibold text-lg whitespace-nowrap">
                {book.price
                  ? `${book.price.toLocaleString("vi-VN")} VND`
                  : "Free"}
              </span>

              <div className="flex gap-2">
                <button className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <BookOpen size={14} />
                  {book.isAvailableOnline ? "Read Now" : "View"}
                </button>
                <button className="p-2 border border-amber-200 hover:bg-amber-50 rounded-lg text-amber-600 hover:text-amber-700 transition-all">
                  <Bookmark size={14} />
                </button>
                <button className="p-2 border border-amber-200 hover:bg-amber-50 rounded-lg text-amber-600 hover:text-amber-700 transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
