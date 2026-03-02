import apiClient from './client';
import { DeliveryOrder, DeliveryZone, CreateDeliveryOrderDto } from '../types/delivery';

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
    const response = await apiClient.get(
      `${this.getBasePath(establishmentId)}/orders`,
      { params: filters }
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
    description: string
  ): Promise<DeliveryOrder> {
    const response = await apiClient.patch(
      `${this.getBasePath(establishmentId)}/orders/${orderId}/status`,
      { status, description }
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

export const deliveryService = new DeliveryService();
// Alias para compatibilidade
export const deliveryApi = deliveryService;
