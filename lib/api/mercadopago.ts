import apiClient from './client';

export interface MercadoPagoIntegration {
  id: string;
  isActive: boolean;
  isVerified: boolean;
  merchantName?: string;
  merchantEmail?: string;
}

const authHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const mercadoPagoApi = {
  // Retorna null se não conectado (404)
  getIntegration: async (): Promise<MercadoPagoIntegration | null> => {
    try {
      const response = await apiClient.get('/api/business/establishments/mercadopago/integration');
      return response.data.data ?? response.data ?? null;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      return null;
    }
  },

  // Retorna a integração criada
  connectManual: async (accessToken: string, publicKey: string): Promise<MercadoPagoIntegration> => {
    const response = await apiClient.post('/api/business/establishments/mercadopago/connect', {
      accessToken,
      publicKey,
    });
    return response.data.data ?? response.data;
  },

  disconnect: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('[MP] disconnect token present:', token);
    }
    await apiClient.delete('/api/business/establishments/mercadopago/disconnect');
  },

  generatePix: async (payload: {
    saleId: string;
    totalAmount: number;
    customerEmail?: string;
    customerName?: string;
  }): Promise<{ paymentId: string; qrCode: string; qrCodeBase64: string; ticketUrl: string }> => {
    const response = await apiClient.post('/api/business/establishments/mercadopago/payments/pix', payload);
    return response.data.data ?? response.data;
  },

  generateCheckout: async (payload: {
    saleId: string;
    totalAmount: number;
    customerEmail?: string;
    customerName?: string;
  }): Promise<{ paymentId: string; checkoutUrl: string; sandboxUrl?: string }> => {
    const response = await apiClient.post('/api/business/establishments/mercadopago/payments/checkout', payload);
    return response.data.data ?? response.data;
  },

  getPaymentStatus: async (paymentId: string): Promise<{ status: 'pending' | 'approved' | 'rejected' | 'cancelled' }> => {
    const response = await apiClient.get(`/api/business/establishments/mercadopago/payments/status/${paymentId}`);
    return response.data.data ?? response.data;
  },
};
