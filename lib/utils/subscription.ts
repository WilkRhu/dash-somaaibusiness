import { SubscriptionPlan, PLAN_LIMITS, PlanLimits } from '@/lib/types/subscription';

export const hasReachedLimit = (current: number, limit: number | null): boolean => {
  if (limit === null) return false; // ilimitado
  return current >= limit;
};

export const getLimitPercentage = (current: number, limit: number | null): number => {
  if (limit === null) return 0; // ilimitado
  if (limit === 0) return 100;
  return Math.min(Math.round((current / limit) * 100), 100);
};

export const canCreateEstablishment = (
  currentCount: number,
  plan: SubscriptionPlan
): { allowed: boolean; message?: string } => {
  const limit = PLAN_LIMITS[plan].establishments;
  
  if (hasReachedLimit(currentCount, limit)) {
    return {
      allowed: false,
      message: `Você atingiu o limite de ${limit} estabelecimento(s) do plano ${plan}. Faça upgrade para criar mais estabelecimentos.`,
    };
  }
  
  return { allowed: true };
};

export const canAddEmployee = (
  currentCount: number,
  plan: SubscriptionPlan
): { allowed: boolean; message?: string } => {
  const limit = PLAN_LIMITS[plan].employees;
  
  if (hasReachedLimit(currentCount, limit)) {
    return {
      allowed: false,
      message: `Você atingiu o limite de ${limit} funcionário(s) do plano ${plan}. Faça upgrade para adicionar mais funcionários.`,
    };
  }
  
  return { allowed: true };
};

export const canAddProduct = (
  currentCount: number,
  plan: SubscriptionPlan
): { allowed: boolean; message?: string } => {
  const limit = PLAN_LIMITS[plan].products;
  
  if (hasReachedLimit(currentCount, limit)) {
    return {
      allowed: false,
      message: `Você atingiu o limite de ${limit} produto(s) do plano ${plan}. Faça upgrade para adicionar mais produtos.`,
    };
  }
  
  return { allowed: true };
};

export const formatLimit = (limit: number | null): string => {
  if (limit === null) return 'Ilimitado';
  return limit.toString();
};

export const getPlanName = (plan: SubscriptionPlan): string => {
  const names: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.FREE]: 'Gratuito',
    [SubscriptionPlan.TRIAL]: 'Trial (10 dias)',
    [SubscriptionPlan.BASIC]: 'Básico',
    [SubscriptionPlan.PREMIUM]: 'Premium',
    [SubscriptionPlan.ENTERPRISE]: 'Enterprise',
  };
  return names[plan];
};

export const getNextPlan = (currentPlan: SubscriptionPlan): SubscriptionPlan | null => {
  const planOrder = [
    SubscriptionPlan.FREE,
    SubscriptionPlan.TRIAL,
    SubscriptionPlan.BASIC,
    SubscriptionPlan.PREMIUM,
    SubscriptionPlan.ENTERPRISE,
  ];
  
  const currentIndex = planOrder.indexOf(currentPlan);
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null;
  }
  
  return planOrder[currentIndex + 1];
};

export const getLimitWarningLevel = (percentage: number): 'safe' | 'warning' | 'danger' => {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'safe';
};
