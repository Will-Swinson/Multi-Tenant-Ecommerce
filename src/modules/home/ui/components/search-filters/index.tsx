"use client";

import { useTRPC } from "@/trpc/client";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import BreadcrumbNavigation from "./breadcrumb-navigation";
import useProductFilters from "@/modules/products/hooks/use-product-filters";

export const SearchFilters = () => {
  const [filters, setFilters] = useProductFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const { category, subcategory } = useParams();
  const activeCategory = (category as string) || "all";

  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory,
  );

  const activeCategoryBGColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubcategory = (subcategory as string) || undefined;

  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => activeSubcategory === subcategory.slug,
    )?.name || null;
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryBGColor }}
    >
      <SearchInput
        defaultValue={filters.search}
        onChange={(value) => setFilters({ search: value })}
      />
      <div className="hidden lg:block">
        <Categories categories={data} />
      </div>
      <div>
        <BreadcrumbNavigation
          activeCategoryName={activeCategoryName}
          activeCategory={activeCategory}
          activeSubcategoryName={activeSubcategoryName}
        />
      </div>
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
