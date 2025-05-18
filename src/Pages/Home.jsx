import React, { useState, useEffect } from "react";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";
import Hero from "../Components/Hero/Hero";
import FeaturedBooks from "../Components/FeaturesBook/FeaturedBooks";
import CategorySection from "../Components/Category/CategorySection";
import Newsletter from "../Components/Newsletter";
import { searchBooks } from "../utils/bookApi";
import { newArrivals as mockNewArrivals, categories } from "../Data/mockData";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState(mockNewArrivals);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(null);
  const [newArrivalsError, setNewArrivalsError] = useState(null);

  const fetchTrendingBooks = async () => {
    try {
      setTrendingLoading(true);
      // Search for books with "Top Trending" category
      const data = await searchBooks({
        categories: ["Top Trending"],
      });

      // Transform the API response to match the format expected by FeaturedBooks component
      const formattedBooks = data.map((book) => ({
        id: book.bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        coverImage: book.coverImage,
        rating:
          book.ratings?.length > 0
            ? book.ratings.reduce((sum, r) => sum + r.rating, 0) /
              book.ratings.length
            : 4.5, // Default rating if no ratings exist
        ratingCount: book.ratings?.length || 0,
      }));

      setTrendingBooks(formattedBooks);
      setTrendingError(null);
    } catch (err) {
      console.error("Error fetching trending books:", err);
      setTrendingError("Failed to load trending books");
    } finally {
      setTrendingLoading(false);
    }
  };

  // Handler to reload trending books data
  const reloadTrendingBooks = () => {
    fetchTrendingBooks();
  };

  // In a real app, this would fetch from the API
  // For demo purposes, we'll simulate a network request with the mock data
  const fetchNewArrivals = async () => {
    try {
      setNewArrivalsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be:
      // const data = await searchBooks({ sortBy: "createdAt", order: "desc", limit: 8 });

      setNewArrivals(mockNewArrivals);
      setNewArrivalsError(null);
    } catch (err) {
      console.error("Error fetching new arrivals:", err);
      setNewArrivalsError("Failed to load new arrivals");
    } finally {
      setNewArrivalsLoading(false);
    }
  };

  const reloadNewArrivals = () => {
    fetchNewArrivals();
  };

  useEffect(() => {
    fetchTrendingBooks();
    // In a real app, we would also call fetchNewArrivals here
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav className="default" />

      <main className="flex-grow">
        <Hero />

        <FeaturedBooks
          title={
            <>
              <FaStar className="text-amber-700 inline mr-2 mb-2" />
              Top Trending{" "}
            </>
          }
          books={trendingBooks.length > 0 ? trendingBooks : []}
          viewAllLink="/category/top-trending"
          loading={trendingLoading}
          error={trendingError}
          reloadHandler={reloadTrendingBooks}
        />

        <CategorySection categories={categories} />

        <FeaturedBooks
          title={
            <>
              <FaStar className="text-amber-700 inline mr-2 mb-2" />
              New Arrivals
            </>
          }
          books={newArrivals}
          viewAllLink="/new-arrivals"
          loading={newArrivalsLoading}
          error={newArrivalsError}
          reloadHandler={reloadNewArrivals}
        />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
