import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConfigurationOption = {
  id: string;
  name: string;
  propertyName: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  configuration?: Record<string, ConfigurationOption>;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.productId === item.productId &&
              JSON.stringify(i.configuration) ===
                JSON.stringify(item.configuration),
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                JSON.stringify(i.configuration) ===
                  JSON.stringify(item.configuration)
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
