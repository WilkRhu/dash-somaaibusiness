import apiClient from './client';
import { InventoryItem, AddProductDto, StockMovement } from '@/lib/types/inventory';

export const inventoryApi = {
  list: async (establishmentId: string, filters?: any) => {
    const { data } = await apiClient.get<InventoryItem[]>('/business/inventory', {
      params: { establishmentId, ...filters },
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<InventoryItem>(`/business/inventory/${id}`);
    return data;
  },

  add: async (dto: AddProductDto) => {
    const { data } = await apiClient.post<InventoryItem>('/business/inventory', dto);
    return data;
  },

  update: async (id: string, dto: Partial<AddProductDto>) => {
    const { data } = await apiClient.patch<InventoryItem>(`/business/inventory/${id}`, dto);
    return data;
  },

  updateStock: async (id: string, quantity: number, type: string, reason?: string) => {
    const { data } = await apiClient.post(`/business/inventory/${id}/stock`, {
      quantity,
      type,
      reason,
    });
    return data;
  },

  getLowStock: async (establishmentId: string) => {
    const { data } = await apiClient.get<InventoryItem[]>('/business/inventory/alerts/low-stock', {
      params: { establishmentId },
    });
    return data;
  },

  getExpiring: async (establishmentId: string, days: number = 7) => {
    const { data } = await apiClient.get<InventoryItem[]>('/business/inventory/alerts/expiring', {
      params: { establishmentId, days },
    });
    return data;
  },

  getHistory: async (id: string) => {
    const { data } = await apiClient.get<StockMovement[]>(`/business/inventory/${id}/history`);
    return data;
  },
};
