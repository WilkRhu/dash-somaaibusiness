export enum BusinessRole {
  OWNER = 'business_owner',
  ADMIN = 'business_admin',
  SALES = 'business_sales',
  STOCK = 'business_stock',
  MARKETING = 'business_marketing',
  KITCHEN_CHEF = 'kitchen_chef',
  KITCHEN_COOK = 'kitchen_cook',
  KITCHEN_MANAGER = 'kitchen_manager',
  KITCHEN_ASSISTANT = 'kitchen_assistant',
  WAITER = 'waiter',
}

export interface Establishment {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  logo?: string;
  role?: BusinessRole;
  roles?: BusinessRole[];
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  cashRegistersCount?: number;
  isActive?: boolean;
  isOpen?: boolean;
  loyaltyEnabled?: boolean;
  loyaltyPointsPerReal?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoyaltySettings {
  loyaltyEnabled: boolean;
  loyaltyPointsPerReal: number;
  description?: string;
  example?: string;
}

export interface UpdateLoyaltySettingsDto {
  loyaltyEnabled?: boolean;
  loyaltyPointsPerReal?: number;
}

export interface EstablishmentSettings {
  id: string;
  establishmentId: string;
  kitchenEnabled: boolean;
  deliveryEnabled: boolean;
  kitchenNotificationsEnabled: boolean;
  autoAcceptOrders: boolean;
  minOrderValue: string;
  maxDeliveryRadiusKm: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEstablishmentSettingsDto {
  kitchenEnabled?: boolean;
  deliveryEnabled?: boolean;
  kitchenNotificationsEnabled?: boolean;
  autoAcceptOrders?: boolean;
  minOrderValue?: string;
  maxDeliveryRadiusKm?: number | null;
}

export interface EstablishmentMember {
  id: string;
  userId: string;
  role: BusinessRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateEstablishmentDto {
  name: string;
  cnpj: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  cashRegistersCount?: number;
}
