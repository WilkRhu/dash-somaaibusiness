import { InventoryItem, AddProductDto, StockMovement, InventoryFilters, UpdateStockDto } from '@/lib/types/inventory';
import { getApiBaseUrl } from '@/lib/config/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const inventoryApi = {
  list: async (establishmentId: string, filters?: InventoryFilters) => {
    const apiBaseUrl = getApiBaseUrl();
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory?${params.toString()}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem[]>>;
  },

  getById: async (establishmentId: string, id: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${id}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem>>;
  },

  add: async (establishmentId: string, dto: AddProductDto) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory`,
      { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(dto) }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem>>;
  },

  update: async (establishmentId: string, id: string, dto: Partial<AddProductDto>) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${id}`,
      { method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify(dto) }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem>>;
  },

  delete: async (establishmentId: string, id: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${id}`,
      { method: 'DELETE', headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<void>>;
  },

  updateStock: async (establishmentId: string, id: string, dto: UpdateStockDto) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${id}/stock`,
      { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(dto) }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem>>;
  },

  getLowStock: async (establishmentId: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/alerts?type=low-stock`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem[]>>;
  },

  getExpiring: async (establishmentId: string, daysAhead: number = 30) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/alerts?type=expiring&daysAhead=${daysAhead}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem[]>>;
  },

  getHistory: async (establishmentId: string, id: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${id}/history`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<StockMovement[]>>;
  },

  uploadImages: async (establishmentId: string, itemId: string, images: File[]) => {
    const apiBaseUrl = getApiBaseUrl();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${itemId}/images`,
      {
        method: 'POST',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData,
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<InventoryItem>>;
  },

  deleteImage: async (establishmentId: string, itemId: string, imageUrl: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/business/establishments/${establishmentId}/inventory/${itemId}/images`,
      { method: 'DELETE', headers: getAuthHeaders(), body: JSON.stringify({ imageUrl }) }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<ApiResponse<void>>;
  },
};
