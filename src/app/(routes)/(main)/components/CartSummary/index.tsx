import { Button } from '@/app/components/Button';

import { Props } from './types';

export function CartSummary({ subtotal, onCheckout }: Props) {
  // Example values for taxes and shipping
  const tax = subtotal * 0.21; // 21% VAT
  const shipping = subtotal > 100 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium text-gray-900">
            ${subtotal.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">VAT (21%)</p>
          <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Shipping</p>
          <p className="text-sm font-medium text-gray-900">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-900">Total</p>
            <p className="text-base font-medium text-gray-900">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onCheckout} className="w-full mt-6">
        Proceed to Checkout
      </Button>

      {subtotal < 100 && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          Add ${(100 - subtotal).toFixed(2)} more to get free shipping!
        </p>
      )}
    </div>
  );
}
