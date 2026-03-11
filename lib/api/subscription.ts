import { getAuthToken } from '@/lib/auth/get-token';

export interface PlanInfo {
  id: string;
  name: string;
  price: number | null;
  interval: string;
  description: string;
  recommended?: boolean;
  contactSales?: boolean;
  features: string[];
  limits: {
    establishments: number;
    employees: number;
    products: number;
  };
}

export interface SubscriptionStatus {
  currentPlan: string;
  isOnTrial: boolean;
  trialDaysRemaining: number;
  usage: {
    establishments: number;
    employees: number;
    products: number;
  };
  limits: {
    establishments: number;
    employees: number;
    products: number;
  };
}

const API_BASE = '/api/business/subscription';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Se a resposta tem formato { success, data }, retorna apenas data
  if (data.success && data.data) {
    return data.data;
  }
  
  return data;
}

export const subscriptionApi = {
  async getPlans(): Promise<PlanInfo[]> {
    return fetchWithAuth(`${API_BASE}/plans`);
  },

  async getStatus(): Promise<SubscriptionStatus> {
    return fetchWithAuth(`${API_BASE}/status`);
  },

  async createPayment(planId: string) {
    return fetchWithAuth(`${API_BASE}/create-payment`, {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  async activateTrial() {
    return fetchWithAuth(`${API_BASE}/activate-trial`, {
      method: 'POST',
    });
  },
};
