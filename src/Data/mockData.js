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
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 26.99,
    coverImage: bookCovers.annaKarenina,
    rating: 4.7,
    ratingCount: 843,
    categoryId: 3,
    isbn: "9780525559474",
    publishDate: "2020-09-29",
    publisher: "Viking",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    pdfUrl: "https://example.com/midnight-library.pdf",
    previewPages: 25
  },
  {
    id: 6,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 28.99,
    coverImage: bookCovers.warAndPeace,
    rating: 4.8,
    ratingCount: 1121,
    categoryId: 2,
    isbn: "9780593135204",
    publishDate: "2021-05-04",
    publisher: "Ballantine Books",
    description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.",
    pdfUrl: "https://example.com/project-hail-mary.pdf",
    previewPages: 30
  },
  {
    id: 7,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    price: 25.95,
    coverImage: bookCovers.prideAndPrejudice,
    rating: 4.5,
    ratingCount: 756,
    categoryId: 3,
    isbn: "9780593318171",
    publishDate: "2021-03-02",
    publisher: "Knopf",
    description: "From the Nobel Prize-winning author, a novel about the heart-breaking relationship between Klara, an Artificial Friend, and the human family who purchases her.",
    pdfUrl: "https://example.com/klara-and-sun.pdf",
    previewPages: 20
  },
  {
    id: 8,
    title: "The Four Winds",
    author: "Kristin Hannah",
    price: 28.99,
    coverImage: bookCovers.greatGatsby,
    rating: 4.6,
    ratingCount: 932,
    categoryId: 1,
    isbn: "9781250178602",
    publishDate: "2021-02-02",
    publisher: "St. Martin's Press",
    description: "From the number-one bestselling author of The Nightingale and The Great Alone comes a powerful American epic about love and heroism and hope, set during the Great Depression.",
    pdfUrl: "https://example.com/four-winds.pdf",
    previewPages: 22
  },
  {
    id: 9,
    title: "Cloud Cuckoo Land",
    author: "Anthony Doerr",
    price: 30.00,
    coverImage: bookCovers.mockingbird,
    rating: 4.7,
    ratingCount: 612,
    categoryId: 1,
    isbn: "9781982168438",
    publishDate: "2021-09-28",
    publisher: "Scribner",
    description: "A masterpiece about children on the cusp of adulthood in broken world, from the author of All the Light We Cannot See, winner of the Pulitzer Prize.",
    pdfUrl: "https://example.com/cloud-cuckoo-land.pdf",
    previewPages: 28
  },
  {
    id: 10,
    title: "The Last Thing He Told Me",
    author: "Laura Dave",
    price: 24.99,
    coverImage: bookCovers.mobyDick,
    rating: 4.4,
    ratingCount: 887,
    categoryId: 2,
    isbn: "9781501171345",
    publishDate: "2021-05-04",
    publisher: "Simon & Schuster",
    description: "A gripping mystery about a woman who thinks she's found the love of her life—until he disappears.",
    pdfUrl: "https://example.com/last-thing-he-told-me.pdf",
    previewPages: 18
  },
];

// Categories
export const categories = [
  {
    id: 1,
    name: "Fiction",
    icon: "📚",
    bookCount: 246,
  },
  {
    id: 2,
    name: "Science Fiction",
    icon: "🚀",
    bookCount: 183,
  },
  {
    id: 3,
    name: "Contemporary Fiction",
    icon: "💭",
    bookCount: 119,
  },
  {
    id: 4,
    name: "Mystery & Thriller",
    icon: "🔍",
    bookCount: 95,
  },
  {
    id: 5,
    name: "Biography & Memoir",
    icon: "👤",
    bookCount: 78,
  },
  {
    id: 6,
    name: "Self-Help",
    icon: "🌱",
    bookCount: 112,
  },
];
