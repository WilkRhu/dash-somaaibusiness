# Como Testar o Modal de Trial

## Problema Resolvido

O backend estava retornando `planType: "free"` (lowercase), mas o frontend esperava `subscriptionPlan: "FREE"` (uppercase). Agora o auth store normaliza automaticamente o plano.

## Novidade: Modal de Sucesso

Agora quando o trial é ativado, em vez de um alert simples, aparece um modal bonito com:
- ✅ Animação de sucesso
- 🎉 Mensagem de celebração
- 📋 Lista de recursos desbloqueados
- ⏰ Contador de dias restantes
- 🔔 Lembrete sobre expiração

## Passos para Testar

### 1. Resetar o Modal (se já foi dispensado)

Abra o console do navegador (F12) e execute:

```javascript
localStorage.removeItem('trial_modal_dismissed');
location.reload();
```

### 2. Verificar os Logs

Após recarregar, você verá logs no console:

```
🔍 useTrialModal - Verificando condições: {
  user: {...},
  subscriptionPlan: "FREE",
  expectedPlan: "FREE",
  isMatch: true
}
✅ Modal será exibido em 2 segundos
🎉 Exibindo modal de trial
```

### 3. O Modal Deve Aparecer

Após 2 segundos, o modal deve aparecer com:
- Título: "Experimente Grátis!"
- Lista de benefícios (3 estabelecimentos, 20 funcionários, etc.)
- Botão "Ativar Trial Grátis"
- Botão "Agora Não"

## Troubleshooting

### Modal não aparece

**Verifique no console:**

1. **Usuário não é FREE:**
   ```
   ❌ Modal não será exibido - usuário não é FREE
   ```
   **Solução:** Seu plano precisa ser FREE. Verifique o retorno da API `/auth/me`

2. **Modal já foi dispensado:**
   ```
   ❌ Modal não será exibido - já foi dispensado
   ```
   **Solução:** Execute no console:
   ```javascript
   localStorage.removeItem('trial_modal_dismissed');
   location.reload();
   ```

3. **Campo subscriptionPlan não existe:**
   ```
   subscriptionPlan: undefined
   ```
   **Solução:** O auth store agora normaliza automaticamente o `planType` do backend

### Testar Ativação do Trial

1. Clique em "Ativar Trial Grátis"
2. O botão deve mostrar "Ativando..." com spinner
3. Se o backend retornar sucesso:
   - Modal de boas-vindas fecha
   - **Modal de sucesso aparece** com animação
   - Dados do usuário são recarregados
   - Ao fechar o modal de sucesso, o banner de trial aparece no topo
4. Se houver erro:
   - Alert com mensagem de erro

## Fluxo Completo

```
1. Usuário FREE entra no dashboard
   ↓
2. Após 2 segundos, modal de boas-vindas aparece
   ↓
3. Usuário clica em "Ativar Trial Grátis"
   ↓
4. Loading state (botão mostra "Ativando...")
   ↓
5. API retorna sucesso
   ↓
6. Modal de boas-vindas fecha
   ↓
7. Modal de sucesso aparece (novo!)
   ↓
8. Usuário clica em "Começar a Explorar" ou "Ver Planos"
   ↓
9. Banner de trial aparece no topo do dashboard
```

## Mapeamento de Planos

O sistema agora mapeia automaticamente:

| Backend (planType) | Frontend (subscriptionPlan) |
|-------------------|----------------------------|
| "free"            | SubscriptionPlan.FREE      |
| "trial"           | SubscriptionPlan.TRIAL     |
| "basic"           | SubscriptionPlan.BASIC     |
| "premium"         | SubscriptionPlan.PREMIUM   |
| "enterprise"      | SubscriptionPlan.ENTERPRISE|

## Dados do Seu Usuário

Baseado no JSON que você forneceu:

```json
{
  "planType": "free",  // ← Backend
  "planExpiresAt": "2026-03-15T03:27:50.000Z"
}
```

Agora é normalizado para:

```javascript
{
  subscriptionPlan: "FREE",  // ← Frontend
  planType: "free"           // ← Mantido para compatibilidade
}
```

## Próximos Passos

Após o modal aparecer e você clicar em "Ativar Trial Grátis":

1. O frontend chama: `POST /business/subscription/activate-trial`
2. O backend deve:
   - Mudar `planType` de "free" para "trial"
   - Definir `trialEndsAt` = hoje + 10 dias
   - Marcar `hadTrial = true`
3. O frontend recarrega os dados do usuário
4. O banner de trial aparece no topo do dashboard
