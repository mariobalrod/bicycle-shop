import { CartItem } from '@/app/store/cart';

export type Props = {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
};
