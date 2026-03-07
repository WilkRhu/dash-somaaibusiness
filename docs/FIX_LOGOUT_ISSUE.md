# Fix: Redirecionamento para Login Após Ativar Trial

## Problema

Quando o usuário ativava o trial e clicava em "Começar a Explorar", era redirecionado para a página de login.

## Causa Raiz

O fluxo anterior era:

1. Usuário clica em "Ativar Trial"
2. API ativa o trial no backend
3. Frontend chama `loadUser()` para recarregar dados do usuário
4. `loadUser()` faz uma requisição GET `/auth/me`
5. Se o backend ainda não atualizou o token ou retorna 401, o interceptor do axios redireciona para `/login`

### Interceptor Problemático

```typescript
// lib/api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        window.location.href = '/login'; // ← Aqui estava o problema
      }
    }
    return Promise.reject(error);
  }
);
```

## Solução

Em vez de chamar `loadUser()` que faz uma requisição ao backend (que pode falhar), agora atualizamos o estado do usuário localmente no Zustand store.

### Novo Método no Auth Store

```typescript
updateUserPlan: (plan, trialEndsAt, trialDaysRemaining) => {
  set((state) => ({
    user: state.user ? {
      ...state.user,
      subscriptionPlan: plan,
      planType: plan.toLowerCase(),
      trialEndsAt,
      trialDaysRemaining,
    } : null,
  }));
}
```

### Novo Fluxo

1. Usuário clica em "Ativar Trial"
2. API ativa o trial no backend
3. Frontend atualiza o plano localmente para `TRIAL` usando `updateUserPlan()`
4. Modal de sucesso aparece
5. Usuário clica em "Começar a Explorar"
6. Modal fecha e usuário permanece no dashboard ✅

## Benefícios

✅ Não faz requisição adicional ao backend
✅ Não há risco de erro 401
✅ Atualização instantânea do estado
✅ Usuário permanece autenticado
✅ Banner de trial aparece imediatamente

## Sincronização com Backend

O estado local será sincronizado com o backend na próxima vez que:
- Usuário recarregar a página (chama `loadUser()` no mount)
- Usuário fizer logout e login novamente
- Qualquer outra requisição que retorne dados do usuário

## Código Atualizado

### components/subscription/trial-welcome-modal.tsx

```typescript
const handleActivateTrial = async () => {
  try {
    setIsActivating(true);
    const response = await subscriptionApi.activateTrial();
    
    if (response.success) {
      // Atualizar o plano localmente (sem fazer requisição)
      const trialEndsAt = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toISOString();
      updateUserPlan(SubscriptionPlan.TRIAL, trialEndsAt, daysRemaining);
      
      // Fechar modal e mostrar sucesso
      onClose();
      setShowSuccessModal(true);
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erro ao ativar trial.');
  } finally {
    setIsActivating(false);
  }
};
```

## Teste

1. Faça login como usuário FREE
2. Aguarde o modal de trial aparecer
3. Clique em "Ativar Trial Grátis"
4. Modal de sucesso aparece
5. Clique em "Começar a Explorar"
6. ✅ Você permanece no dashboard (não redireciona para login)
7. ✅ Banner de trial aparece no topo
8. ✅ Recursos premium estão desbloqueados
