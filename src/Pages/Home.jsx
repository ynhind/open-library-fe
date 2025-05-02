import React from "react";
import Header from "../Components/Header/Header";
import Brands from "../Components/Brands/Brands";
import FeaturesBook from "../Components/FeaturesBook/FeaturesBook";
import BestSellingBook from "../Components/BestSellingBook/BestSellingBook";
import PopularBooks from "../Components/PopularBooks/PopularBooks";
import Quote from "../Components/Quote/Quote";
import LatestArticle from "../Components/LatestArticle/LatestArticle";
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api.js";

export default function Home() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Calling an endpoint on your BE (e.g., "/test")
    apiRequest("test")
      .then((data) => setMessage(data))
      .catch((err) => console.error("API error:", err));
  }, []);
  return (
    <>
      <Header />
      <Brands />
      <FeaturesBook />
      <BestSellingBook />
      <PopularBooks />
      <Quote />
      <LatestArticle />
      <div>
        <h1>API Test</h1>
        <p>{message || "Loading..."}</p>
      </div>
    </>
  );
}
