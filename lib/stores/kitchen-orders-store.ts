import { create } from 'zustand';
import { KitchenOrder, KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';

const POLL_INTERVAL_MS = 30000; // 30s

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

interface KitchenOrdersStore {
  orders: KitchenOrder[];
  todayOrders: KitchenOrder[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  pollingActive: boolean;
  _pollTimer: ReturnType<typeof setInterval> | null;

  // Ações
  fetchOrders: (establishmentId: string) => Promise<void>;
  startPolling: (establishmentId: string) => void;
  stopPolling: () => void;
  setOrder: (order: KitchenOrder) => void;
  clearOrders: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersStore>((set, get) => ({
  orders: [],
  todayOrders: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  pollingActive: false,
  _pollTimer: null,

  fetchOrders: async (establishmentId: string) => {
    // Evita requisição duplicada se já buscou há menos de 10s
    const { lastFetchedAt, isLoading } = get();
    if (isLoading) return;
    if (lastFetchedAt && Date.now() - lastFetchedAt < 10000) return;

    try {
      set({ isLoading: true, error: null });
      const response = await kitchenOrdersApi.list(establishmentId, { limit: 100 });
      const orders = response.data;
      const todayOrders = orders.filter((o) => isToday(o.createdAt));
      set({ orders, todayOrders, lastFetchedAt: Date.now() });
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao carregar pedidos';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  startPolling: (establishmentId: string) => {
    const { _pollTimer, fetchOrders } = get();
    if (_pollTimer) return; // já está rodando

    // Busca imediata
    fetchOrders(establishmentId);

    const timer = setInterval(() => {
      // Pausa se a aba não estiver visível
      if (document.hidden) return;
      fetchOrders(establishmentId);
    }, POLL_INTERVAL_MS);

    set({ _pollTimer: timer, pollingActive: true });
  },

  stopPolling: () => {
    const { _pollTimer } = get();
    if (_pollTimer) {
      clearInterval(_pollTimer);
      set({ _pollTimer: null, pollingActive: false });
    }
  },

  setOrder: (order: KitchenOrder) => {
    set((state) => {
      const orders = state.orders.map((o) => (o.id === order.id ? order : o));
      const todayOrders = orders.filter((o) => isToday(o.createdAt));
      return { orders, todayOrders };
    });
  },

  clearOrders: () => {
    get().stopPolling();
    set({ orders: [], todayOrders: [], lastFetchedAt: null });
  },
}));
