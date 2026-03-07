import { create } from 'zustand';

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  discount: number;
  subtotal: number;
  total: number;
  
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemDiscount: (id: string, discount: number) => void;
  setDiscount: (discount: number) => void;
  clear: () => void;
}

const calculateSubtotal = (unitPrice: number, quantity: number, discount: number) => {
  return (unitPrice * quantity) - discount;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  discount: 0,
  subtotal: 0,
  total: 0,
  
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.itemId === item.itemId);
      
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((i) =>
          i.itemId === item.itemId
            ? { 
                ...i, 
                quantity: i.quantity + item.quantity,
                subtotal: calculateSubtotal(i.unitPrice, i.quantity + item.quantity, i.discount)
              }
            : i
        );
      } else {
        const newItem = {
          ...item,
          id: `${item.itemId}-${Date.now()}`,
          subtotal: calculateSubtotal(item.unitPrice, item.quantity, item.discount),
        };
        updatedItems = [...state.items, newItem];
      }
      
      const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0);
      return {
        items: updatedItems,
        subtotal,
        total: subtotal - state.discount,
      };
    }),
  
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      const subtotal = newItems.reduce((sum, i) => sum + i.subtotal, 0);
      return {
        items: newItems,
        subtotal,
        total: subtotal - state.discount,
      };
    }),
  
  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.id !== id);
        const subtotal = newItems.reduce((sum, i) => sum + i.subtotal, 0);
        return {
          items: newItems,
          subtotal,
          total: subtotal - state.discount,
        };
      }
      
      const updatedItems = state.items.map((i) =>
        i.id === id 
          ? { ...i, quantity, subtotal: calculateSubtotal(i.unitPrice, quantity, i.discount) }
          : i
      );
      const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0);
      return {
        items: updatedItems,
        subtotal,
        total: subtotal - state.discount,
      };
    }),
  
  updateItemDiscount: (id, discount) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id 
          ? { ...i, discount, subtotal: calculateSubtotal(i.unitPrice, i.quantity, discount) }
          : i
      );
      const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0);
      return {
        items: updatedItems,
        subtotal,
        total: subtotal - state.discount,
      };
    }),
  
  setDiscount: (discount) =>
    set((state) => ({
      discount,
      total: state.subtotal - discount,
    })),
  
  clear: () => set({ items: [], discount: 0, subtotal: 0, total: 0 }),
}));
