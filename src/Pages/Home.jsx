import React from "react";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";
import Hero from "../Components/Hero/Hero";
import FeaturedBooks from "../Components/FeaturesBook/FeaturedBooks";
import CategorySection from "../Components/Category/CategorySection";
import Newsletter from "../Components/Newsletter";
import { featuredBooks, newArrivals, categories } from "../Data/mockData";
import { FaStar } from "react-icons/fa";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav className="default" />

      <main className="flex-grow">
        <Hero />

        <FeaturedBooks
          title={
            <>
              <FaStar className="text-amber-700 inline mr-2 mb-2" />
              Top Trending Books{" "}
            </>
          }
          books={featuredBooks}
          viewAllLink="/category/classics"
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
