# Implementação: Acesso de Funcionários à Cozinha

## Problema Identificado
Quando um usuário faz login como funcionário (com role `kitchen_cook` ou similar), o sistema não estava:
1. Mostrando o menu "Cozinha" na sidebar
2. Permitindo acesso às rotas de cozinha sem restrição de plano
3. Permitindo que funcionários criassem pedidos

## Solução Implementada

### 1. **Atualização do Enum BusinessRole** (`lib/types/establishment.ts`)
Adicionados os roles de funcionário ao enum:
- `KITCHEN_CHEF = 'kitchen_chef'`
- `KITCHEN_COOK = 'kitchen_cook'`
- `KITCHEN_MANAGER = 'kitchen_manager'`
- `KITCHEN_ASSISTANT = 'kitchen_assistant'`

**Benefício**: Tipagem correta e consistência em todo o código.

### 2. **Ajuste da Sidebar** (`components/dashboard/sidebar.tsx`)
**Mudança**: Adicionada lógica para mostrar o menu "Cozinha" para funcionários de cozinha

```typescript
// Verificar se é funcionário de cozinha
const isKitchenEmployee = userRoles.some(r => 
  r === BusinessRole.KITCHEN_CHEF ||
  r === BusinessRole.KITCHEN_COOK ||
  r === BusinessRole.KITCHEN_MANAGER ||
  r === BusinessRole.KITCHEN_ASSISTANT ||
  r === 'kitchen_chef' ||
  r === 'kitchen_cook' ||
  r === 'kitchen_manager' ||
  r === 'kitchen_assistant'
);

// Cozinha aparece se: é tipo kitchen OU usuário é funcionário de cozinha
if (item.requiresKitchenType && !isKitchenTypeEstablishment && !isKitchenEmployee) return false;
```

**Benefício**: Funcionários de cozinha agora veem o menu "Cozinha" mesmo que o estabelecimento não seja do tipo "kitchen".

### 3. **Proteção de Rotas** (`lib/hooks/use-route-protection.ts`)
**Mudança**: Atualizada para verificar roles do establishment atual

```typescript
// Funcionários de cozinha podem acessar rotas de cozinha sem restrição de plano
const establishmentRoles = currentEstablishment?.roles || [];
const isKitchenEmployee = establishmentRoles.some((role: any) => 
  role === 'kitchen_cook' || 
  role === 'kitchen_manager' ||
  role === 'kitchen_chef' ||
  role === 'kitchen_assistant'
);

if (isKitchenEmployee && pathname.startsWith('/kitchen')) {
  return null; // Sem restrição de plano
}
```

**Benefício**: Funcionários de cozinha não são bloqueados por restrições de plano ao acessar rotas de cozinha.

### 4. **Permissão para Criar Pedidos** (`app/(dashboard)/kitchen/create/page.tsx`)
**Mudança**: Removida a restrição que bloqueava funcionários de cozinha de criar pedidos

**Antes**:
```typescript
const hasKitchenRole = currentEstablishment?.roles?.some(r => r.includes('kitchen'));
if (hasKitchenRole) {
  // Usuário com cargo de cozinha não pode criar pedidos
  setIsAuthorized(false);
  router.push('/kitchen/display');
}
```

**Depois**:
```typescript
// Apenas proprietários e admins podem criar pedidos
// Funcionários de cozinha podem criar pedidos normalmente
const userRole = currentEstablishment?.role;
const userRoles = currentEstablishment?.roles || [];

const isOwnerOrAdmin = userRole === 'business_owner' || userRole === 'business_admin' ||
  userRoles.includes('business_owner') || userRoles.includes('business_admin');

// Se não é owner/admin, pode ser funcionário de cozinha que tem permissão
if (!isOwnerOrAdmin && !userRoles.some(r => r.includes('kitchen'))) {
  setIsAuthorized(false);
  router.push('/home');
}
```

**Benefício**: Funcionários de cozinha agora podem criar pedidos normalmente.

## Fluxo de Login para Funcionários

1. Usuário faz login com credenciais de funcionário
2. Backend retorna resposta com `establishments` contendo roles como `kitchen_cook`
3. Frontend armazena os dados no auth store e establishment store
4. Sidebar verifica se o usuário é funcionário de cozinha
5. Menu "Cozinha" é exibido
6. Funcionário pode acessar todas as rotas de cozinha sem restrição de plano
7. Funcionário pode criar pedidos normalmente

## Dados de Exemplo (Login Response)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a45660e4-4ec4-4691-ad4d-719cd9a63a85",
      "name": "Cozinheiro",
      "email": "cozinheiro@gmail.com",
      "role": "user",
      "planType": "free",
      "establishments": [
        {
          "id": "bcf4c6fa-ee6f-4fcd-8e7b-a545905e3e66",
          "name": "Restaurante Teste",
          "roles": ["kitchen_cook"]
        }
      ]
    }
  }
}
```

## Verificação

✅ Funcionários de cozinha veem o menu "Cozinha"
✅ Funcionários de cozinha podem acessar rotas de cozinha
✅ Funcionários de cozinha podem criar pedidos
✅ Funcionários de cozinha não são cobrados por planos
✅ Sem erros de compilação ou tipo

## Notas Importantes

- O sistema já tinha suporte para roles de funcionário em `lib/types/member.ts`
- A rota `/kitchen` não tem restrição de plano em `lib/utils/plan-restrictions.ts`
- Funcionários de cozinha podem acessar: criar pedido, KDS, acompanhamento interno, acompanhamento do cliente
- A lógica de cobrança (`chargeNow`) é apenas uma opção de UI, não há cobrança automática baseada em plano
