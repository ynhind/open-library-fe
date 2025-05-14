// Mock data for the OldTomes online library prototype
// Book Cover Images - Using placeholder images
const bookCovers = {
  prideAndPrejudice:
    "https://images.unsplash.com/photo-1500673922987-e212871fec22",
  greatGatsby: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  mobyDick: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  mockingbird: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  annaKarenina: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  warAndPeace: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
};
//call api searchBooks
// Mock data for books

// Featured Books
export const featuredBooks = [
  {
    id: 1,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 24.99,
    coverImage: bookCovers.prideAndPrejudice,
    rating: 4.8,
    ratingCount: 1245,
    categoryId: 1,
  },
  {
    id: 2,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 22.5,
    coverImage: bookCovers.greatGatsby,
    rating: 4.5,
    ratingCount: 987,
    categoryId: 1,
  },
  {
    id: 3,
    title: "Moby Dick",
    author: "Herman Melville",
    price: 28.75,
    coverImage: bookCovers.mobyDick,
    rating: 4.6,
    ratingCount: 756,
    categoryId: 1,
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 19.99,
    coverImage: bookCovers.mockingbird,
    rating: 4.9,
    ratingCount: 1432,
    categoryId: 1,
  },
];

// New Arrivals
export const newArrivals = [
  {
    id: 5,
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    price: 32.99,
    coverImage: bookCovers.annaKarenina,
    rating: 4.7,
    ratingCount: 643,
    categoryId: 1,
  },
  {
    id: 6,
    title: "War and Peace",
    author: "Leo Tolstoy",
    price: 34.5,
    coverImage: bookCovers.warAndPeace,
    rating: 4.6,
    ratingCount: 521,
    categoryId: 1,
  },
  {
    id: 7,
    title: "Wuthering Heights",
    author: "Emily Brontë",
    price: 21.25,
    coverImage: bookCovers.prideAndPrejudice,
    rating: 4.4,
    ratingCount: 876,
    categoryId: 1,
  },
  {
    id: 8,
    title: "The Odyssey",
    author: "Homer",
    price: 18.99,
    coverImage: bookCovers.greatGatsby,
    rating: 4.8,
    ratingCount: 432,
    categoryId: 1,
  },
];

// Categories
export const categories = [
  {
    id: 1,
    name: "Classic Literature",
    icon: "📚",
    bookCount: 246,
  },
  {
    id: 2,
    name: "History",
    icon: "⏳",
    bookCount: 183,
  },
  {
    id: 3,
    name: "Philosophy",
    icon: "💭",
    bookCount: 119,
  },
  {
    id: 4,
    name: "Poetry",
    icon: "📝",
    bookCount: 95,
  },
];
