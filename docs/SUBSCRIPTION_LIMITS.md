# Limites por Plano de Assinatura

## Visão Geral
O sistema implementa limites baseados em planos de assinatura para controlar o uso de recursos.

## Planos Disponíveis

### FREE (Gratuito)
- ✅ 1 estabelecimento
- ✅ 5 funcionários
- ✅ 100 produtos no inventário
- ✅ Funcionalidades básicas

### BASIC
- ✅ 3 estabelecimentos
- ✅ 20 funcionários
- ✅ 1.000 produtos no inventário
- ✅ Relatórios avançados
- ✅ Suporte por email
- 💰 R$ 49,90/mês

### PREMIUM
- ✅ 10 estabelecimentos
- ✅ 100 funcionários
- ✅ Produtos ilimitados
- ✅ Integração fiscal (NFe/NFCe)
- ✅ Suporte prioritário
- ✅ API access
- 💰 R$ 149,90/mês

### ENTERPRISE
- ✅ Estabelecimentos ilimitados
- ✅ Funcionários ilimitados
- ✅ Produtos ilimitados
- ✅ Customizações
- ✅ Suporte dedicado
- ✅ SLA garantido
- 💰 Sob consulta

## Implementação Frontend

### Tipos e Constantes

#### `lib/types/subscription.ts`
```typescript
export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE: {
    establishments: 1,
    employees: 5,
    products: 100,
  },
  // ... outros planos
};
```

### Utilitários de Validação

#### `lib/utils/subscription.ts`
```typescript
// Verificar se atingiu o limite
export const hasReachedLimit = (current: number, limit: number | null): boolean => {
  if (limit === null) return false; // ilimitado
  return current >= limit;
};

// Validar criação de estabelecimento
export const canCreateEstablishment = (
  currentCount: number,
  plan: SubscriptionPlan
): { allowed: boolean; message?: string } => {
  const limit = PLAN_LIMITS[plan].establishments;
  
  if (hasReachedLimit(currentCount, limit)) {
    return {
      allowed: false,
      message: `Você atingiu o limite de ${limit} estabelecimento(s) do plano ${plan}.`,
    };
  }
  
  return { allowed: true };
};
```

### Componentes

#### UsageLimitsCard
Exibe o uso atual e limites do plano com barras de progresso.

```typescript
<UsageLimitsCard
  plan={SubscriptionPlan.FREE}
  usage={{ establishments: 1, employees: 3, products: 45 }}
  limits={{ establishments: 1, employees: 5, products: 100 }}
  onUpgrade={() => router.push('/subscription')}
/>
```

#### LimitReachedModal
Modal exibido quando o usuário tenta exceder um limite.

```typescript
<LimitReachedModal
  isOpen={showLimitModal}
  onClose={() => setShowLimitModal(false)}
  currentPlan={SubscriptionPlan.FREE}
  limitType="establishments"
  currentLimit={1}
  onUpgrade={() => router.push('/subscription')}
/>
```

### Validação na Criação

#### Estabelecimentos
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validar limite do plano
  const userPlan = user?.subscriptionPlan || SubscriptionPlan.FREE;
  const limitCheck = canCreateEstablishment(establishmentsCount, userPlan);
  
  if (!limitCheck.allowed) {
    setShowLimitModal(true);
    return;
  }
  
  // Continuar com a criação...
};
```

## Integração com Backend

### Campo no Usuário
O backend deve retornar o plano do usuário:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}
```

### Validação no Backend
O backend valida automaticamente ao tentar criar recursos:

```json
{
  "success": false,
  "statusCode": 403,
  "code": "FORBIDDEN",
  "message": "Você atingiu o limite de 1 estabelecimento(s) do plano FREE. Faça upgrade para criar mais estabelecimentos."
}
```

## Fluxo de Upgrade

1. Usuário tenta criar recurso além do limite
2. Sistema exibe modal com informações do próximo plano
3. Usuário clica em "Fazer Upgrade"
4. Redirecionado para `/subscription`
5. Escolhe novo plano e realiza pagamento
6. Sistema atualiza `subscriptionPlan` do usuário
7. Novos limites são aplicados imediatamente

## Indicadores Visuais

### Níveis de Alerta
- **Safe (0-74%)**: Barra azul
- **Warning (75-89%)**: Barra amarela + aviso
- **Danger (90-100%)**: Barra vermelha + alerta

### Mensagens
- 75-89%: "⚠️ Atenção ao limite"
- 90-100%: "⚠️ Limite quase atingido!"
- 100%: Modal de upgrade

## Testes Recomendados

1. ✅ Tentar criar 2 estabelecimentos no plano FREE → Deve bloquear
2. ✅ Fazer upgrade para BASIC → Deve permitir até 3
3. ✅ Deletar estabelecimento → Deve liberar espaço no limite
4. ✅ Estabelecimento inativo → Não deve contar no limite
5. ✅ Plano ENTERPRISE → Deve permitir ilimitado

## Configuração de Desenvolvimento

Para testes, você pode temporariamente aumentar os limites:

```typescript
// lib/types/subscription.ts
FREE: {
  establishments: 999, // Para testes
  employees: 999,
  products: 999,
}
```

## Próximos Passos

### 1. Implementar Validação em Outros Recursos
- [ ] Limite de funcionários ao adicionar membro
- [ ] Limite de produtos ao adicionar ao inventário
- [ ] Limite de vendas mensais (se aplicável)

### 2. Página de Assinatura
- [ ] Criar `/subscription` com comparação de planos
- [ ] Integrar gateway de pagamento
- [ ] Implementar upgrade/downgrade

### 3. Monitoramento
- [ ] Adicionar logs quando usuários atingem limites
- [ ] Dashboard de uso para administradores
- [ ] Alertas proativos antes de atingir limites

## Exemplo de Uso Completo

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SubscriptionPlan, PLAN_LIMITS } from '@/lib/types/subscription';
import { canCreateEstablishment } from '@/lib/utils/subscription';
import { LimitReachedModal } from '@/components/subscription/limit-reached-modal';
import { UsageLimitsCard } from '@/components/subscription/usage-limits-card';

export function MyComponent() {
  const { user } = useAuthStore();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [establishmentsCount, setEstablishmentsCount] = useState(0);
  
  const userPlan = user?.subscriptionPlan || SubscriptionPlan.FREE;
  const planLimits = PLAN_LIMITS[userPlan];
  
  const handleCreate = () => {
    const limitCheck = canCreateEstablishment(establishmentsCount, userPlan);
    
    if (!limitCheck.allowed) {
      setShowLimitModal(true);
      return;
    }
    
    // Criar recurso...
  };
  
  return (
    <>
      <UsageLimitsCard
        plan={userPlan}
        usage={{ establishments: establishmentsCount, employees: 5, products: 50 }}
        limits={planLimits}
        onUpgrade={() => router.push('/subscription')}
      />
      
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentPlan={userPlan}
        limitType="establishments"
        currentLimit={planLimits.establishments || 0}
        onUpgrade={() => router.push('/subscription')}
      />
      
      <button onClick={handleCreate}>Criar Estabelecimento</button>
    </>
  );
}
```
