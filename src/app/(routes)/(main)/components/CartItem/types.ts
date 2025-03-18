import { CartItem } from '@/app/utils/cart';

export type Props = {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
};
