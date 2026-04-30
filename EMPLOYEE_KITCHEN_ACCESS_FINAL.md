# Implementação Final: Acesso de Funcionários à Cozinha

## Problemas Resolvidos

### 1. Menu "Cozinha" não aparecia para funcionários
**Solução**: Atualizado o sidebar para mostrar o menu "Cozinha" para qualquer usuário com role de funcionário de cozinha, independentemente do tipo de estabelecimento.

### 2. Funcionários eram bloqueados por restrição de plano
**Solução**: Atualizado `useRouteProtection` para dar acesso total ao dashboard para funcionários de cozinha.

### 3. Funcionários não podiam criar pedidos
**Solução**: Removida a restrição que bloqueava funcionários de criar pedidos na página `/kitchen/create`.

### 4. Dados dos establishments não estavam disponíveis imediatamente após login
**Solução**: Criado novo hook `useAuthEstablishmentInit` que inicializa os establishments a partir dos dados do login response.

### 5. Loop infinito no customer-tracking
**Solução**: Substituído `useState` por `useRef` para rastrear pedidos anteriores sem causar re-renders infinitos.

## Mudanças Implementadas

### 1. **lib/types/establishment.ts**
- Adicionados roles de funcionário ao enum `BusinessRole`:
  - `KITCHEN_CHEF = 'kitchen_chef'`
  - `KITCHEN_COOK = 'kitchen_cook'`
  - `KITCHEN_MANAGER = 'kitchen_manager'`
  - `KITCHEN_ASSISTANT = 'kitchen_assistant'`

### 2. **lib/stores/auth-store.ts**
- Adicionado campo `establishments` ao interface `User` para armazenar dados dos establishments do login

### 3. **lib/hooks/use-auth-establishment-init.ts** (NOVO)
- Hook que inicializa os establishments a partir dos dados do login
- Usa `useRef` para evitar re-inicializações
- Normaliza os dados dos establishments

### 4. **app/(dashboard)/layout.tsx**
- Adicionado `useAuthEstablishmentInit()` para inicializar establishments imediatamente após login

### 5. **components/dashboard/sidebar.tsx**
- Adicionada lógica para detectar funcionários de cozinha
- Menu "Cozinha" agora aparece para funcionários mesmo que o estabelecimento não seja do tipo "kitchen"

### 6. **lib/hooks/use-route-protection.ts**
- Funcionários de cozinha agora têm acesso total ao dashboard sem restrição de plano

### 7. **app/(dashboard)/kitchen/create/page.tsx**
- Removida restrição que bloqueava funcionários de criar pedidos
- Agora apenas proprietários/admins têm restrição (se necessário)

### 8. **app/(dashboard)/kitchen/customer-tracking/page.tsx**
- Substituído `useState` por `useRef` para rastrear pedidos anteriores
- Removida dependência circular que causava loop infinito

## Fluxo Completo de Login para Funcionário

1. Funcionário faz login com credenciais
2. Backend retorna response com `establishments` contendo `roles: ["kitchen_cook"]`
3. Auth store armazena o user com os dados dos establishments
4. `useAuthEstablishmentInit` inicializa os establishments no establishment store
5. Sidebar verifica se o usuário é funcionário de cozinha
6. Menu "Cozinha" é exibido
7. `useRouteProtection` permite acesso total ao dashboard
8. Funcionário pode acessar todas as rotas de cozinha sem restrição de plano
9. Funcionário pode criar pedidos normalmente

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
          "logo": "https://...",
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
✅ Funcionários de cozinha não são bloqueados por restrição de plano
✅ Funcionários de cozinha não são cobrados por planos
✅ Sem erros de compilação ou tipo
✅ Sem loops infinitos

## Notas Importantes

- O sistema já tinha suporte para roles de funcionário em `lib/types/member.ts`
- A rota `/kitchen` não tem restrição de plano em `lib/utils/plan-restrictions.ts`
- Funcionários de cozinha podem acessar: criar pedido, KDS, acompanhamento interno, acompanhamento do cliente
- A lógica de cobrança (`chargeNow`) é apenas uma opção de UI, não há cobrança automática baseada em plano
- O hook `useAuthEstablishmentInit` é executado apenas uma vez por sessão de login
