import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { navLinks, navRight } from "../../Data/Data";
import { VscMenu } from "react-icons/vsc";
import { GrClose } from "react-icons/gr";
import { useState } from "react";
import "./Nav.css";

export default function Footer() {
  const [isNavLinksShowing, setIsNavLinksShowing] = useState(false);

  if (innerWidth < 1024) {
    window.addEventListener("scroll", () => {
      document.querySelector(".nav-links").classList.add("navLinksHide");
      setIsNavLinksShowing(false);
    });
    window.addEventListener("scroll", () => {
      document
        .querySelector("nav")
        .classList.toggle("navShadow", window.scrollY > 0);
    });
  }
  return (
    <nav>
      <div className="container nav-container">
        {
          <Link to="/" className="logo">
            <img src={Logo} alt="Logo" />
          </Link>
        }
        <ul
          className={`nav-links ${
            isNavLinksShowing ? "navLinksShow" : "navLinksHide"
          }`}
        >
          {navLinks.map(({ name, path }, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="nav-right">
          {navRight.managements.map((item, index) => (
            <Link key={index} target="_blank" className="management-icons">
              <item.icon />
            </Link>
          ))}
          <button
            className="menu-button "
            onClick={() => setIsNavLinksShowing(!isNavLinksShowing)}
          >
            {!isNavLinksShowing ? <VscMenu /> : <GrClose />}
          </button>
        </div>
      </div>
    </nav>
  );
}

// import React, { useState } from "react";

// const Nav = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
//   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

//   // Toggle mobile menu and control body scroll
//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//     document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "";
//   };

//   // Toggle categories in mobile view
//   const toggleMobileCategories = () => {
//     setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
//   };

//   // Toggle search in mobile view
//   const toggleMobileSearch = () => {
//     setIsMobileSearchOpen(!isMobileSearchOpen);
//   };

//   return (
//     <>
//       {/* Professional Vintage Navbar */}
//       <header className="vintage-bg-header fixed w-full top-0 z-50 shadow-sm">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-18">
//             {/* Logo */}
//             <div className="flex items-center">
//               <a href="#" className="flex items-center">
//                 <i className="fas fa-book-open text-2xl mr-2 vintage-accent-text"></i>
//                 <span className="text-2xl font-bold logo-text">
//                   Old<span className="vintage-accent-text">Tomes</span>
//                 </span>
//               </a>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-8">
//               <a href="#" className="nav-link text-gray-700">
//                 Home
//               </a>
//               {/* Add other nav items here */}
//             </nav>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden vintage-button-outline p-2"
//               onClick={toggleMobileMenu}
//               aria-label="Menu"
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
//           <div className="fixed right-0 top-0 w-4/5 h-full bg-white p-5 overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <div className="text-xl font-bold">Menu</div>
//               <button
//                 className="vintage-button-outline p-2"
//                 onClick={toggleMobileMenu}
//                 aria-label="Close"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             {/* Mobile menu content */}
//             <nav className="space-y-4">
//               <a href="#" className="block nav-link">
//                 Home
//               </a>
//               {/* Add other mobile nav items */}
//             </nav>
//           </div>
//         </div>
//       )}

//       {/* Sample Page Content */}
//       <main className="main-content">
//         <section className="py-12 md:py-16 bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-50">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6">
//               <span className="font-vintage-header">Discover Timeless</span>{" "}
//               <span className="font-vintage-header vintage-accent-text">
//                 Knowledge.
//               </span>
//             </h1>
//             <p className="text-lg vintage-secondary-text mb-8 max-w-2xl mx-auto">
//               With a modernized navigation experience, browse our collection
//               with ease.
//             </p>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default Nav;
