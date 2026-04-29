import apiClient from './client';
import {
  KitchenOrder,
  KitchenOrderItem,
  CreateKitchenOrderDto,
  UpdateKitchenOrderStatusDto,
  KitchenOrdersFilters,
} from '@/lib/types/kitchen-order';

// Converte qualquer formato de data para timestamp (ms)
function toTimestamp(dateStr: string | number | null | undefined): number {
  if (!dateStr) return 0;
  // Se já é número ou string numérica
  const num = Number(dateStr);
  if (!isNaN(num) && num > 1000000000000) return num; // já é timestamp ms
  if (!isNaN(num) && num > 1000000000) return num * 1000; // timestamp em segundos
  // ISO string
  const ts = new Date(String(dateStr)).getTime();
  return isNaN(ts) ? 0 : ts;
}

// Normaliza os dados do backend para o formato do frontend
function normalizeOrder(raw: any): KitchenOrder {
  return {
    id: String(raw.id),
    orderNumber: raw.dailyNumber ? String(raw.dailyNumber) : raw.orderNumber || raw.orderId || String(raw.id),
    establishmentId: raw.establishmentId,
    orderType: raw.orderType,
    customerName: raw.customerName || undefined,
    customerPhone: raw.customerPhone || undefined,
    tableNumber: raw.tableNumber || undefined,
    items: (raw.items || []).map((item: any): KitchenOrderItem => ({
      id: String(item.id),
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice) || 0,
      notes: item.notes || undefined,
      preparationTime: item.preparationTime || undefined,
    })),
    subtotal: parseFloat(raw.subtotal) || parseFloat(raw.total) || 0,
    discount: parseFloat(raw.discount) || 0,
    total: parseFloat(raw.total) || 0,
    status: raw.status,
    estimatedPrepTime: raw.estimatedPrepTime || 0,
    createdAt: String(toTimestamp(raw.createdAt)),
    updatedAt: raw.updatedAt ? String(toTimestamp(raw.updatedAt)) : undefined,
    confirmedAt: raw.confirmedAt ? String(toTimestamp(raw.confirmedAt)) : undefined,
    startedAt: raw.startedAt ? String(toTimestamp(raw.startedAt)) : undefined,
    readyAt: raw.readyAt ? String(toTimestamp(raw.readyAt)) : undefined,
    pickedUpAt: raw.pickedUpAt ? String(toTimestamp(raw.pickedUpAt)) : undefined,
    notes: raw.notes || undefined,
    priority: raw.priority || 'normal',
    history: raw.history || [],
  };
}

export const kitchenOrdersApi = {
  // Criar pedido interno
  create: async (establishmentId: string, dto: CreateKitchenOrderDto): Promise<KitchenOrder> => {
    const { data } = await apiClient.post(
      `/business/establishments/${establishmentId}/kitchen-orders`,
      dto
    );
    return normalizeOrder(data.data || data);
  },

  // Listar pedidos
  list: async (
    establishmentId: string,
    filters?: KitchenOrdersFilters
  ): Promise<{ data: KitchenOrder[]; total: number; page: number; limit: number }> => {
    const { data } = await apiClient.get(
      `/business/establishments/${establishmentId}/kitchen-orders`,
      { params: filters }
    );
    const normalized = (data.data || []).map(normalizeOrder);
    return {
      data: normalized,
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 50,
    };
  },

  // Filtrar por status
  listByStatus: async (
    establishmentId: string,
    status: string,
    filters?: KitchenOrdersFilters
  ): Promise<{ data: KitchenOrder[]; total: number; page: number; limit: number }> => {
    const { data } = await apiClient.get(
      `/business/establishments/${establishmentId}/kitchen-orders/status/${status}`,
      { params: filters }
    );
    const normalized = (data.data || []).map(normalizeOrder);
    return {
      data: normalized,
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 50,
    };
  },

  // Obter detalhes de um pedido
  getById: async (establishmentId: string, orderId: string): Promise<KitchenOrder> => {
    const { data } = await apiClient.get(
      `/business/establishments/${establishmentId}/kitchen-orders/${orderId}`
    );
    return normalizeOrder(data.data || data);
  },

  // Atualizar pedido
  update: async (
    establishmentId: string,
    orderId: string,
    dto: Partial<CreateKitchenOrderDto>
  ): Promise<KitchenOrder> => {
    const { data } = await apiClient.put(
      `/business/establishments/${establishmentId}/kitchen-orders/${orderId}`,
      dto
    );
    return normalizeOrder(data.data || data);
  },

  // Atualizar status
  updateStatus: async (
    establishmentId: string,
    orderId: string,
    status: string
  ): Promise<KitchenOrder> => {
    const { data } = await apiClient.put(
      `/business/establishments/${establishmentId}/kitchen-orders/${orderId}/status/${status}`
    );
    return normalizeOrder(data.data || data);
  },

  // Deletar pedido
  delete: async (
    establishmentId: string,
    orderId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/business/establishments/${establishmentId}/kitchen-orders/${orderId}`
    );
  },
};
