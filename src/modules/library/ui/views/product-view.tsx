"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ReviewSidebar from "../components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ReviewFormSkeleton } from "../components/review-form";
import { Suspense } from "react";

interface Props {
  productId: string;
}

export default function ProductView({ productId }: Props) {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({ productId }),
  );
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <Link prefetch href="/library" className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="text-base font-medium">Back to Library</span>
        </Link>
      </nav>
      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 ">
          <h1 className="text-[40px] font-medium">{product.name}</h1>
        </div>
      </header>
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-md border gap-4">
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewSidebar productId={product.id} />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-5">
            {product.content ? (
              <RichText data={product.content} />
            ) : (
              <p className="font-medium italic text-muted-foreground">
                No Special Content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductViewSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="text-base font-medium">Back to Library</span>
        </div>
      </nav>
    </div>
  );
}
