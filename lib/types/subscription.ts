export enum BusinessPlanType {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
}

export interface BusinessSubscription {
  id: string;
  establishmentId: string;
  planType: BusinessPlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  productsUsed: number;
  usersUsed: number;
  offersUsed: number;
}

export interface PlanLimits {
  maxProducts: number;
  maxUsers: number;
  maxOffers: number;
  maxStores: number;
  hasAdvancedReports: boolean;
  hasLoyaltyProgram: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
}
