import { loadProductFilters } from "@/modules/products/search-params";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

import ProductListView from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

interface Props {
 
  searchParams: Promise<SearchParams>;
}

export default async function CategoryPage({  searchParams }: Props) {
  const filters = await loadProductFilters(searchParams);

  const queryClient = await getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_PAGE_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView  />
    </HydrationBoundary>
  );
}
