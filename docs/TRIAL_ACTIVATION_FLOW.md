# Fluxo de Ativação do Trial

## Visão Geral

Sistema completo de ativação de trial de 10 dias para usuários FREE.

## Fluxo Completo

### 1. Usuário FREE Entra no Dashboard
- Modal aparece automaticamente após 2 segundos
- Modal só aparece uma vez (salvo no localStorage)
- Usuário pode fechar com "Agora Não" ou ativar o trial

### 2. Ativação do Trial
**Quando o usuário clica em "Ativar Trial Grátis":**

1. Frontend chama: `POST /business/subscription/activate-trial`
2. Backend valida e ativa o trial
3. Frontend recarrega dados do usuário
4. Modal fecha e usuário é redirecionado

### 3. Após Ativação
- Plano muda de FREE para TRIAL
- Banner de trial aparece no topo do dashboard
- Usuário tem acesso a recursos BASIC por 10 dias
- Rotas premium são desbloqueadas

## API Endpoint

### Ativar Trial

```http
POST /business/subscription/activate-trial
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** Vazio (sem body)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Trial de 10 dias ativado com sucesso! Você agora tem acesso aos recursos do plano BASIC."
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Trial já foi utilizado"
}
```

## Componentes Envolvidos

### 1. `useTrialModal` Hook
**Arquivo:** `lib/hooks/use-trial-modal.ts`

- Detecta se usuário é FREE
- Controla exibição do modal
- Gerencia localStorage para não mostrar novamente

### 2. `TrialWelcomeModal` Component
**Arquivo:** `components/subscription/trial-welcome-modal.tsx`

- Modal de boas-vindas ao trial
- Botão "Ativar Trial Grátis" chama API
- Loading state durante ativação
- Tratamento de erros

### 3. `subscriptionApi.activateTrial()`
**Arquivo:** `lib/api/subscription.ts`

```typescript
activateTrial: async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/business/subscription/activate-trial'
  );
  return response.data;
}
```

## Estados do Modal

### Para Usuário FREE
```typescript
{
  showModal: true,
  daysRemaining: 10,
  isOnTrial: false
}
```

### Após Ativação (Usuário TRIAL)
```typescript
{
  showModal: false,
  daysRemaining: 10,
  isOnTrial: true
}
```

## LocalStorage

**Key:** `trial_modal_dismissed`

- `"true"` = Usuário fechou o modal, não mostrar novamente
- Limpar para forçar modal aparecer novamente (debug)

## Validações

### Frontend
- ✅ Só mostra modal para plano FREE
- ✅ Não mostra se já foi dispensado
- ✅ Loading state durante ativação
- ✅ Tratamento de erro

### Backend (Esperado)
- ✅ Validar se usuário já teve trial
- ✅ Validar se usuário é FREE
- ✅ Definir `trialEndsAt` = hoje + 10 dias
- ✅ Mudar plano de FREE para TRIAL
- ✅ Marcar `hadTrial = true`

## Recursos Desbloqueados no Trial

Durante os 10 dias de trial, o usuário tem acesso a:

- ✅ 3 estabelecimentos (vs 1 no FREE)
- ✅ 20 funcionários (vs 2 no FREE)
- ✅ 1.000 produtos (vs 50 no FREE)
- ✅ Relatórios avançados (bloqueado no FREE)
- ✅ Sistema de ofertas (bloqueado no FREE)
- ✅ Gestão de clientes (bloqueado no FREE)

## Após Trial Expirar

Quando os 10 dias terminam:

1. Backend muda plano de TRIAL para FREE
2. Limites voltam para FREE
3. Rotas premium são bloqueadas novamente
4. Estabelecimentos/produtos existentes permanecem (apenas não pode criar novos)

## Testes

### Forçar Modal Aparecer
```javascript
// No console do navegador
localStorage.removeItem('trial_modal_dismissed');
// Recarregar página
```

### Simular Usuário FREE
O backend precisa retornar `subscriptionPlan: 'FREE'` no endpoint `/api/business/auth/me`

### Testar Erro "Trial já utilizado"
Backend deve retornar erro 400 se `hadTrial === true`

## Próximos Passos

### Backend
1. Implementar endpoint `POST /business/subscription/activate-trial`
2. Adicionar campo `hadTrial` no modelo User
3. Adicionar campo `trialEndsAt` no modelo User
4. Criar job/cron para expirar trials automaticamente

### Frontend (Opcional)
1. Substituir `alert()` por toast notifications
2. Adicionar analytics para tracking de ativações
3. A/B testing de diferentes mensagens no modal
