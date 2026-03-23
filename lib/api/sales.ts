import apiClient from './client';
import { Sale, CreateSaleDto, SalesFilters, SalesListResponse } from '@/lib/types/sale';

export const salesApi = {
  list: async (establishmentId: string, filters?: SalesFilters): Promise<SalesListResponse> => {
    const { data } = await apiClient.get<SalesListResponse>(
      `/business/establishments/${establishmentId}/sales`,
      { params: filters }
    );
    return data;
  },

  getById: async (establishmentId: string, id: string): Promise<Sale> => {
    const { data } = await apiClient.get<Sale>(
      `/business/establishments/${establishmentId}/sales/${id}`
    );
    return data;
  },

  create: async (establishmentId: string, dto: CreateSaleDto): Promise<Sale> => {
    const { data } = await apiClient.post<Sale>(
      `/business/establishments/${establishmentId}/sales`,
      dto
    );
    return data;
  },

  cancel: async (establishmentId: string, id: string, reason: string): Promise<Sale> => {
    const { data } = await apiClient.post<Sale>(
      `/business/establishments/${establishmentId}/sales/${id}/cancel`,
      { reason }
    );
    return data;
  },

  confirmPayment: async (establishmentId: string, id: string): Promise<Sale> => {
    const { data } = await apiClient.post<Sale>(
      `/business/establishments/${establishmentId}/sales/${id}/confirm-payment`
    );
    return data;
  },

  linkMercadoPagoPayment: async (establishmentId: string, saleId: string, mercadoPagoPaymentId: string): Promise<Sale> => {
    const { data } = await apiClient.post<Sale>(
      `/business/establishments/${establishmentId}/sales/${saleId}/link-payment`,
      { mercadoPagoPaymentId }
    );
    return data;
  },
};
