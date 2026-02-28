import { create } from 'zustand';

interface CartItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.inventoryItemId === item.inventoryItemId);
      
      if (existingItem) {
        const updatedItems = state.items.map((i) =>
          i.inventoryItemId === item.inventoryItemId
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.unitPrice }
            : i
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, i) => sum + i.subtotal, 0),
        };
      }
      
      const newItems = [...state.items, item];
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }),
  
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }),
  
  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity, subtotal: quantity * i.unitPrice } : i
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }),
  
  clear: () => set({ items: [], total: 0 }),
}));
