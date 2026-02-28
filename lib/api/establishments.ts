import apiClient from './client';
import { Establishment, CreateEstablishmentDto } from '@/lib/types/establishment';

export const establishmentsApi = {
  list: async () => {
    const { data } = await apiClient.get<Establishment[]>('/business/establishments');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<Establishment>(`/business/establishments/${id}`);
    return data;
  },

  create: async (dto: CreateEstablishmentDto) => {
    const { data } = await apiClient.post<Establishment>('/business/establishments', dto);
    return data;
  },

  update: async (id: string, dto: Partial<CreateEstablishmentDto>) => {
    const { data } = await apiClient.patch<Establishment>(`/business/establishments/${id}`, dto);
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/business/establishments/${id}`);
  },

  addMember: async (establishmentId: string, userId: string, role: string) => {
    const { data } = await apiClient.post(`/business/establishments/${establishmentId}/members`, {
      userId,
      role,
    });
    return data;
  },

  removeMember: async (establishmentId: string, userId: string) => {
    await apiClient.delete(`/business/establishments/${establishmentId}/members/${userId}`);
  },

  updateMemberRole: async (establishmentId: string, userId: string, role: string) => {
    const { data } = await apiClient.patch(
      `/business/establishments/${establishmentId}/members/${userId}/role`,
      { role }
    );
    return data;
  },
};
