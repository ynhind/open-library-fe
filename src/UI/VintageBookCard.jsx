// // src/Components/UI/VintageBookCard.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBookOpen,
//   faShoppingCart,
//   faBookmark,
// } from "@fortawesome/free-solid-svg-icons";
// import "./VintageBookCard.css";

// export default function VintageBookCard({ book }) {
//   const { title, author, image, price, categories, previewLink, buyLink } =
//     book;

//   return (
//     <div className="vintage-book-card">
//       <img
//         src={image}
//         alt={`${title} cover`}
//         className="book-cover"
//         onError={(e) => {
//           e.target.src =
//             "https://placehold.co/300x450/efebe9/5d4037?text=No+Image";
//         }}
//       />
//       <h3 className="book-title">{title}</h3>
//       <p className="book-author">By {author}</p>
//       <p className="book-categories">{categories?.join(", ")}</p>

//       <div className="book-actions">
//         <button className="btn-vintage-secondary">
//           <FontAwesomeIcon icon={faBookOpen} /> Preview
//         </button>
//         <button className="btn-vintage">
//           <FontAwesomeIcon icon={faShoppingCart} /> Buy ${price}
//         </button>
//       </div>
//       <button className="btn-vintage-secondary btn-full">
//         <FontAwesomeIcon icon={faBookmark} /> Borrow
//       </button>
//     </div>
//   );
// }
