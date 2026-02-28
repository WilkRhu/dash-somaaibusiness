# API de Assinatura Business

## Visão Geral

Endpoints para consultar e gerenciar planos de assinatura do módulo Business.

## Endpoints

### 1. Consultar Status do Plano

Retorna informações sobre o plano atual do usuário, incluindo limites, uso e status do trial.

```http
GET /api/business/subscription/status
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "currentPlan": "BASIC",
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
    },
    "canCreateEstablishment": true
  }
}
```

**Campos da Resposta:**
- `currentPlan`: Plano efetivo atual (FREE, BASIC, PREMIUM, ENTERPRISE)
- `isOnTrial`: Se está em período de teste
- `trialEndsAt`: Data de término do trial (ISO 8601)
- `trialDaysRemaining`: Dias restantes do trial
- `limits`: Limites do plano atual
  - `establishments`: Número máximo de estabelecimentos (-1 = ilimitado)
  - `employees`: Número máximo de funcionários (-1 = ilimitado)
  - `products`: Número máximo de produtos (-1 = ilimitado)
- `usage`: Uso atual dos recursos
  - `establishments`: Número de estabelecimentos criados
- `canCreateEstablishment`: Se pode criar mais estabelecimentos

**Exemplo - Usuário no Trial:**
```json
{
  "currentPlan": "BASIC",
  "isOnTrial": true,
  "trialEndsAt": "2026-03-10T20:00:00.000Z",
  "trialDaysRemaining": 7,
  "limits": {
    "establishments": 3,
    "employees": 20,
    "products": 1000
  },
  "usage": {
    "establishments": 2
  },
  "canCreateEstablishment": true
}
```

**Exemplo - Trial Expirado:**
```json
{
  "currentPlan": "FREE",
  "isOnTrial": false,
  "trialEndsAt": null,
  "trialDaysRemaining": 0,
  "limits": {
    "establishments": 1,
    "employees": 5,
    "products": 100
  },
  "usage": {
    "establishments": 1
  },
  "canCreateEstablishment": false
}
```

### 2. Listar Planos Disponíveis

Retorna todos os planos disponíveis com preços e recursos.

```http
GET /api/business/subscription/plans
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "FREE",
      "name": "Gratuito",
      "price": 0,
      "interval": "lifetime",
      "features": [
        "1 estabelecimento",
        "5 funcionários",
        "100 produtos",
        "Funcionalidades básicas"
      ],
      "limits": {
        "establishments": 1,
        "employees": 5,
        "products": 100
      }
    },
    {
      "id": "BASIC",
      "name": "Básico",
      "price": 49.90,
      "interval": "monthly",
      "features": [
        "3 estabelecimentos",
        "20 funcionários",
        "1.000 produtos",
        "Relatórios avançados",
        "Suporte por email"
      ],
      "limits": {
        "establishments": 3,
        "employees": 20,
        "products": 1000
      },
      "recommended": true
    },
    {
      "id": "PREMIUM",
      "name": "Premium",
      "price": 149.90,
      "interval": "monthly",
      "features": [
        "10 estabelecimentos",
        "100 funcionários",
        "Produtos ilimitados",
        "Integração fiscal (NFe/NFCe)",
        "Suporte prioritário",
        "API access"
      ],
      "limits": {
        "establishments": 10,
        "employees": 100,
        "products": -1
      }
    },
    {
      "id": "ENTERPRISE",
      "name": "Enterprise",
      "price": null,
      "interval": "custom",
      "features": [
        "Estabelecimentos ilimitados",
        "Funcionários ilimitados",
        "Produtos ilimitados",
        "Customizações",
        "Suporte dedicado",
        "SLA garantido"
      ],
      "limits": {
        "establishments": -1,
        "employees": -1,
        "products": -1
      },
      "contactSales": true
    }
  ]
}
```

## Uso no Frontend

### Verificar se pode criar estabelecimento

```typescript
const response = await fetch('/api/business/subscription/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();

if (!data.canCreateEstablishment) {
  alert(`Você atingiu o limite de ${data.limits.establishments} estabelecimento(s)`);
  // Mostrar modal de upgrade
}
```

### Mostrar banner de trial

```typescript
const { data } = await getSubscriptionStatus();

if (data.isOnTrial && data.trialDaysRemaining > 0) {
  showBanner(
    `Você tem ${data.trialDaysRemaining} dias restantes no seu período de teste. 
     Aproveite os recursos do plano ${data.currentPlan}!`
  );
}

if (data.isOnTrial && data.trialDaysRemaining <= 3) {
  showWarning(
    `Seu período de teste termina em ${data.trialDaysRemaining} dias. 
     Faça upgrade para continuar usando todos os recursos.`
  );
}
```

### Exibir planos para upgrade

```typescript
const { data: plans } = await getAvailablePlans();

plans.forEach(plan => {
  if (plan.recommended) {
    // Destacar plano recomendado
  }
  
  if (plan.contactSales) {
    // Mostrar botão "Falar com vendas"
  } else {
    // Mostrar botão "Assinar por R$ {plan.price}"
  }
});
```

## Fluxo de Trial

1. **Usuário cria primeiro estabelecimento**
   - Trial ativado automaticamente
   - `isOnTrial: true`
   - `currentPlan: "BASIC"`
   - `trialDaysRemaining: 10`

2. **Durante o trial (dias 1-10)**
   - Pode criar até 3 estabelecimentos
   - Acesso a recursos do BASIC
   - Banner mostrando dias restantes

3. **Últimos 3 dias do trial**
   - Mostrar aviso de expiração
   - Sugerir upgrade

4. **Trial expira**
   - `isOnTrial: false`
   - `currentPlan: "FREE"`
   - Limites reduzidos para FREE
   - Estabelecimentos existentes permanecem ativos
   - Não pode criar novos até fazer upgrade

## Códigos de Erro

- `401 Unauthorized`: Token inválido ou expirado
- `404 Not Found`: Usuário não encontrado
