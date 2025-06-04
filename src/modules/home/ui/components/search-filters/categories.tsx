"use client";
import { CategoryDropdown } from "./category-dropdown";

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useParams } from "next/navigation";

interface CategoriesProps {
  categories: CategoriesGetManyOutput;
}
export const Categories = ({ categories }: CategoriesProps) => {
  const { category } = useParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = category || "all";

  const activeCategoryIndex = categories.findIndex(
    (cat) => cat.slug === activeCategory,
  );

  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;

        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };
    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);
    return () => resizeObserver.disconnect();
  }, [categories.length]);
  // const [isActive, setIsActive] = useState(false);
  // const [isNavigationHovered, setIsNavigationHovered] = useState(false);
  return (
    <div className="relative w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      {/* Hidden Elements */}
      <div
        ref={measureRef}
        className="opacity-0 absolute pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
      </div>
      {/* Visible Elements */}
      <div
        ref={containerRef}
        className="flex flex-nowrap items-center "
        onMouseEnter={() => setIsAnyHovered(!isAnyHovered)}
        onMouseLeave={() => setIsAnyHovered(!isAnyHovered)}
      >
        {categories.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary",
            )}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
