"use client";

import { Button } from "@/components/ui/button";
import StarRating from "@/components/star-rating";
import { formatCurrency, generateTenantUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Progress } from "@/components/ui/progress";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheckIcon, LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { RichText } from "@payloadcms/richtext-lexical/react";

const CartButton = dynamic(() => import("../components/cart-button"), {
  ssr: false,
  loading: () => (
    <Button disabled className="flex-1 bg-pink-400">
      Add to cart
    </Button>
  ),
});

interface Props {
  productId: string;
  tenantSlug: string;
}
export default function ProductView({ productId, tenantSlug }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );
  return (
    <div className="py-10 px-4 lg:px-12">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={product.image?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 ">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{product.name}</h1>
            </div>
            <div className="border-y flex ">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={generateTenantUrl(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {product.tenant?.image?.url && (
                    <Image
                      src={product.tenant.image.url}
                      alt={product.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                </Link>
              </div>
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <StarRating
                    rating={product.reviewRating}
                    iconClassName="size-4"
                  />
                  <p className="text-base font-medium">
                    {product.reviewCount} ratings
                  </p>
                </div>
              </div>
            </div>
            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-1">
                <StarRating
                  rating={product.reviewRating}
                  iconClassName="size-4"
                />
                <p className="text-base font-medium">
                  {product.reviewCount} ratings
                </p>
              </div>
            </div>
            <div className="p-6">
              {product.description ? (
                <RichText data={product.description} />
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  {product.isPurchased ? (
                    <Button
                      variant="elevated"
                      asChild
                      className="flex-1 font-medium bg-white"
                    >
                      <Link
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/library/${product.id}`}
                      >
                        View in Library
                      </Link>
                    </Button>
                  ) : (
                    <CartButton
                      productId={product.id}
                      tenantSlug={tenantSlug}
                    />
                  )}
                  <Button
                    variant="elevated"
                    className="size-12"
                    disabled={isCopied}
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("URL Copied to clipboard");

                      setTimeout(() => {
                        setIsCopied(false);
                      }, 1000);
                    }}
                  >
                    {isCopied ? <CheckCheckIcon /> : <LinkIcon />}
                  </Button>
                </div>
                <p className="text-center">
                  {product.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${product.refundPolicy} money back guarantee`}{" "}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({product.reviewRating})</p>
                    <p className="text-base">{product.reviewCount} ratings</p>
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress
                        value={product.ratingDistribution[stars]}
                        className="h-[1lh]"
                      />
                      <div className="font-medium">
                        {product.ratingDistribution[stars]}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductViewSkeleton() {
  return (
    <div className="py-10 px-4 lg:px-12">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={"/placeholder.png"}
            alt={"Placeholder"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
