import apiClient from '@/lib/api/client';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
  gradientColors: string[];
  actionUrl: string;
  actionLabel: string;
  startDate: string;
  endDate: string;
  priority: number;
  platform: 'mobile' | 'web' | 'all';
  isActive: boolean;
  impressions: number;
  clicks: number;
  ctr: number;
  minAge?: number;
  maxAge?: number;
  targetGenders?: ('woman_cisgender' | 'man_cisgender' | 'woman_trans' | 'man_trans' | 'non_binary' | 'agender' | 'gender_fluid' | 'other' | 'prefer_not_to_say')[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvertisementDto {
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
  gradientColors: string[];
  actionUrl: string;
  actionLabel: string;
  startDate: string;
  endDate: string;
  priority: number;
  platform: 'mobile' | 'web' | 'all';
  isActive: boolean;
  minAge?: number;
  maxAge?: number;
  targetGenders?: ('woman_cisgender' | 'man_cisgender' | 'woman_trans' | 'man_trans' | 'non_binary' | 'agender' | 'gender_fluid' | 'other' | 'prefer_not_to_say')[];
}

export interface UpdateAdvertisementDto extends Partial<CreateAdvertisementDto> {}

export interface AdvertisementsResponse {
  success: boolean;
  data: Advertisement[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const advertisementsApi = {
  // Listar todas as publicidades (admin)
  list: async (limit: number = 10, offset: number = 0): Promise<Advertisement[]> => {
    try {
      const response = await apiClient.get<AdvertisementsResponse>(
        '/api/v1/advertisements/admin/list',
        {
          params: { limit, offset },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao listar publicidades:', error);
      throw error;
    }
  },

  // Obter uma publicidade por ID
  getById: async (id: string): Promise<Advertisement> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Advertisement }>(
        `/api/v1/advertisements/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter publicidade:', error);
      throw error;
    }
  },

  // Criar nova publicidade
  create: async (dto: CreateAdvertisementDto): Promise<Advertisement> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: Advertisement }>(
        '/api/v1/advertisements',
        dto
      );
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar publicidade:', error);
      throw error;
    }
  },

  // Atualizar publicidade
  update: async (id: string, dto: UpdateAdvertisementDto): Promise<Advertisement> => {
    try {
      const response = await apiClient.put<{ success: boolean; data: Advertisement }>(
        `/api/v1/advertisements/${id}`,
        dto
      );
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar publicidade:', error);
      throw error;
    }
  },

  // Deletar publicidade
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/v1/advertisements/${id}`);
    } catch (error) {
      console.error('Erro ao deletar publicidade:', error);
      throw error;
    }
  },
};
