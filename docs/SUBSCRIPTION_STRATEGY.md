# Estratégia de Planos e Trial - SomaAI Business

## Visão Geral

Sistema completo de planos de assinatura com trial automático de 10 dias e restrições por funcionalidade.

## Planos Disponíveis

### FREE (Gratuito Vitalício)
- **Preço**: R$ 0,00
- **Limites**:
  - 1 estabelecimento
  - 2 funcionários
  - 50 produtos
- **Funcionalidades**:
  - Dashboard básico
  - Vendas básicas
  - PDV básico
  - Estoque limitado

### TRIAL (10 dias automático)
- **Preço**: R$ 0,00 (temporário)
- **Ativação**: Automática ao criar primeiro estabelecimento
- **Limites** (mesmos do BASIC):
  - 3 estabelecimentos
  - 20 funcionários
  - 1.000 produtos
- **Funcionalidades**:
  - Todas do BASIC
  - Relatórios avançados
  - Sistema de ofertas
  - Gestão de clientes
  - Suporte por email

### BASIC
- **Preço**: R$ 49,90/mês
- **Limites**:
  - 3 estabelecimentos
  - 20 funcionários
  - 1.000 produtos
- **Funcionalidades**:
  - Todas do FREE
  - Relatórios avançados
  - Sistema de ofertas
  - Gestão de clientes
  - Suporte por email

### PREMIUM
- **Preço**: R$ 149,90/mês
- **Limites**:
  - 10 estabelecimentos
  - 100 funcionários
  - Produtos ilimitados
- **Funcionalidades**:
  - Todas do BASIC
  - Gestão de fornecedores
  - Integração fiscal (NFe/NFCe)
  - Suporte prioritário
  - API access

### ENTERPRISE
- **Preço**: Sob consulta
- **Limites**: Todos ilimitados
- **Funcionalidades**:
  - Todas do PREMIUM
  - Customizações
  - Suporte dedicado
  - SLA garantido

## Fluxo do Trial

### 1. Ativação Automática
```
Usuário cria conta → Plano FREE
↓
Cria primeiro estabelecimento → Trial ativado automaticamente
↓
10 dias com recursos BASIC
```

### 2. Durante o Trial
- **Modal de boas-vindas**: Aparece a cada login (1x por dia)
- **Banner superior**: Mostra dias restantes constantemente
- **Últimos 3 dias**: Avisos mais urgentes

### 3. Após Expiração
```
Trial expira → Volta para FREE
↓
Limites reduzidos aplicados
↓
Estabelecimentos existentes permanecem ativos
↓
Não pode criar novos até fazer upgrade
```

## Restrições de Rotas

### Rotas Liberadas (FREE)
- ✅ `/home` - Dashboard
- ✅ `/establishments` - Estabelecimentos
- ✅ `/inventory` - Estoque
- ✅ `/sales` - Vendas
- ✅ `/sales/pos` - PDV
- ✅ `/members` - Funcionários (limitado)
- ✅ `/subscription` - Planos

### Rotas Restritas (TRIAL/BASIC+)
- 🔒 `/reports` - Relatórios avançados
- 🔒 `/offers` - Sistema de ofertas
- 🔒 `/customers` - Gestão de clientes

### Rotas Restritas (PREMIUM+)
- 🔒 `/suppliers` - Gestão de fornecedores

## Componentes Implementados

### 1. TrialWelcomeModal
Modal que aparece a cada login durante o trial.

**Localização**: `components/subscription/trial-welcome-modal.tsx`

**Comportamento**:
- Mostra uma vez por dia (24h)
- Armazena última exibição no localStorage
- Muda visual nos últimos 3 dias
- Botão para explorar recursos ou ver planos

### 2. TrialBanner
Banner fixo no topo mostrando dias restantes.

**Localização**: `components/subscription/trial-banner.tsx`

**Comportamento**:
- Sempre visível durante o trial
- Gradiente azul/roxo (dias normais)
- Gradiente laranja/vermelho (últimos 3 dias)
- Botão para ver planos

### 3. UpgradeRequiredModal
Modal exibido ao tentar acessar rota restrita.

**Localização**: `components/subscription/upgrade-required-modal.tsx`

**Comportamento**:
- Aparece ao clicar em rota bloqueada
- Mostra plano necessário
- Redireciona para home após 5s
- Botão para ver planos

### 4. Sidebar com Cadeados
Sidebar mostra ícone de cadeado em rotas restritas.

**Localização**: `components/dashboard/sidebar.tsx`

**Comportamento**:
- Ícone de cadeado em rotas bloqueadas
- Cor cinza para itens restritos
- Ainda clicável (abre modal de upgrade)

## Hooks Implementados

### useTrialModal
Gerencia exibição do modal de trial.

**Localização**: `lib/hooks/use-trial-modal.ts`

**Retorna**:
- `showModal`: Se deve mostrar o modal
- `closeModal`: Função para fechar
- `daysRemaining`: Dias restantes do trial
- `isOnTrial`: Se está em trial

### useRouteProtection
Protege rotas baseado no plano.

**Localização**: `lib/hooks/use-route-protection.ts`

**Retorna**:
- `showUpgradeModal`: Se deve mostrar modal de upgrade
- `closeModal`: Função para fechar
- `restriction`: Informações da restrição
- `userPlan`: Plano atual do usuário

## Utilitários

### plan-restrictions.ts
Funções para verificar acesso a rotas e features.

**Localização**: `lib/utils/plan-restrictions.ts`

