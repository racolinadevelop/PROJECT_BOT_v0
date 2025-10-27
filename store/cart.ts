import { create } from 'zustand';
import { CartItem } from '@/lib/types';

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalCents: () => number;
  setQty: (productId: string, qty: number) => void;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item) =>
    set((state) => {
      const exists = state.items.find(i => i.productId === item.productId);
      if (exists) {
        return {
          items: state.items.map(i =>
            i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
          )
        };
      }
      return { items: [...state.items, item] };
    }),
  remove: (productId) => set((state) => ({ items: state.items.filter(i => i.productId !== productId) })),
  clear: () => set({ items: [] }),
  totalCents: () => get().items.reduce((acc, i) => acc + i.unitPriceCents * i.qty, 0),
  setQty: (productId, qty) =>
    set((state) => ({
      items: state.items
        .map(i => i.productId === productId ? { ...i, qty } : i)
        .filter(i => i.qty > 0)
    })),
}));
