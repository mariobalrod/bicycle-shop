import { Minus, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/app/components/Button';
import { type CartItem } from '@/app/store/cart';

import { Props } from './types';

export function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-6 border-b">
      <div className="w-24 h-24">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
          <p className="text-base font-medium text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          ${item.price.toFixed(2)} per unit
        </p>

        {item.configuration && Object.keys(item.configuration).length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {Object.entries(item.configuration).map(([propertyId, option]) => (
              <p key={propertyId} className="text-xs">
                {option.propertyName}:{' '}
                <strong className="ml-0.5">{option.name}</strong>
              </p>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="w-8 text-center">{item.quantity}</span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
