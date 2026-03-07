import { create } from 'zustand';
import { InventoryItem } from '@/lib/types/inventory';

interface InventoryStore {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  isLoading: boolean;
  error: string | null;
  
  setItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  setSelectedItem: (item: InventoryItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  
  setItems: (items) => set({ items }),
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => {
      if (item.id === id) {
        // Preservar arrays vazios e campos importantes que não vieram no update
        const merged = { ...item, ...updates };
        
        // Se images não veio no update, manter o valor anterior
        if (updates.images === undefined && item.images !== undefined) {
          merged.images = item.images;
        }
        
        // Se image não veio no update, manter o valor anterior
        if (updates.image === undefined && item.image !== undefined) {
          merged.image = item.image;
        }
        
        return merged;
      }
      return item;
    })
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  
  setSelectedItem: (item) => set({ selectedItem: item }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
