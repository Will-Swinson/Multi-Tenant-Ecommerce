import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReviewForm from "./review-form";

interface Props {
  productId: string;
}

export default function ReviewSidebar({ productId }: Props) {
  const trpc = useTRPC();
  const { data: review } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId }),
  );
  return <ReviewForm productId={productId} initialData={review} />;
}
