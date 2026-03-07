import apiClient from './client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
}

export const profileApi = {
  get: async (): Promise<UserProfile> => {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/auth/me');
    return response.data.data;
  },

  update: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const response = await apiClient.patch<{ success: boolean; data: UserProfile }>(
      '/auth/profile',
      dto
    );
    return response.data.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ success: boolean; data: { avatar: string } }>(
      '/auth/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
