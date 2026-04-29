export type MemberRole = 
  | 'business_owner'
  | 'business_admin'
  | 'business_sales'
  | 'business_stock'
  | 'business_marketing'
  | 'kitchen_chef'
  | 'kitchen_cook'
  | 'kitchen_assistant'
  | 'waiter'
  | 'cashier'
  | 'delivery_driver'
  | 'host';

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
  roles: MemberRole[]; // Array de roles
  password?: string;
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
  kitchen_chef: 'Chef de Cozinha',
  kitchen_cook: 'Cozinheiro',
  kitchen_assistant: 'Auxiliar de Cozinha',
  waiter: 'Garçom',
  cashier: 'Caixa',
  delivery_driver: 'Motorista de Delivery',
  host: 'Recepcionista',
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
  kitchen_chef: [
    'Gerenciar cozinha',
    'Visualizar pedidos',
    'Atualizar status de pedidos',
    'Gerenciar cozinheiros',
    'Ver relatórios de cozinha',
  ],
  kitchen_cook: [
    'Visualizar pedidos',
    'Atualizar status de pedidos',
    'Ver cardápio',
  ],
  kitchen_assistant: [
    'Visualizar pedidos',
    'Auxiliar na preparação',
  ],
  waiter: [
    'Registrar pedidos',
    'Ver mesas',
    'Atualizar status de pedidos',
    'Registrar vendas',
  ],
  cashier: [
    'Registrar vendas',
    'Processar pagamentos',
    'Ver relatórios de caixa',
    'Emitir recibos',
  ],
  delivery_driver: [
    'Ver pedidos de delivery',
    'Atualizar status de entrega',
    'Ver rotas',
  ],
  host: [
    'Gerenciar reservas',
    'Receber clientes',
    'Ver disponibilidade de mesas',
  ],
};
