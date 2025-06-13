import { DEFAULT_PAGE_LIMIT } from "@/constants";
import LibraryView from "@/modules/library/ui/views/library-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic"

export default async function LibraryPage() {
  const queryClient = await getQueryClient();
  void  queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({ limit: DEFAULT_PAGE_LIMIT }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
}
