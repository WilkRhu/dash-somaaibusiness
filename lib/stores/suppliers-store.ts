import { create } from 'zustand';
import type { Supplier, PurchaseOrder } from '../types/supplier';

interface SuppliersStore {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  purchaseOrders: PurchaseOrder[];
  selectedOrder: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  hasLoaded: boolean;
  
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  removeSupplier: (id: string) => void;
  setSelectedSupplier: (supplier: Supplier | null) => void;
  
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  addPurchaseOrder: (order: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  setSelectedOrder: (order: PurchaseOrder | null) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;
  setHasLoaded: (loaded: boolean) => void;
  clearError: () => void;
}

export const useSuppliersStore = create<SuppliersStore>((set) => ({
  suppliers: [],
  selectedSupplier: null,
  purchaseOrders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  hasLoaded: false,
  
  setSuppliers: (suppliers) => set({ suppliers }),
  
  addSupplier: (supplier) => set((state) => ({
    suppliers: [...state.suppliers, supplier]
  })),
  
  updateSupplier: (id, updates) => set((state) => ({
    suppliers: state.suppliers.map((supplier) =>
      supplier.id === id ? { ...supplier, ...updates } : supplier
    )
  })),
  
  removeSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter((supplier) => supplier.id !== id)
  })),
  
  setSelectedSupplier: (supplier) => set({ selectedSupplier: supplier }),
  
  setPurchaseOrders: (orders) => set({ purchaseOrders: orders }),
  
  addPurchaseOrder: (order) => set((state) => ({
    purchaseOrders: [...state.purchaseOrders, order]
  })),
  
  updatePurchaseOrder: (id, updates) => set((state) => ({
    purchaseOrders: state.purchaseOrders.map((order) =>
      order.id === id ? { ...order, ...updates } : order
    )
  })),
  
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
  
  clearError: () => set({ error: null }),
}));
