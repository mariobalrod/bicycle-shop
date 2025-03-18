'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { CartItem } from '@/app/(routes)/(main)/components/CartItem';
import { CartSummary } from '@/app/(routes)/(main)/components/CartSummary';
import { Button } from '@/app/components/Button';
import { useCartStore } from '@/app/utils/cart';
import { paths } from '@/app/utils/paths';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const handleCheckout = useCallback(() => {
    toast.info('Checkout functionality coming soon!');
  }, []);

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity],
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      removeItem(productId);
      toast.success('Item removed from cart');
    },
    [removeItem],
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    toast.success('Cart cleared');
  }, [clearCart]);

  const subtotal = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-500">
          Looks like you haven&apos;t added any items to your cart yet
        </p>
        <Link href={paths.products.all} className="mt-8">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-0 divide-y">
            {items.map((item) => (
              <CartItem
                key={`${item.productId}-${JSON.stringify(item.configuration)}`}
                item={item}
                onUpdateQuantity={(quantity) =>
                  handleUpdateQuantity(item.productId, quantity)
                }
                onRemove={() => handleRemoveItem(item.productId)}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
}
