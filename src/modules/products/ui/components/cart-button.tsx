import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
}

export default function CartButton({ tenantSlug, productId }: Props) {
  const cart = useCart(tenantSlug);

  const isProductInCart = cart.isProductInCart(productId);

  return (
    <Button
      variant="elevated"
      className={cn("flex-1 bg-pink-400", isProductInCart && "bg-white")}
      onClick={() => cart.toggleProduct(productId)}
    >
      {isProductInCart ? "Remove from cart" : "Add to cart"}
    </Button>
  );
}
