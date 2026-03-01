import { create } from 'zustand';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/lib/types/customer';
import { customerApi } from '@/lib/api/customer';

interface CustomerStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCustomers: (establishmentId: string) => Promise<void>;
  fetchCustomer: (establishmentId: string, id: string) => Promise<void>;
  createCustomer: (establishmentId: string, dto: CreateCustomerDto) => Promise<Customer>;
  updateCustomer: (establishmentId: string, id: string, dto: UpdateCustomerDto) => Promise<void>;
  deleteCustomer: (establishmentId: string, id: string) => Promise<void>;
  addLoyaltyPoints: (establishmentId: string, id: string, points: number) => Promise<void>;
  clearError: () => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,

  fetchCustomers: async (establishmentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const customers = await customerApi.list(establishmentId);
      set({ customers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCustomer: async (establishmentId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await customerApi.getById(establishmentId, id);
      set({ selectedCustomer: customer, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCustomer: async (establishmentId: string, dto: CreateCustomerDto) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await customerApi.create(establishmentId, dto);
      set((state) => ({
        customers: [...state.customers, customer],
        isLoading: false,
      }));
      return customer;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (establishmentId: string, id: string, dto: UpdateCustomerDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await customerApi.update(establishmentId, id, dto);
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? updated : c)),
        selectedCustomer: state.selectedCustomer?.id === id ? updated : state.selectedCustomer,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCustomer: async (establishmentId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await customerApi.delete(establishmentId, id);
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addLoyaltyPoints: async (establishmentId: string, id: string, points: number) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await customerApi.addLoyaltyPoints(establishmentId, id, points);
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
