import { loadProductFilters } from "@/modules/products/search-params";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

import ProductListView from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

import React from "react";

export default async function TenantPage({ searchParams, params }: Props) {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = await getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_PAGE_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} />
    </HydrationBoundary>
  );
}
