import { Suspense } from "react";
import ProductFilters from "../components/product-filters";
import ProductList, { ProductListSkeleton } from "../components/product-list";
import ProductsSort from "../components/products-sort";

interface Props {
  category?: string;
  tenantSlug?: string;
}
export default function ProductListView({ category, tenantSlug }: Props) {
  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-7-0 justify-between">
        <p className="text-2xl font-medium">Curated for you</p>
        <ProductsSort />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        <div className="lg:col-span-2 xl:col-span-2">
          <ProductFilters />
        </div>

        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} tenantSlug={tenantSlug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
