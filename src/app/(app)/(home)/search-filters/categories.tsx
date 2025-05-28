"use client";
import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";
import { useState } from "react";

interface CategoriesProps {
  categories: any;
}
export const Categories = ({ categories }: CategoriesProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isNavigationHovered, setIsNavigationHovered] = useState(false);
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center ">
        {categories.map((category: Category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
