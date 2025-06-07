import React, { useState } from "react";
import { useToast } from "../hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email) {
      // In a real app, this would connect to an API
      toast({
        title: "Thank you for subscribing!",
        description: "You're now part of our literary community.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-12 md:py-16 bg-stone-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-gradient-to-r from-amber-800 to-amber-700 rounded-lg shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-50 mb-4">
              Join Our Literary Community
            </h2>
            <p className="text-amber-100 max-w-xl mx-auto">
              Subscribe to our newsletter for curated reading lists, new
              arrivals, and exclusive discounts on rare finds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md bg-amber-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-md font-medium transition-all duration-300"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-amber-200 text-center mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
