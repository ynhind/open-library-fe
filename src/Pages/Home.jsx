import React from "react";
import Header from "../Components/Header/Header";
import Brands from "../Components/Brands/Brands";
import FeaturesBook from "../Components/FeaturesBook/FeaturesBook";
import BestSellingBook from "../Components/BestSellingBook/BestSellingBook";
import PopularBooks from "../Components/PopularBooks/PopularBooks";
import Quote from "../Components/Quote/Quote";
import LatestArticle from "../Components/LatestArticle/LatestArticle";
import SearchBar from "../Components/Nav/SearchBar/SearchBar";

export default function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <Brands />
      <FeaturesBook />
      <BestSellingBook />
      <PopularBooks />
      <Quote />
      <LatestArticle />
    </>
  );
}
