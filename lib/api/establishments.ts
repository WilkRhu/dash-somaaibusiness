import apiClient from './client';
import { Establishment, CreateEstablishmentDto, LoyaltySettings, UpdateLoyaltySettingsDto, EstablishmentSettings, UpdateEstablishmentSettingsDto } from '@/lib/types/establishment';

export const establishmentsApi = {
  list: async (): Promise<Establishment[]> => {
    const response = await apiClient.get('/business/establishments');
    return response.data.data;
  },

  getById: async (id: string): Promise<Establishment> => {
    const response = await apiClient.get(`/business/establishments/${id}`);
    return response.data.data;
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

  uploadLogo: async (establishmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);

    const { data } = await apiClient.post(
      `/business/establishments/${establishmentId}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
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

  getLoyaltySettings: async (establishmentId: string) => {
    const response = await apiClient.get<{ success: boolean; data: LoyaltySettings }>(
      `/business/establishments/${establishmentId}/loyalty-settings`
    );
    return response.data.data;
  },

  updateLoyaltySettings: async (establishmentId: string, dto: UpdateLoyaltySettingsDto) => {
    const response = await apiClient.patch<{ success: boolean; data: Establishment; message: string }>(
      `/business/establishments/${establishmentId}/loyalty-settings`,
      dto
    );
    return response.data;
  },

  open: async (establishmentId: string): Promise<Establishment> => {
    const response = await apiClient.post(`/business/establishments/${establishmentId}/open`);
    return response.data.data || response.data;
  },

  close: async (establishmentId: string): Promise<Establishment> => {
    const response = await apiClient.post(`/business/establishments/${establishmentId}/close`);
    return response.data.data || response.data;
  },

  getSettings: async (establishmentId: string): Promise<EstablishmentSettings> => {
    const response = await apiClient.get(`/business/establishments/${establishmentId}/settings`);
    return response.data.data || response.data;
  },

  updateSettings: async (establishmentId: string, dto: UpdateEstablishmentSettingsDto): Promise<EstablishmentSettings> => {
    const response = await apiClient.patch(`/business/establishments/${establishmentId}/settings`, dto);
    return response.data.data || response.data;
  },
};
