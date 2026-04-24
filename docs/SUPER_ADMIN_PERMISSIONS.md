# Permissões do Super Admin vs Business Roles

## Diferença entre os Sistemas de Papéis

### 1. Sistema Global (`UserRole`) - Nível Plataforma

| Papel | Descrição | Escopo |
|-------|-----------|--------|
| `user` | Usuário comum | Acesso básico |
| `support` | Suporte técnico | Suporte da plataforma |
| `admin` | Administrador | Recursos administrativos |
| `super_admin` | Super Administrador | Acesso total à plataforma |

### 2. Sistema Business (`BusinessRole`) - Nível Estabelecimento

| Papel | Descrição | Escopo |
|-------|-----------|--------|
| `business_owner` | Proprietário | Dono do estabelecimento |
| `business_admin` | Administrador | Gestão do estabelecimento |
| `business_sales` | Vendas | Acesso a vendas |
| `business_stock` | Estoque | Gestão de estoque |
| `business_marketing` | Marketing | Promoções e ofertas |

## Super Admin (Global) - Endpoints

| Módulo | URL Base | Descrição |
|--------|----------|-----------|
| Usuários | `/admin/users` | Gerenciar usuários do sistema |
| Tickets | `/admin/tickets` | Gerenciar tickets de suporte |
| Assinaturas | `/admin/subscriptions` | Gerenciar planos e assinaturas |
| Compras | `/admin/purchases` | Gerenciar compras |
| Relatórios | `/admin/reports` | Visualizar relatórios |
| Logs | `/admin/system` | Visualizar logs do sistema |
| Notificações | `/admin/notifications` | Gerenciar notificações |

**Guard:** `@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)`

## Business Roles - Endpoints por Módulo

### Fornecedores (`/business/suppliers`)
- `business_owner`, `business_admin`, `business_stock`: Acesso total

### Inventário (`/business/inventory`)
- `business_owner`, `business_admin`, `business_stock`: Criar, editar, atualizar estoque
- `business_owner`, `business_admin`: Deletar produtos

### Ofertas (`/business/offers`)
- Protegido por `BusinessRoleGuard`

## Observações

- `super_admin` é um papel **global** (plataforma), não relacionado a um estabelecimento específico
- `business_*` são papéis **por estabelecimento**, controlados pelo `BusinessRoleGuard`
- O `super_admin` pode acessar qualquer estabelecimento, mas não tem um papel business específico
- Para dar acesso total a todos os establishments, seria necessário um guard especial ou atribuir um papel business em cada estabelecimento