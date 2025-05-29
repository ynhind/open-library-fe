import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Book,
  Music,
  Camera,
  Compass,
  Coffee,
  Palette,
  Dices,
  Brain,
} from "lucide-react";
import { getCategories } from "../../utils/bookApi";

const CategorySection = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialDisplayCount = 8;

  // Icons map for categories
  const categoryIcons = React.useMemo(
    () => ({
      Fiction: <Book size={22} />,
      "Non-Fiction": <Coffee size={22} />,
      "Science Fiction": <Compass size={22} />,
      Mystery: <Dices size={22} />,
      Biography: <Music size={22} />,
      History: <Brain size={22} />,
      Art: <Palette size={22} />,
      Photography: <Camera size={22} />,
    }),
    []
  );

  // Default icon for categories without a specific icon
  const defaultIcon = React.useMemo(() => <Book size={22} />, []);

  // Function to get random categories
  const getRandomCategories = (cats, count) => {
    const shuffled = [...cats].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();

        // Check if the API response is in the expected format
        if (!fetchedCategories || !Array.isArray(fetchedCategories)) {
          throw new Error("Invalid response format from the API");
        }

        // Map categories with icons and book counts
        const mappedCategories = fetchedCategories.map((category) => {
          const categoryName = category.name || "";
          return {
            name: categoryName,
            icon: categoryIcons[categoryName] || defaultIcon,
            bookCount: category.count || Math.floor(Math.random() * 40) + 5, // If count exists use it, otherwise generate random
            categoryId: category._id || category.categoryId,
          };
        });

        setAllCategories(mappedCategories);

        // Select random categories initially if we have more than needed
        if (mappedCategories.length > initialDisplayCount) {
          const randomCats = getRandomCategories(mappedCategories, 4);
          setVisibleCategories(randomCats);
        } else {
          setVisibleCategories(mappedCategories);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
        setIsLoading(false);

        // Fallback to default categories in case of error
        const fallbackCategories = [
          { name: "Fiction", icon: categoryIcons["Fiction"], bookCount: 42 },
          {
            name: "Non-Fiction",
            icon: categoryIcons["Non-Fiction"],
            bookCount: 35,
          },
          {
            name: "Science Fiction",
            icon: categoryIcons["Science Fiction"],
            bookCount: 28,
          },
          {
            name: "Biography",
            icon: categoryIcons["Biography"],
            bookCount: 19,
          },
        ];
        setAllCategories(fallbackCategories);
        setVisibleCategories(fallbackCategories);
      }
    };

    fetchCategories();
  }, [categoryIcons, defaultIcon, initialDisplayCount]);

  useEffect(() => {
    if (allCategories.length > 0) {
      if (isExpanded) {
        setVisibleCategories(allCategories);
      } else {
        // When collapsing, keep showing random 4 categories
        const randomCats = getRandomCategories(allCategories, 4);
        setVisibleCategories(randomCats);
      }
    }
  }, [isExpanded, allCategories]);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-amber-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-100/80 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-amber-100/80 rounded w-96 mx-auto"></div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-white rounded-lg shadow-sm"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !allCategories || allCategories.length === 0) {
    return null;
  }

  const handleViewMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-amber-100/90 to-amber-100/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-md bg-amber-200/90 text-amber-800">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
                Browse by Category
              </h2>
            </div>
            <p className="text-amber-600/70 max-w text-sm text-center">
              Explore our extensive collection organized by categories to find
              your next favorite read
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden md:flex items-center mt-4 md:mt-0 text-amber-800 hover:text-amber-900 font-medium transition-colors group"
          >
            View All Categories
            <ChevronRight
              size={16}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              icon={category.icon}
              bookCount={category.bookCount}
            />
          ))}
        </div>

        {allCategories.length > initialDisplayCount && (
          <div className="mt-8 text-center">
            <button
              onClick={handleViewMore}
              className="px-6 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center group"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronDown
                    size={14}
                    className="ml-1.5 group-hover:translate-y-0.5 transition-transform"
                  />
                </>
              ) : (
                <>
                  Show More
                  <ChevronDown
                    size={14}
                    className="ml-1.5 group-hover:translate-y-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-8 pt-5 border-t border-amber-200/60 md:hidden">
          <Link
            to="/categories"
            className="flex items-center justify-center text-amber-800 hover:text-amber-900 font-medium transition-colors group"
          >
            View All Categories
            <ChevronRight
              size={16}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
