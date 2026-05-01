import { create } from 'zustand';
import { KitchenOrder } from '@/lib/types/kitchen-order';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

interface KitchenOrdersStore {
  orders: KitchenOrder[];
  todayOrders: KitchenOrder[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchOrders: (establishmentId: string) => Promise<void>;
  setOrder: (order: KitchenOrder) => void;
  addOrder: (order: KitchenOrder) => void;
  removeOrder: (id: string) => void;
  clearOrders: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersStore>((set, get) => ({
  orders: [],
  todayOrders: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchOrders: async (establishmentId: string) => {
    const { lastFetchedAt, isLoading } = get();
    if (isLoading) return;
    if (lastFetchedAt && Date.now() - lastFetchedAt < 10000) return;
    try {
      set({ isLoading: true, error: null });
      const response = await kitchenOrdersApi.list(establishmentId, { limit: 100 });
      const orders = response.data;
      set({ orders, todayOrders: orders.filter((o) => isToday(o.createdAt)), lastFetchedAt: Date.now() });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || 'Erro ao carregar pedidos' });
    } finally {
      set({ isLoading: false });
    }
  },

  setOrder: (order: KitchenOrder) => {
    set((state) => {
      const exists = state.orders.some((o) => o.id === order.id);
      const orders = exists ? state.orders.map((o) => (o.id === order.id ? order : o)) : state.orders;
      return { orders, todayOrders: orders.filter((o) => isToday(o.createdAt)) };
    });
  },

  addOrder: (order: KitchenOrder) => {
    set((state) => {
      if (state.orders.some((o) => o.id === order.id)) return state;
      const orders = [order, ...state.orders];
      return { orders, todayOrders: orders.filter((o) => isToday(o.createdAt)) };
    });
  },

  removeOrder: (id: string) => {
    set((state) => {
      const orders = state.orders.filter((o) => o.id !== id);
      return { orders, todayOrders: orders.filter((o) => isToday(o.createdAt)) };
    });
  },

  clearOrders: () => {
    set({ orders: [], todayOrders: [], lastFetchedAt: null });
  },
}));
