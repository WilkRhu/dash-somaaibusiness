import { create } from 'zustand';
import { Sale } from '@/lib/types/sale';

interface SalesStore {
  sales: Sale[];
  selectedSale: Sale | null;
  isLoading: boolean;
  error: string | null;
  
  // Stats
  todayTotal: number;
  todayCount: number;
  
  setSales: (sales: Sale[]) => void;
  addSale: (sale: Sale) => void;
  setSelectedSale: (sale: Sale | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Stats methods
  updateStats: (total: number, count: number) => void;
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  selectedSale: null,
  isLoading: false,
  error: null,
  todayTotal: 0,
  todayCount: 0,
  
  setSales: (sales) => set({ sales }),
  
  addSale: (sale) => set((state) => ({
    sales: [sale, ...state.sales],
    todayTotal: state.todayTotal + sale.total,
    todayCount: state.todayCount + 1,
  })),
  
  setSelectedSale: (sale) => set({ selectedSale: sale }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  updateStats: (total, count) => set({ todayTotal: total, todayCount: count }),
}));
