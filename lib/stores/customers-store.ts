import { create } from 'zustand';
import type { Customer } from '../types/customer';

interface CustomersStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
}

export const useCustomersStore = create<CustomersStore>((set) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  
  setCustomers: (customers) => set({ customers }),
  
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, customer]
  })),
  
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map((customer) =>
      customer.id === id ? { ...customer, ...updates } : customer
    )
  })),
  
  removeCustomer: (id) => set((state) => ({
    customers: state.customers.filter((customer) => customer.id !== id)
  })),
  
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  clearError: () => set({ error: null }),
}));
