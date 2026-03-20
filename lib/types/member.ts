export type MemberRole = 
  | 'business_owner'
  | 'business_admin'
  | 'business_sales'
  | 'business_stock'
  | 'business_marketing';

export interface Member {
  id: string;
  userId: string;
  roles: MemberRole[]; // Array de roles
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AddMemberRequest {
  userId: string;
  role: MemberRole;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone?: string;
  roles: MemberRole[];
  password?: string;
  avatar?: File;
}

export interface UpdateMemberRoleRequest {
  roles: MemberRole[]; // Array de roles
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  business_owner: 'Proprietário',
  business_admin: 'Administrador',
  business_sales: 'Vendedor',
  business_stock: 'Estoquista',
  business_marketing: 'Marketing',
};

export const ROLE_PERMISSIONS: Record<MemberRole, string[]> = {
  business_owner: [
    'Todas as permissões',
    'Gerenciar membros',
    'Deletar estabelecimento',
    'Atualizar configurações',
    'Ver relatórios completos',
    'Registrar vendas',
    'Gerenciar estoque',
  ],
  business_admin: [
    'Gerenciar membros',
    'Atualizar configurações',
    'Ver relatórios completos',
    'Registrar vendas',
    'Gerenciar estoque',
  ],
  business_sales: [
    'Registrar vendas',
    'Ver suas próprias vendas',
  ],
  business_stock: [
    'Gerenciar estoque',
    'Ver produtos',
  ],
  business_marketing: [
    'Ver relatórios (somente leitura)',
  ],
};
