import apiClient from './client';
import { InventoryItem, AddProductDto, StockMovement, InventoryFilters, UpdateStockDto, UpdateProductDto } from '@/lib/types/inventory';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const inventoryApi = {
  list: async (establishmentId: string, filters?: InventoryFilters) => {
    const response = await apiClient.get<ApiResponse<InventoryItem[]>>(
      `/business/establishments/${establishmentId}/inventory`,
      { params: filters }
    );
    return response.data;
  },

  getById: async (establishmentId: string, id: string) => {
    const response = await apiClient.get<ApiResponse<InventoryItem>>(
      `/business/establishments/${establishmentId}/inventory/${id}`
    );
    return response.data;
  },

  add: async (establishmentId: string, dto: AddProductDto) => {
    const response = await apiClient.post<ApiResponse<InventoryItem>>(
      `/business/establishments/${establishmentId}/inventory`,
      dto
    );
    return response.data;
  },

  update: async (establishmentId: string, id: string, dto: UpdateProductDto) => {
    const response = await apiClient.patch<ApiResponse<InventoryItem>>(
      `/business/establishments/${establishmentId}/inventory/${id}`,
      dto
    );
    return response.data;
  },

  delete: async (establishmentId: string, id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/business/establishments/${establishmentId}/inventory/${id}`
    );
    return response.data;
  },

  updateStock: async (establishmentId: string, id: string, dto: UpdateStockDto) => {
    const response = await apiClient.post<ApiResponse<InventoryItem>>(
      `/business/establishments/${establishmentId}/inventory/${id}/stock`,
      dto
    );
    return response.data;
  },

  getLowStock: async (establishmentId: string) => {
    const response = await apiClient.get<ApiResponse<InventoryItem[]>>(
      `/business/establishments/${establishmentId}/inventory/alerts/low-stock`
    );
    return response.data;
  },

  getExpiring: async (establishmentId: string, daysAhead: number = 30) => {
    const response = await apiClient.get<ApiResponse<InventoryItem[]>>(
      `/business/establishments/${establishmentId}/inventory/alerts/expiring`,
      { params: { daysAhead } }
    );
    return response.data;
  },

  getHistory: async (establishmentId: string, id: string) => {
    const response = await apiClient.get<ApiResponse<StockMovement[]>>(
      `/business/establishments/${establishmentId}/inventory/${id}/history`
    );
    return response.data;
  },

  uploadImages: async (establishmentId: string, itemId: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await apiClient.post<ApiResponse<InventoryItem>>(
      `/business/establishments/${establishmentId}/inventory/${itemId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteImage: async (establishmentId: string, itemId: string, imageUrl: string) => {
    console.log('🗑️ Deletando imagem:', {
      establishmentId,
      itemId,
      imageUrl,
      url: `/business/establishments/${establishmentId}/inventory/${itemId}/images`
    });
    
    const response = await apiClient.delete<ApiResponse<void>>(
      `/business/establishments/${establishmentId}/inventory/${itemId}/images`,
      {
        data: { imageUrl },
      }
    );
    return response.data;
  },
};
