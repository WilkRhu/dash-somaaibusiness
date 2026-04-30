# Implementação Final: Redirecionamento de Funcionários para KDS

## Objetivo
Quando um funcionário de cozinha faz login, ele deve ser redirecionado diretamente para `/kitchen/display` (KDS - Kitchen Display System) em vez de `/home`.

## Mudanças Implementadas

### 1. **lib/utils/redirect-helper.ts** (NOVO)
Função helper que determina para onde redirecionar o usuário após login:

```typescript
export function getRedirectPathAfterLogin(user: any): string {
  // Se é funcionário de cozinha, redireciona para o KDS
  const establishments = user?.establishments || [];
  
  if (establishments.length > 0) {
    const firstEstablishment = establishments[0];
    const roles = firstEstablishment.roles || [];
    
    const isKitchenEmployee = roles.some((role: string) =>
      role === 'kitchen_cook' ||
      role === 'kitchen_manager' ||
      role === 'kitchen_chef' ||
      role === 'kitchen_assistant'
    );
    
    if (isKitchenEmployee) {
      return '/kitchen/display';
    }
  }
  
  // Padrão: redireciona para home
  return '/home';
}
```

### 2. **app/(auth)/login/page.tsx**
Atualizado para usar a função helper:

```typescript
try {
  await login(email, password);
  console.log('Login bem-sucedido, redirecionando...');
  
  // Aguardar um pouco para o user ser atualizado no store
  setTimeout(() => {
    const redirectPath = getRedirectPathAfterLogin(user);
    router.push(redirectPath);
  }, 100);
} catch (err: any) {
  // ... tratamento de erro
}
```

### 3. **app/(dashboard)/kitchen/display/page.tsx**
Atualizado para permitir funcionários de cozinha:

```typescript
// Validar se o estabelecimento é do tipo que possui cozinha OU se é funcionário de cozinha
const isKitchenTypeEstablishment = isKitchenEstablishment(currentEstablishment?.type);
const isKitchenEmployee = userRoles.some((role: any) =>
  role === 'kitchen_cook' ||
  role === 'kitchen_manager' ||
  role === 'kitchen_chef' ||
  role === 'kitchen_assistant'
);
const canAccessKitchen = isKitchenTypeEstablishment || isKitchenEmployee;

useEffect(() => {
  if (!canAccessKitchen && currentEstablishment) {
    router.push('/home');
  }
}, [canAccessKitchen, currentEstablishment, router]);
```

## Fluxo Completo

1. Funcionário faz login com credenciais
2. Backend retorna response com `establishments` contendo `roles: ["kitchen_cook"]`
3. Auth store armazena o user com os dados dos establishments
4. `getRedirectPathAfterLogin()` detecta que é funcionário de cozinha
5. Usuário é redirecionado para `/kitchen/display`
6. `useAuthEstablishmentInit` inicializa os establishments no establishment store
7. Página `/kitchen/display` verifica se é funcionário de cozinha e permite acesso
8. Funcionário vê o KDS (Kitchen Display System) com os pedidos

## Verificação

✅ Funcionários de cozinha são redirecionados para `/kitchen/display` após login
✅ Proprietários/admins continuam sendo redirecionados para `/home`
✅ Funcionários podem acessar a página `/kitchen/display`
✅ Sem erros de compilação ou tipo

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

## Notas Importantes

- A função `getRedirectPathAfterLogin()` verifica o primeiro estabelecimento do usuário
- Se o usuário tem múltiplos estabelecimentos, apenas o primeiro é considerado para o redirecionamento
- O redirecionamento acontece após um pequeno delay (100ms) para garantir que o user foi atualizado no store
- Funcionários de cozinha veem o KDS completo com todas as funcionalidades
