import { BusinessRole } from '@/lib/types/establishment';

export const canAccess = (userRole: BusinessRole, requiredRoles: BusinessRole[]) => {
  return requiredRoles.includes(userRole);
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // Estabelecimentos
  MANAGE_ESTABLISHMENTS: [BusinessRole.OWNER, BusinessRole.ADMIN],
  
  // Estoque
  MANAGE_INVENTORY: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK],
  VIEW_INVENTORY: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK, BusinessRole.SALES],
  
  // Vendas
  MAKE_SALES: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES],
  VIEW_SALES: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES],
  
  // PDV
  ACCESS_POS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES],
  
  // Ofertas
  MANAGE_OFFERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING],
  
  // Clientes
  MANAGE_CUSTOMERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES],
  
  // Fornecedores
  MANAGE_SUPPLIERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK],
  
  // Relatórios
  VIEW_REPORTS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING],
  VIEW_FULL_REPORTS: [BusinessRole.OWNER, BusinessRole.ADMIN],
  
  // Funcionários
  MANAGE_MEMBERS: [BusinessRole.OWNER, BusinessRole.ADMIN],
  
  // Assinatura
  MANAGE_SUBSCRIPTION: [BusinessRole.OWNER],
};

// Helper para verificar múltiplas permissões
export const hasAnyPermission = (userRole: BusinessRole, permissions: BusinessRole[][]) => {
  return permissions.some(requiredRoles => canAccess(userRole, requiredRoles));
};

// Helper para obter o role do usuário do estabelecimento atual
export const getUserRole = (establishment: any): BusinessRole | null => {
  return establishment?.role || null;
};
