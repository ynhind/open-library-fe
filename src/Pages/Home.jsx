import React from "react";
import Header from "../Components/Header/Header";
import Brands from "../Components/Brands/Brands";
import FeaturesBook from "../Components/FeaturesBook/FeaturesBook";
import BestSellingBook from "../Components/BestSellingBook/BestSellingBook";
import PopularBook from "../Components/PopularBook/PopularBook";

export default function Home() {
  return (
    <>
      <Header />
      <Brands />
      <FeaturesBook />
      <BestSellingBook />
      <PopularBook />
    </>
  );
}
