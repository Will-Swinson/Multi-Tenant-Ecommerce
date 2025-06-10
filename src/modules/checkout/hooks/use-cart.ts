import { useCartStore } from "../store/use-cart-store";

export function useCart(tenantSlug: string) {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearAllCarts,
    clearCart,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  function toggleProduct(productId: string) {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  }

  function isProductInCart(productId: string) {
    return productIds.includes(productId);
  }

  function clearTenantCart() {
    clearCart(tenantSlug);
  }

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    isProductInCart,
    toggleProduct,
    totalItems: productIds.length,
  };
}
