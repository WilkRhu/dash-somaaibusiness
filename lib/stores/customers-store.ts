import { create } from 'zustand';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  createdAt: string;
}

interface CustomersStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCustomersStore = create<CustomersStore>((set) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  
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
  
  clearError: () => set({ error: null }),
}));
