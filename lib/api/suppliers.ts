import apiClient from './client';
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierWithOrders,
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderStatusDto,
} from '../types/supplier';

export const suppliersApi = {
  // Listar fornecedores
  async list(establishmentId: string): Promise<Supplier[]> {
    const response = await apiClient.get<{ success: boolean; data: Supplier[] } | Supplier[]>(
      `/business/establishments/${establishmentId}/suppliers`
    );
    
    // Suporta resposta com ou sem wrapper
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data || [];
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  // Buscar fornecedor por ID
  async getById(establishmentId: string, supplierId: string): Promise<SupplierWithOrders> {
    const response = await apiClient.get<SupplierWithOrders>(
      `/business/establishments/${establishmentId}/suppliers/${supplierId}`
    );
    return response.data;
  },

  // Criar fornecedor
  async create(establishmentId: string, data: CreateSupplierDto): Promise<Supplier> {
    const response = await apiClient.post<Supplier>(
      `/business/establishments/${establishmentId}/suppliers`,
      data
    );
    return response.data;
  },

  // Atualizar fornecedor
  async update(
    establishmentId: string,
    supplierId: string,
    data: UpdateSupplierDto
  ): Promise<Supplier> {
    const response = await apiClient.patch<Supplier>(
      `/business/establishments/${establishmentId}/suppliers/${supplierId}`,
      data
    );
    return response.data;
  },

  // Deletar fornecedor
  async delete(establishmentId: string, supplierId: string): Promise<void> {
    await apiClient.delete(
      `/business/establishments/${establishmentId}/suppliers/${supplierId}`
    );
  },

  // Criar pedido de compra
  async createOrder(
    establishmentId: string,
    supplierId: string,
    data: CreatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    const response = await apiClient.post<PurchaseOrder>(
      `/business/establishments/${establishmentId}/suppliers/${supplierId}/orders`,
      data
    );
    return response.data;
  },

  // Listar pedidos de um fornecedor
  async getSupplierOrders(
    establishmentId: string,
    supplierId: string
  ): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<PurchaseOrder[]>(
      `/business/establishments/${establishmentId}/suppliers/${supplierId}/orders`
    );
    return response.data;
  },

  // Listar todos os pedidos de compra
  async listOrders(
    establishmentId: string,
    supplierId?: string
  ): Promise<PurchaseOrder[]> {
    const params = supplierId ? { supplierId } : undefined;
    const response = await apiClient.get<PurchaseOrder[]>(
      `/business/establishments/${establishmentId}/purchase-orders`,
      { params }
    );
    return response.data;
  },

  // Buscar pedido por ID
  async getOrderById(
    establishmentId: string,
    orderId: string
  ): Promise<PurchaseOrder> {
    const response = await apiClient.get<PurchaseOrder>(
      `/business/establishments/${establishmentId}/purchase-orders/${orderId}`
    );
    return response.data;
  },

  // Atualizar status do pedido
  async updateOrderStatus(
    establishmentId: string,
    orderId: string,
    data: UpdatePurchaseOrderStatusDto
  ): Promise<PurchaseOrder> {
    const response = await apiClient.patch<PurchaseOrder>(
      `/business/establishments/${establishmentId}/purchase-orders/${orderId}/status`,
      data
    );
    return response.data;
  },
};