**Funções principais**:
```typescript
// Verificar se pode acessar rota
canAccessRoute(path: string, userPlan: SubscriptionPlan)

// Verificar se feature está disponível
isFeatureAvailable(feature: string, userPlan: SubscriptionPlan)

// Obter plano necessário para rota
getRequiredPlanForRoute(path: string)

// Nome amigável do plano
getPlanDisplayName(plan: SubscriptionPlan)
```

## Tipos Atualizados

### SubscriptionPlan (enum)
```typescript
export enum SubscriptionPlan {
  FREE = 'FREE',
  TRIAL = 'TRIAL',      // NOVO
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}
```

### User (interface)
```typescript
interface User {
  // ... campos existentes
  subscriptionPlan?: SubscriptionPlan;
  trialEndsAt?: string | null;        // NOVO
  trialDaysRemaining?: number;        // NOVO
}
```

### UserSubscription (interface)
```typescript
interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trial'; // 'trial' NOVO
  // ... outros campos
  trialEndsAt?: string | null;        // NOVO
  trialDaysRemaining?: number;        // NOVO
}
```

## Integração com Backend

### Campos Esperados na API

#### GET /api/business/subscription/status
```json
{
  "currentPlan": "TRIAL",
  "isOnTrial": true,
  "trialEndsAt": "2026-03-10T20:00:00.000Z",
  "trialDaysRemaining": 7,
  "limits": {
    "establishments": 3,
    "employees": 20,
    "products": 1000
  },
  "usage": {
    "establishments": 1
  }
}
```

#### GET /api/auth/me
```json
{
  "id": "user-id",
  "name": "Nome",
  "email": "email@example.com",
  "subscriptionPlan": "TRIAL",
  "trialEndsAt": "2026-03-10T20:00:00.000Z",
  "trialDaysRemaining": 7
}
```

### Ativação do Trial (Backend)
Quando o usuário criar o primeiro estabelecimento:
```typescript
// Pseudo-código backend
if (user.establishmentsCount === 0) {
  user.subscriptionPlan = 'TRIAL';
  user.trialEndsAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // +10 dias
  await user.save();
}
```

### Expiração do Trial (Backend)
Job diário para verificar trials expirados:
```typescript
// Pseudo-código backend
const expiredTrials = await User.find({
  subscriptionPlan: 'TRIAL',
  trialEndsAt: { $lt: new Date() }
});

for (const user of expiredTrials) {
  user.subscriptionPlan = 'FREE';
  user.trialEndsAt = null;
  await user.save();
}
```

## Testes Recomendados

### 1. Fluxo Completo do Trial
- [ ] Criar conta nova
- [ ] Verificar plano FREE
- [ ] Criar primeiro estabelecimento
- [ ] Verificar ativação do trial
- [ ] Ver modal de boas-vindas
- [ ] Ver banner no topo
- [ ] Acessar rotas premium (deve funcionar)
- [ ] Aguardar expiração (ou simular)
- [ ] Verificar volta para FREE
- [ ] Tentar acessar rotas premium (deve bloquear)

### 2. Modal de Trial
- [ ] Aparece no primeiro login após ativação
- [ ] Não aparece novamente no mesmo dia
- [ ] Aparece no dia seguinte
- [ ] Visual diferente nos últimos 3 dias
- [ ] Botão "Ver Planos" funciona
- [ ] Botão "Fechar" funciona

### 3. Restrições de Rotas
- [ ] FREE não acessa /reports
- [ ] FREE não acessa /offers
- [ ] FREE não acessa /customers
- [ ] FREE não acessa /suppliers
- [ ] TRIAL acessa /reports, /offers, /customers
- [ ] TRIAL não acessa /suppliers
- [ ] BASIC+ acessa tudo exceto /suppliers
- [ ] PREMIUM+ acessa tudo

### 4. Sidebar
- [ ] Mostra cadeado em rotas restritas
- [ ] Cor cinza para itens bloqueados
- [ ] Clicar abre modal de upgrade
- [ ] Modal mostra plano necessário

## Próximos Passos

### 1. Backend
- [ ] Implementar ativação automática do trial
- [ ] Job para expirar trials
- [ ] Endpoint de status do trial
- [ ] Validação de limites no backend

### 2. Página de Assinatura
- [ ] Criar `/subscription` completa
- [ ] Comparação de planos
- [ ] Integração com gateway de pagamento
- [ ] Fluxo de upgrade/downgrade

### 3. Melhorias
- [ ] Email de boas-vindas ao trial
- [ ] Email 3 dias antes de expirar
- [ ] Email no dia da expiração
- [ ] Notificações in-app
- [ ] Analytics de conversão

## Configuração de Desenvolvimento

Para testar o trial localmente, você pode simular um usuário em trial:

```typescript
// No auth-store ou diretamente no localStorage
const mockUser = {
  id: '1',
  name: 'Teste',
  email: 'teste@example.com',
  subscriptionPlan: SubscriptionPlan.TRIAL,
  trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 dias
  trialDaysRemaining: 7,
};
```

Para testar últimos dias do trial:
```typescript
trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // +2 dias
trialDaysRemaining: 2,
```

## Resumo da Implementação

✅ Plano TRIAL adicionado aos tipos
✅ Limites do FREE reduzidos (1 estab, 2 func, 50 prod)
✅ Modal de trial com exibição diária
✅ Banner de trial no topo
✅ Sistema de restrição de rotas
✅ Modal de upgrade necessário
✅ Sidebar com cadeados
✅ Hooks para gerenciar trial e proteção
✅ Utilitários para verificar acesso
✅ Integração com layout do dashboard

**Tudo pronto para integração com o backend!**
