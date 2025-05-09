import React from "react";
import CategoryCard from "./CategoryCard";

const CategorySection = ({ categories }) => {
  return (
    <section className="py-12 md:py-16 bg-amber-100/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 text-center mb-10">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              icon={category.icon}
              bookCount={category.bookCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
