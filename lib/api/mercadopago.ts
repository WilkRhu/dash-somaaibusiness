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
    const response = await fetch('/api/business/establishments/mercadopago/integration', {
      headers: authHeaders(),
    });
    console.log('[MP] getIntegration status:', response.status);
    if (response.status === 404) return null;
    if (!response.ok) {
      console.log('[MP] getIntegration not ok, returning null');
      return null;
    }
    const raw = await response.json();
    console.log('[MP] getIntegration raw response:', JSON.stringify(raw));
    const integration = raw.data ?? raw;
    console.log('[MP] getIntegration parsed:', JSON.stringify(integration));
    return integration;
  },

  // Retorna a integração criada
  connectManual: async (accessToken: string, publicKey: string): Promise<MercadoPagoIntegration> => {
    const response = await fetch('/api/business/establishments/mercadopago/connect', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ accessToken, publicKey }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Credenciais inválidas');
    }
    return data.data ?? data;
  },

  disconnect: async (): Promise<void> => {
    const response = await fetch('/api/business/establishments/mercadopago/disconnect', {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao desconectar');
  },

  generatePix: async (payload: {
    saleId: string;
    totalAmount: number;
    customerEmail?: string;
    customerName?: string;
  }): Promise<{ paymentId: string; qrCode: string; qrCodeBase64: string; ticketUrl: string }> => {
    const response = await fetch('/api/business/establishments/mercadopago/payments/pix', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao gerar PIX');
    return data.data ?? data;
  },

  generateCheckout: async (payload: {
    saleId: string;
    totalAmount: number;
    customerEmail?: string;
    customerName?: string;
  }): Promise<{ paymentId: string; checkoutUrl: string; sandboxUrl?: string }> => {
    const response = await fetch('/api/business/establishments/mercadopago/payments/checkout', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao gerar checkout');
    return data.data ?? data;
  },

  getPaymentStatus: async (paymentId: string): Promise<{ status: 'pending' | 'approved' | 'rejected' | 'cancelled' }> => {
    const response = await fetch(`/api/business/establishments/mercadopago/payments/status/${paymentId}`, {
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Erro ao consultar status');
    return data.data ?? data;
  },
};
