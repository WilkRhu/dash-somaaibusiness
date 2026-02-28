import { BusinessRole } from '@/lib/types/establishment';

export const canAccess = (userRole: BusinessRole, requiredRoles: BusinessRole[]) => {
  return requiredRoles.includes(userRole);
};

export const PERMISSIONS = {
  MANAGE_ESTABLISHMENT: [BusinessRole.OWNER, BusinessRole.ADMIN],
  MANAGE_INVENTORY: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK],
  MAKE_SALES: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES],
  MANAGE_OFFERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING],
  VIEW_REPORTS: [BusinessRole.OWNER, BusinessRole.ADMIN],
  MANAGE_SUBSCRIPTION: [BusinessRole.OWNER],
};
