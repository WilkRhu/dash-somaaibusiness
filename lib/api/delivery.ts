import apiClient from './client';
import { DeliveryOrder, DeliveryZone, CreateDeliveryOrderDto } from '../types/delivery';

// Re-export types for convenience
export type { DeliveryOrder, DeliveryZone, CreateDeliveryOrderDto };

class DeliveryService {
  private getBasePath(establishmentId: string) {
    return `/business/establishments/${establishmentId}/delivery`;
  }

  // ========== PEDIDOS ==========

  async createOrder(
    establishmentId: string,
    data: CreateDeliveryOrderDto
  ): Promise<DeliveryOrder> {
    const response = await apiClient.post(
      `${this.getBasePath(establishmentId)}/orders`,
      data
    );
    return response.data.data;
  }

  async listOrders(
    establishmentId: string,
    filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: DeliveryOrder[]; total: number; page: number; limit: number }> {
    const params = {
      page: 1,
      limit: 50,
      ...filters,
    };

    const response = await apiClient.get(
      `${this.getBasePath(establishmentId)}/orders`,
      { params }
    );
    return response.data;
  }

  async getOrder(
    establishmentId: string,
    orderId: string
  ): Promise<DeliveryOrder> {
    const response = await apiClient.get(
      `${this.getBasePath(establishmentId)}/orders/${orderId}`
    );
    return response.data.data;
  }

  async updateStatus(
    establishmentId: string,
    orderId: string,
    status: string,
    description: string,
    driverId?: string
  ): Promise<DeliveryOrder> {
    const response = await apiClient.patch(
      `${this.getBasePath(establishmentId)}/orders/${orderId}/status`,
      { status, description, ...(driverId ? { driverId } : {}) }
    );
    return response.data.data;
  }

  async assignDriver(
    establishmentId: string,
    orderId: string,
    driverId: string
  ): Promise<DeliveryOrder> {
    const response = await apiClient.post(
      `${this.getBasePath(establishmentId)}/orders/${orderId}/assign-driver`,
      { driverId }
    );
    return response.data.data;
  }

  // ========== FOTOS DO VEÍCULO ==========

  async updateVehiclePhoto(
    establishmentId: string,
    driverId: string,
    photoType: 'front' | 'back' | 'side',
    photoBase64: string
  ): Promise<unknown> {
    const response = await apiClient.patch(
      `/business/establishments/${establishmentId}/delivery/drivers/${driverId}/vehicle-photos/${photoType}`,
      { photo: photoBase64, photoType }
    );
    return response.data.data;
  }

  // ========== ZONAS ==========

  async createZone(
    establishmentId: string,
    data: Partial<DeliveryZone>
  ): Promise<DeliveryZone> {
    const response = await apiClient.post(
      `${this.getBasePath(establishmentId)}/zones`,
      data
    );
    return response.data.data;
  }

  async listZones(establishmentId: string): Promise<DeliveryZone[]> {
    const response = await apiClient.get(
      `${this.getBasePath(establishmentId)}/zones`
    );
    return response.data.data;
  }

  async updateZone(
    establishmentId: string,
    zoneId: string,
    data: Partial<DeliveryZone>
  ): Promise<DeliveryZone> {
    const response = await apiClient.put(
      `${this.getBasePath(establishmentId)}/zones/${zoneId}`,
      data
    );
    return response.data.data;
  }

  async deleteZone(
    establishmentId: string,
    zoneId: string
  ): Promise<void> {
    await apiClient.delete(
      `${this.getBasePath(establishmentId)}/zones/${zoneId}`
    );
  }

  // ========== CÁLCULO ==========

  async calculateFee(
    establishmentId: string,
    data: {
      neighborhood: string;
      zipCode?: string;
      latitude?: number;
      longitude?: number;
      subtotal: number;
    }
  ): Promise<{
    deliveryFee: number;
    isFreeDelivery: boolean;
    freeDeliveryMinimum: number | null;
    estimatedTime: number;
    zone: DeliveryZone | null;
  }> {
    const response = await apiClient.post(
      `${this.getBasePath(establishmentId)}/calculate-fee`,
      data
    );
    return response.data.data;
  }
}

class PublicDeliveryService {
  // ========== PEDIDOS PÚBLICOS ==========

  async createPublicOrder(
    establishmentId: string,
    data: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      deliveryAddress: string;
      deliveryNeighborhood: string;
      deliveryCity: string;
      deliveryState: string;
      deliveryZipCode: string;
      deliveryComplement?: string;
      deliveryReference?: string;
      latitude?: number;
      longitude?: number;
      items: Array<{
        productName: string;
        unitPrice: number;
        quantity: number;
      }>;
      paymentMethod: string;
      notes?: string;
    }
  ): Promise<DeliveryOrder> {
    const response = await apiClient.post(
      `/public/delivery/establishments/${establishmentId}/orders`,
      data
    );
    return response.data.data;
  }

  async getPublicOrder(orderId: string): Promise<DeliveryOrder> {
    const response = await apiClient.get(`/public/delivery/orders/${orderId}`);
    return response.data.data;
  }

  async getPublicOrderTracking(orderId: string): Promise<{
    order: DeliveryOrder;
    tracking: Array<{
      id: string;
      status: string;
      description: string;
      latitude?: number;
      longitude?: number;
      createdAt: string;
    }>;
  }> {
    const response = await apiClient.get(`/public/delivery/orders/${orderId}/tracking`);
    return response.data.data;
  }

  async calculatePublicFee(
    establishmentId: string,
    data: {
      neighborhood: string;
      zipCode?: string;
      latitude?: number;
      longitude?: number;
      subtotal: number;
    }
  ): Promise<{
    deliveryFee: number;
    isFreeDelivery: boolean;
    freeDeliveryMinimum: number | null;
    estimatedTime: number;
    zone: DeliveryZone | null;
  }> {
    const response = await apiClient.post(
      `/public/delivery/establishments/${establishmentId}/calculate-fee`,
      data
    );
    return response.data.data;
  }

  async checkAvailability(
    establishmentId: string,
    data: {
      neighborhood: string;
      zipCode?: string;
    }
  ): Promise<{
    available: boolean;
    zone?: DeliveryZone;
    message?: string;
  }> {
    const response = await apiClient.post(
      `/public/delivery/establishments/${establishmentId}/check-availability`,
      data
    );
    return response.data.data;
  }
}

export const deliveryService = new DeliveryService();
export const publicDeliveryService = new PublicDeliveryService();
// Alias para compatibilidade
export const deliveryApi = deliveryService;
export const publicDeliveryApi = publicDeliveryService;
