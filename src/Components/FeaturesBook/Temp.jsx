// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Star, ShoppingCart, Heart, Eye, BookOpen } from "lucide-react";

// const BookCard = ({ book }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const { id, title, author, coverImage, price, rating, ratingCount } = book;

//   // Create rating stars
//   const renderRatingStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
//     const stars = [];

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(
//         <Star
//           key={`full-${i}`}
//           size={14}
//           className="fill-amber-500 text-amber-500"
//         />
//       );
//     }

//     if (hasHalfStar) {
//       stars.push(
//         <div key="half" className="relative">
//           <Star size={14} className="text-gray-300" />
//           <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
//             <Star size={14} className="fill-amber-500 text-amber-500" />
//           </div>
//         </div>
//       );
//     }

//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(
//         <Star key={`empty-${i}`} size={14} className="text-gray-300" />
//       );
//     }

//     return stars;
//   };

//   return (
//     <div
//       className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center  "
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative  overflow-hidden h-full">
//         <Link to={`/book/${id}`} className="block">
//           <img
//             src={coverImage}
//             alt={title}
//             className={`w-full h-full object-cover transition-transform duration-700 ${
//               isHovered ? "scale-110" : "scale-100"
//             }`}
//           />
//         </Link>
//         <button
//           className={`absolute top-2 right-2 p-2 bg-white/80 rounded-full transition-all duration-300 ${
//             isFavorite ? "text-red-500" : "text-gray-500"
//           }`}
//           onClick={() => setIsFavorite(!isFavorite)}
//         >
//           <Heart size={16} className={isFavorite ? "fill-red-500" : ""} />
//         </button>
//       </div>

//       <div className="p-4 w-full flex flex-col items-center">
//         <Link to={`/book/${id}`} className="block text-center">
//           <h3 className="font-serif font-medium text-lg text-stone-800 mb-1">
//             {title}
//           </h3>
//           <p className="text-stone-600 text-sm mb-2">{author}</p>
//         </Link>

//         <div className="flex items-center mb-4">
//           <div className="flex mr-1">{renderRatingStars(rating)}</div>
//           <span className="ml-1 text-xs text-stone-500">({ratingCount})</span>
//         </div>

//         <div className="flex flex-col w-2/3 gap-2">
//           <button className="flex items-center justify-center py-2 px-2 border border-solid-1px border-amber-800 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md transition-colors w-full">
//             <Eye size={16} className="mr-2" />
//             PREVIEW
//           </button>

//           <button className="flex items-center justify-center py-2 px-2 border border-solid-1px border-amber-800 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors w-full">
//             <ShoppingCart size={16} bold className="mr-2" />
//             BUY ${price.toFixed(2)}
//           </button>

//           <button className="flex items-center justify-center py-2 px-2 border border-solid-1px border-amber-800 bg-amber-50 hover:bg-stone-200 text-stone-800 rounded-md transition-colors w-full">
//             <BookOpen size={16} className="mr-2" />
//             BORROW
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookCard;
