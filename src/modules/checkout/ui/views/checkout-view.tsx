"use client";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { generateTenantUrl } from "@/lib/utils";
import CheckoutItem from "../components/checkout-item";
import CheckoutSidebar from "../components/checkout-siderbar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface Props {
  tenantSlug: string;
}
export default function CheckoutView({ tenantSlug }: Props) {
  const [checkoutStates, setCheckoutStates] = useCheckoutStates();

  const queryClient = useQueryClient();
  const router = useRouter();
  const trpc = useTRPC();
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);
  const {
    data: products,
    error,
    isLoading,
  } = useQuery(trpc.checkout.getProducts.queryOptions({ ids: productIds }));

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setCheckoutStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") router.push("/sign-in");
        toast.error(error.message);
      },
    }),
  );

  useEffect(() => {
    if (checkoutStates.success) {
      setCheckoutStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      window.location.href = "/library";
    }
  }, [
    checkoutStates.success,
    setCheckoutStates,
    router,
    clearCart,
    queryClient,
    trpc.library.getMany,
  ]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  if (products?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-lg font-medium">No products found 😭</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {products?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === products.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantUrl(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantUrl(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={products?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={checkoutStates.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
}
