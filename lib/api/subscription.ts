import apiClient from './client';

export interface SubscriptionStatus {
  currentPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isOnTrial: boolean;
  trialEndsAt: string | null;
  trialDaysRemaining: number;
  limits: {
    establishments: number;
    employees: number;
    products: number;
  };
  usage: {
    establishments: number;
  };
  canCreateEstablishment: boolean;
}

export interface PlanInfo {
  id: string;
  name: string;
  price: number | null;
  interval: 'lifetime' | 'monthly' | 'custom';
  features: string[];
  limits: {
    establishments: number;
    employees: number;
    products: number;
  };
  recommended?: boolean;
  contactSales?: boolean;
}

export const subscriptionApi = {
  // Ativar trial de 10 dias
  activateTrial: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/business/subscription/activate-trial'
    );
    return response.data;
  },

  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await apiClient.get<{ success: boolean; data: SubscriptionStatus }>(
      '/business/subscription/status'
    );
    return response.data.data;
  },

  getPlans: async (): Promise<PlanInfo[]> => {
    const response = await apiClient.get<{ success: boolean; data: PlanInfo[] }>(
      '/business/subscription/plans'
    );
    return response.data.data;
  },
};
