import apiClient from './client';

export interface CreatePreferenceRequest {
  planId: string;
  direction: 'app' | 'web';
}

export interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  publicKey: string;
  direction: string;
}

export const mercadoPagoApi = {
  // Criar preferência de pagamento (PIX/Cartão/Boleto)
  createPreference: async (userId: string, data: CreatePreferenceRequest): Promise<CreatePreferenceResponse> => {
    const response = await apiClient.post<{ success: boolean; data: CreatePreferenceResponse }>(
      `/subscriptions/create/${userId}`,
      data
    );
    return response.data.data;
  },
};
