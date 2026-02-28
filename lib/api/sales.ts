import apiClient from './client';
import { Sale, CreateSaleDto } from '@/lib/types/sale';

export const salesApi = {
  list: async (establishmentId: string, filters?: any) => {
    const { data } = await apiClient.get<Sale[]>('/business/sales', {
      params: { establishmentId, ...filters },
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<Sale>(`/business/sales/${id}`);
    return data;
  },

  create: async (dto: CreateSaleDto) => {
    const { data } = await apiClient.post<Sale>('/business/sales', dto);
    return data;
  },

  cancel: async (id: string) => {
    const { data } = await apiClient.post(`/business/sales/${id}/cancel`);
    return data;
  },

  getStats: async (establishmentId: string, startDate: string, endDate: string) => {
    const { data } = await apiClient.get('/business/sales/stats', {
      params: { establishmentId, startDate, endDate },
    });
    return data;
  },

  getDailySummary: async (establishmentId: string, date: string) => {
    const { data } = await apiClient.get('/business/sales/daily-summary', {
      params: { establishmentId, date },
    });
    return data;
  },

  getTopProducts: async (establishmentId: string, limit: number = 10) => {
    const { data } = await apiClient.get('/business/sales/top-products', {
      params: { establishmentId, limit },
    });
    return data;
  },
};
