import { api } from './axios';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/lib/types/customer';

export const customerApi = {
  list: async (establishmentId: string): Promise<Customer[]> => {
    const { data } = await api.get(
      `/business/establishments/${establishmentId}/customers`
    );
    return data;
  },

  getById: async (establishmentId: string, id: string): Promise<Customer> => {
    const { data } = await api.get(
      `/business/establishments/${establishmentId}/customers/${id}`
    );
    return data;
  },

  create: async (establishmentId: string, dto: CreateCustomerDto): Promise<Customer> => {
    const { data } = await api.post(
      `/business/establishments/${establishmentId}/customers`,
      dto
    );
    return data;
  },

  update: async (establishmentId: string, id: string, dto: UpdateCustomerDto): Promise<Customer> => {
    const { data } = await api.patch(
      `/business/establishments/${establishmentId}/customers/${id}`,
      dto
    );
    return data;
  },

  delete: async (establishmentId: string, id: string): Promise<void> => {
    await api.delete(
      `/business/establishments/${establishmentId}/customers/${id}`
    );
  },

  addLoyaltyPoints: async (establishmentId: string, id: string, points: number): Promise<Customer> => {
    const { data } = await api.post(
      `/business/establishments/${establishmentId}/customers/${id}/loyalty/add`,
      { points }
    );
    return data;
  },
};
