import { BusinessRole } from '@/lib/types/establishment';

export const canAccess = (userRole: BusinessRole, requiredRoles: BusinessRole[]) => {
  return requiredRoles.includes(userRole);
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // Estabelecimentos
  MANAGE_ESTABLISHMENTS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // Estoque
  MANAGE_INVENTORY: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK, BusinessRole.SALES, BusinessRole.MARKETING],
  VIEW_INVENTORY: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK, BusinessRole.SALES, BusinessRole.MARKETING],
  
  // Vendas
  MAKE_SALES: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  VIEW_SALES: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // PDV
  ACCESS_POS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // Ofertas
  MANAGE_OFFERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING, BusinessRole.SALES, BusinessRole.STOCK],
  
  // Clientes
  MANAGE_CUSTOMERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // Fornecedores
  MANAGE_SUPPLIERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK, BusinessRole.SALES, BusinessRole.MARKETING],
  
  // Relatórios
  VIEW_REPORTS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING, BusinessRole.SALES, BusinessRole.STOCK],
  VIEW_FULL_REPORTS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING, BusinessRole.SALES, BusinessRole.STOCK],
  
  // Funcionários
  MANAGE_MEMBERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],
  
  // Assinatura
  MANAGE_SUBSCRIPTION: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES, BusinessRole.STOCK, BusinessRole.MARKETING],

  // Cozinha
  VIEW_KITCHEN: [
    BusinessRole.OWNER,
    BusinessRole.ADMIN,
    BusinessRole.SALES,
    BusinessRole.STOCK,
    BusinessRole.MARKETING,
    BusinessRole.KITCHEN_CHEF,
    BusinessRole.KITCHEN_COOK,
    BusinessRole.KITCHEN_MANAGER,
    BusinessRole.KITCHEN_ASSISTANT,
  ],
};

// Helper para verificar múltiplas permissões
export const hasAnyPermission = (userRole: BusinessRole, permissions: BusinessRole[][]) => {
  return permissions.some(requiredRoles => canAccess(userRole, requiredRoles));
};

// Helper para obter o role do usuário do estabelecimento atual
export const getUserRole = (establishment: any): BusinessRole | null => {
  return establishment?.role || null;
};
