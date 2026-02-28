export enum SubscriptionPlan {
  FREE = 'FREE',
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export interface PlanLimits {
  establishments: number | null; // null = ilimitado
  employees: number | null;
  products: number | null;
}

export interface PlanFeatures {
  name: string;
  price: number;
  limits: PlanLimits;
  features: string[];
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  [SubscriptionPlan.FREE]: {
    establishments: 1,
    employees: 2,
    products: 50,
  },
  [SubscriptionPlan.TRIAL]: {
    establishments: 3,
    employees: 20,
    products: 1000,
  },
  [SubscriptionPlan.BASIC]: {
    establishments: 3,
    employees: 20,
    products: 1000,
  },
  [SubscriptionPlan.PREMIUM]: {
    establishments: 10,
    employees: 100,
    products: null, // ilimitado
  },
  [SubscriptionPlan.ENTERPRISE]: {
    establishments: null, // ilimitado
    employees: null, // ilimitado
    products: null, // ilimitado
  },
};

export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  [SubscriptionPlan.FREE]: {
    name: 'Gratuito',
    price: 0,
    limits: PLAN_LIMITS.FREE,
    features: [
      '1 estabelecimento',
      '2 funcionários',
      '50 produtos no inventário',
      'Funcionalidades básicas',
    ],
  },
  [SubscriptionPlan.TRIAL]: {
    name: 'Trial (10 dias)',
    price: 0,
    limits: PLAN_LIMITS.TRIAL,
    features: [
      '3 estabelecimentos',
      '20 funcionários',
      '1.000 produtos no inventário',
      'Relatórios avançados',
      'Suporte por email',
      '⏰ 10 dias de teste grátis',
    ],
  },
  [SubscriptionPlan.BASIC]: {
    name: 'Básico',
    price: 49.90,
    limits: PLAN_LIMITS.BASIC,
    features: [
      '3 estabelecimentos',
      '20 funcionários',
      '1.000 produtos no inventário',
      'Relatórios avançados',
      'Suporte por email',
    ],
  },
  [SubscriptionPlan.PREMIUM]: {
    name: 'Premium',
    price: 149.90,
    limits: PLAN_LIMITS.PREMIUM,
    features: [
      '10 estabelecimentos',
      '100 funcionários',
      'Produtos ilimitados',
      'Integração fiscal (NFe/NFCe)',
      'Suporte prioritário',
      'API access',
    ],
  },
  [SubscriptionPlan.ENTERPRISE]: {
    name: 'Enterprise',
    price: 0, // Sob consulta
    limits: PLAN_LIMITS.ENTERPRISE,
    features: [
      'Estabelecimentos ilimitados',
      'Funcionários ilimitados',
      'Produtos ilimitados',
      'Customizações',
      'Suporte dedicado',
      'SLA garantido',
    ],
  },
};

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string | null;
  trialDaysRemaining?: number;
}

export interface UsageLimits {
  establishments: {
    current: number;
    limit: number | null;
    percentage: number;
  };
  employees: {
    current: number;
    limit: number | null;
    percentage: number;
  };
  products: {
    current: number;
    limit: number | null;
    percentage: number;
  };
}
