import apiClient from './client';
import { LoyaltySettings, UpdateLoyaltySettingsDto } from '@/lib/types/establishment';

export interface SuperAdminEstablishment {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  logo: string;
  description: string;
  cashRegistersCount: number;
  loyaltyEnabled: boolean;
  loyaltyPointsPerReal: number;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminEstablishmentUpdateDto {
  name?: string;
  cnpj?: string;
  type?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  cashRegistersCount?: number;
  isActive?: boolean;
}

export interface SuperAdminEstablishmentMemberDto {
  userId: string;
  role: string;
}

export interface SuperAdminEmployeeDto {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  roles: string[];
}

export interface SuperAdminFiscalConfigDto {
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  regimeTributario?: string;
  cnae?: string;
  crt?: string;
  autoIssueFiscalNote?: boolean;
  fiscalProvider?: string;
  fiscalEnvironment?: string;
}

export interface SuperAdminMercadoPagoConnectDto {
  accessToken: string;
  publicKey: string;
}

export interface SuperAdminMercadoPagoPaymentPreferenceDto {
  title?: string;
  description?: string;
  amount: number;
  paymentId?: string;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const superAdminEstablishmentsApi = {
  list: async (): Promise<SuperAdminEstablishment[]> => {
    const response = await apiClient.get<ApiResponse<SuperAdminEstablishment[]>>('/admin/establishments');
    return response.data.data;
  },

  getById: async (id: string): Promise<SuperAdminEstablishment> => {
    const response = await apiClient.get<ApiResponse<SuperAdminEstablishment>>(`/admin/establishments/${id}`);
    return response.data.data;
  },

  update: async (id: string, dto: SuperAdminEstablishmentUpdateDto): Promise<SuperAdminEstablishment> => {
    const response = await apiClient.patch<ApiResponse<SuperAdminEstablishment>>(`/admin/establishments/${id}`, dto);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/establishments/${id}`);
  },

  getMembers: async (id: string) => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/admin/establishments/${id}/members`);
    return response.data.data;
  },

  addMember: async (id: string, dto: SuperAdminEstablishmentMemberDto) => {
    const response = await apiClient.post<ApiResponse<unknown>>(`/admin/establishments/${id}/members`, dto);
    return response.data;
  },

  addEmployee: async (id: string, dto: SuperAdminEmployeeDto) => {
    const response = await apiClient.post<ApiResponse<unknown>>(`/admin/establishments/${id}/employees`, dto);
    return response.data;
  },

  removeMember: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/admin/establishments/${id}/members/${userId}`);
  },

  updateMemberRole: async (id: string, userId: string, role: string) => {
    const response = await apiClient.patch<ApiResponse<unknown>>(
      `/admin/establishments/${id}/members/${userId}/role`,
      { role }
    );
    return response.data;
  },

  updateMember: async (id: string, userId: string, dto: Record<string, unknown>) => {
    const response = await apiClient.patch<ApiResponse<unknown>>(
      `/admin/establishments/${id}/members/${userId}`,
      dto
    );
    return response.data;
  },

  uploadLogo: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post<ApiResponse<SuperAdminEstablishment>>(
      `/admin/establishments/${id}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  getLoyaltySettings: async (id: string): Promise<LoyaltySettings> => {
    const response = await apiClient.get<ApiResponse<LoyaltySettings>>(
      `/admin/establishments/${id}/loyalty-settings`
    );
    return response.data.data;
  },

  updateLoyaltySettings: async (id: string, dto: UpdateLoyaltySettingsDto) => {
    const response = await apiClient.patch<ApiResponse<SuperAdminEstablishment>>(
      `/admin/establishments/${id}/loyalty-settings`,
      dto
    );
    return response.data;
  },

  getFiscalConfig: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/fiscal-config`
    );
    return response.data.data;
  },

  updateFiscalConfig: async (id: string, dto: SuperAdminFiscalConfigDto) => {
    const response = await apiClient.patch<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/fiscal-config`,
      dto
    );
    return response.data;
  },

  updateFiscalSettings: async (id: string, dto: Record<string, unknown>) => {
    const response = await apiClient.patch<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/fiscal-settings`,
      dto
    );
    return response.data;
  },

  connectMercadoPago: async (id: string, dto: SuperAdminMercadoPagoConnectDto) => {
    const response = await apiClient.post<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/mercadopago/connect`,
      dto
    );
    return response.data;
  },

  getMercadoPagoIntegration: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/mercadopago/integration`
    );
    return response.data.data;
  },

  disconnectMercadoPago: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/establishments/${id}/mercadopago/disconnect`);
  },

  createMercadoPagoPaymentPreference: async (id: string, dto: SuperAdminMercadoPagoPaymentPreferenceDto) => {
    const response = await apiClient.post<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/mercadopago/payment-preference`,
      dto
    );
    return response.data;
  },

  getMercadoPagoPayment: async (id: string, paymentId: string) => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(
      `/admin/establishments/${id}/mercadopago/payment/${paymentId}`
    );
    return response.data.data;
  },
};
