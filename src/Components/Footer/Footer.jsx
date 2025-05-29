import React from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Book className="text-amber-500" size={24} />
              <span className="text-xl font-serif font-bold text-amber-50">
                Open<span className="text-amber-500">Library</span>
              </span>
            </Link>
            <p className="mb-4  text-sm leading-relaxed">
              Specializing in rare and vintage books since 1985. Our carefully
              curated collection brings literary treasures from the past to your
              modern bookshelf.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-stone-400 hover:text-amber-500 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-amber-500 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-amber-500 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-amber-50 font-medium mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/rare-finds"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  Rare Finds
                </Link>
              </li>
              <li>
                <Link
                  to="/gift-cards"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-amber-50 font-medium mb-4 text-lg">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/category/classic-literature"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  Classic Literature
                </Link>
              </li>
              <li>
                <Link
                  to="/category/history"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  History
                </Link>
              </li>
              <li>
                <Link
                  to="/category/philosophy"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  Philosophy
                </Link>
              </li>
              <li>
                <Link
                  to="/category/poetry"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  Poetry
                </Link>
              </li>
              <li>
                <Link
                  to="/category/first-editions"
                  className="inline-block text-stone-400 hover:text-amber-500 transition-colors hover:translate-x-1 transform duration-200"
                >
                  First Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-amber-50 font-medium mb-4 text-lg">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin
                  size={18}
                  className="text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                />
                <span>123 Library Lane, Booktown, BT 12345</span>
              </li>
              <li className="flex items-center">
                <Phone
                  size={18}
                  className="text-amber-500 mr-2 flex-shrink-0"
                />
                <span>(084)xxxxxxx</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-amber-500 mr-2 flex-shrink-0" />
                <span>info@openlibrary.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-amber-50 font-medium mb-2">Store Hours</h4>
              <p className="text-sm">Monday - Saturday: 10AM - 8PM</p>
              <p className="text-sm">Sunday: 12PM - 6PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-stone-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-stone-400 mb-4 md:mb-0">
              &copy; {currentYear} OpenLibrary. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-400">
              <Link
                to="/privacy-policy"
                className="hover:text-amber-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="hover:text-amber-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/shipping"
                className="hover:text-amber-500 transition-colors"
              >
                Shipping
              </Link>
              <Link
                to="/returns"
                className="hover:text-amber-500 transition-colors"
              >
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
