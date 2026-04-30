# Fix: Erro 403 ao Carregar Dados de Delivery para Funcionários

## Problema
Funcionários de cozinha estavam recebendo erro 403 ao tentar acessar dados de delivery, pois não têm permissão para acessar essas rotas da API.

## Causa
Vários hooks estavam tentando carregar dados de delivery mesmo para usuários que não têm permissão:
1. `usePendingDeliveryCount()` - usado no sidebar
2. `useDeliveryOrders()- usado em `useOrderNotifications()`
3. `useOrderNotifications()` - usado em `OrderToastListener`

## Solução Implementada

### 1. **lib/hooks/use-pending-delivery-count.ts**
Adicionada verificação para não carregar dados de delivery para funcionários de cozinha:

```typescript
// Não carregar dados de delivery para funcionários de cozinha
const roles = currentEstablishment?.roles || [];
const isKitchenEmployee = roles.some((role: any) =>
  role === 'kitchen_cook' ||
  role === 'kitchen_manager' ||
  role === 'kitchen_chef' ||
  role === 'kitchen_assistant'
);

if (isKitchenEmployee) {
  setLoading(false);
  setCount(0);
  return;
}
```

### 2. **lib/hooks/use-delivery.ts**
Adicionada verificação no `useDeliveryOrders()` para não carregar dados de delivery para funcionários de cozinha:

```typescript
// Não carregar dados de delivery para funcionários de cozinha
const roles = currentEstablishment?.roles || [];
const isKitchenEmployee = roles.some((role: any) =>
  role === 'kitchen_cook' ||
  role === 'kitchen_manager' ||
  role === 'kitchen_chef' ||
  role === 'kitchen_assistant'
);

if (isKitchenEmployee) {
  setLoading(false);
  setOrders([]);
  return;
}
```

## Fluxo Corrigido

1. Funcionário faz login
2. É redirecionado para `/kitchen/display`
3. Dashboard layout carrega
4. `usePendingDeliveryCount()` verifica se é funcionário de cozinha e retorna 0 sem fazer chamada de API
5. `useOrderNotifications()` chama `useDeliveryOrders()`
6. `useDeliveryOrders()` verifica se é funcionário de cozinha e retorna array vazio sem fazer chamada de API
7. Nenhum erro 403 é gerado

## Verificação

✅ Funcionários de cozinha não recebem erro 403
✅ Funcionários de cozinha podem acessar `/kitchen/display` sem erros
✅ Sidebar carrega sem erros
✅ Nenhuma chamada de API desnecessária é feita
✅ Sem erros de compilação ou tipo

## Notas Importantes

- A verificação de roles é feita em cada hook para garantir que nenhuma chamada de API seja feita
- Funcionários de cozinha recebem dados vazios (count = 0, orders = []) em vez de erro
- Proprietários/admins continuam recebendo dados de delivery normalmente
- O padrão de verificação é consistente em todos os hooks
