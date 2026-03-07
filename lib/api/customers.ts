import apiClient from './client';
import type {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerPurchase,
  CustomerLoyalty,
  CustomersListResponse,
} from '../types/customer';

export const customersApi = {
  // Listar clientes
  async list(
    establishmentId: string,
    params?: { search?: string; page?: number; limit?: number }
  ): Promise<Customer[]> {
    const response = await apiClient.get<CustomersListResponse | Customer[]>(
      `/business/establishments/${establishmentId}/customers`,
      { params }
    );
    
    // Suporta resposta com ou sem paginação
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.data || [];
  },

  // Buscar cliente por ID
  async getById(establishmentId: string, customerId: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(
      `/business/establishments/${establishmentId}/customers/${customerId}`
    );
    return response.data;
  },

  // Criar cliente
  async create(establishmentId: string, data: CreateCustomerDto): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `/business/establishments/${establishmentId}/customers`,
      data
    );
    return response.data;
  },

  // Atualizar cliente
  async update(
    establishmentId: string,
    customerId: string,
    data: UpdateCustomerDto
  ): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `/business/establishments/${establishmentId}/customers/${customerId}`,
      data
    );
    return response.data;
  },

  // Deletar cliente
  async delete(establishmentId: string, customerId: string): Promise<void> {
    await apiClient.delete(
      `/business/establishments/${establishmentId}/customers/${customerId}`
    );
  },

  // Histórico de compras
  async getPurchases(
    establishmentId: string,
    customerId: string
  ): Promise<CustomerPurchase[]> {
    const response = await apiClient.get<CustomerPurchase[]>(
      `/business/establishments/${establishmentId}/customers/${customerId}/purchases`
    );
    return response.data;
  },

  // Consultar pontos de fidelidade
  async getLoyalty(
    establishmentId: string,
    customerId: string
  ): Promise<CustomerLoyalty> {
    const response = await apiClient.get<CustomerLoyalty>(
      `/business/establishments/${establishmentId}/customers/${customerId}/loyalty`
    );
    return response.data;
  },

  // Adicionar pontos
  async addLoyaltyPoints(
    establishmentId: string,
    customerId: string,
    points: number
  ): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `/business/establishments/${establishmentId}/customers/${customerId}/loyalty/add`,
      { points }
    );
    return response.data;
  },

  // Resgatar pontos
  async redeemLoyaltyPoints(
    establishmentId: string,
    customerId: string,
    points: number
  ): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `/business/establishments/${establishmentId}/customers/${customerId}/loyalty/redeem`,
      { points }
    );
    return response.data;
  },
};
