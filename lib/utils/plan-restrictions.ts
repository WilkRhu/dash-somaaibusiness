import { SubscriptionPlan } from '@/lib/types/subscription';

export interface RouteRestriction {
  path: string;
  minPlan: SubscriptionPlan;
  label: string;
  description: string;
}

// Rotas restritas por plano - TODAS LIBERADAS
export const ROUTE_RESTRICTIONS: RouteRestriction[] = [];

// Verificar se o usuário pode acessar uma rota
export const canAccessRoute = (
  path: string,
  userPlan: SubscriptionPlan
): { allowed: boolean; restriction?: RouteRestriction } => {
  const restriction = ROUTE_RESTRICTIONS.find((r) => path.startsWith(r.path));

  if (!restriction) {
    // Rota não tem restrição
    return { allowed: true };
  }

  // Ordem dos planos
  const planOrder = [
    SubscriptionPlan.FREE,
    SubscriptionPlan.TRIAL,
    SubscriptionPlan.BASIC,
    SubscriptionPlan.PREMIUM,
    SubscriptionPlan.ENTERPRISE,
  ];

  const userPlanIndex = planOrder.indexOf(userPlan);
  const minPlanIndex = planOrder.indexOf(restriction.minPlan);

  if (userPlanIndex >= minPlanIndex) {
    return { allowed: true };
  }

  return { allowed: false, restriction };
};

// Obter o próximo plano necessário para acessar uma rota
export const getRequiredPlanForRoute = (path: string): SubscriptionPlan | null => {
  const restriction = ROUTE_RESTRICTIONS.find((r) => path.startsWith(r.path));
  return restriction ? restriction.minPlan : null;
};

// Verificar se uma feature está disponível no plano
export const isFeatureAvailable = (
  feature: 'reports' | 'offers' | 'customers' | 'suppliers' | 'advanced_inventory',
  userPlan: SubscriptionPlan
): boolean => {
  const featureMinPlans: Record<string, SubscriptionPlan> = {
    reports: SubscriptionPlan.TRIAL,
    offers: SubscriptionPlan.TRIAL,
    customers: SubscriptionPlan.TRIAL,
    suppliers: SubscriptionPlan.TRIAL,
    advanced_inventory: SubscriptionPlan.TRIAL,
  };

  const minPlan = featureMinPlans[feature];
  if (!minPlan) return true;

  const planOrder = [
    SubscriptionPlan.FREE,
    SubscriptionPlan.TRIAL,
    SubscriptionPlan.BASIC,
    SubscriptionPlan.PREMIUM,
    SubscriptionPlan.ENTERPRISE,
  ];

  return planOrder.indexOf(userPlan) >= planOrder.indexOf(minPlan);
};

// Obter nome amigável do plano
export const getPlanDisplayName = (plan: SubscriptionPlan): string => {
  const names: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.FREE]: 'Gratuito',
    [SubscriptionPlan.TRIAL]: 'Trial',
    [SubscriptionPlan.BASIC]: 'Básico',
    [SubscriptionPlan.PREMIUM]: 'Premium',
    [SubscriptionPlan.ENTERPRISE]: 'Enterprise',
  };
  return names[plan];
};
