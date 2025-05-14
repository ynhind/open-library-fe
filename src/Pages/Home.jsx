import React, { useState, useEffect } from "react";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";
import Hero from "../Components/Hero/Hero";
import FeaturedBooks from "../Components/FeaturesBook/FeaturedBooks";
import CategorySection from "../Components/Category/CategorySection";
import Newsletter from "../Components/Newsletter";
import { searchBooks } from "../utils/bookApi";
import { newArrivals, categories } from "../Data/mockData";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        setLoading(true);
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
        setError(null);
      } catch (err) {
        console.error("Error fetching trending books:", err);
        setError("Failed to load trending books");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
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
          loading={loading}
          error={error}
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
        />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
