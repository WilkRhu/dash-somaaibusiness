# 📑 Índice - Sistema de Pedidos Internos

## 🚀 Comece Aqui

1. **[Guia de Início Rápido](KITCHEN_ORDERS_QUICK_START.md)** (5 minutos)
   - Como acessar as telas
   - Como testar
   - Exemplos práticos

2. **[Sumário Executivo](../KITCHEN_ORDERS_SUMMARY.md)** (10 minutos)
   - O que foi criado
   - Funcionalidades
   - Próximos passos

## 📚 Documentação Completa

### Para Usuários
- **[Guia Rápido](KITCHEN_ORDERS_README.md)** - Visão geral do sistema
- **[Guia de Início Rápido](KITCHEN_ORDERS_QUICK_START.md)** - Como começar em 5 minutos

### Para Desenvolvedores
- **[Documentação Técnica](KITCHEN_ORDERS_INTEGRATION.md)** - Arquitetura e API
- **[Exemplo de Integração com PDV](KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md)** - Passo a passo
- **[Detalhes de Implementação](../KITCHEN_ORDERS_IMPLEMENTATION.md)** - O que foi criado

## 🗂️ Estrutura de Arquivos

### Tipos
```
lib/types/kitchen-order.ts
├── KitchenOrderStatus (enum)
├── OrderType (enum)
├── KitchenOrder (interface)
├── KitchenOrderItem (interface)
├── KitchenOrderHistory (interface)
├── CreateKitchenOrderDto (interface)
├── UpdateKitchenOrderStatusDto (interface)
└── KitchenOrdersFilters (interface)
```

### API
```
lib/api/kitchen-orders.ts
├── create()
├── list()
├── getById()
├── updateStatus()
├── cancel()
└── getByOrderNumber()
```

### Hook
```
lib/hooks/use-kitchen-orders.ts
├── useKitchenOrders()
├── fetchOrders()
├── createOrder()
├── updateStatus()
├── cancelOrder()
└── getByOrderNumber()
```

### Telas
```
app/(dashboard)/kitchen/
├── display/page.tsx (KDS - Tela da Cozinha)
└── tickets/page.tsx (Tela de Senhas)
```

### Componentes
```
components/kitchen/
├── kitchen-order-card.tsx
└── update-kitchen-order-status-modal.tsx
```

## 🎯 Funcionalidades por Tela

### KDS (Kitchen Display System)
📍 `/kitchen/display`

- [x] 4 colunas por status
- [x] Auto-refresh em tempo real
- [x] Som de alerta
- [x] Indicador de atraso
- [x] Atualizar status
- [x] Ver detalhes
- [x] Controle de som
- [x] Controle de auto-refresh

### Tela de Senhas
📍 `/kitchen/tickets`

- [x] Grid de senhas
- [x] Cores por status
- [x] Clique para detalhes
- [x] Status em tempo real
- [x] Mensagens personalizadas
- [x] Responsiva
- [x] Auto-refresh

## 📊 Fluxo de Dados

```
PDV (Venda)
    ↓
useKitchenOrders.createOrder()
    ↓
POST /kitchen-orders
    ↓
Backend cria pedido
    ↓
KDS atualiza (auto-refresh)
    ↓
Som toca
    ↓
Cozinha atualiza status
    ↓
Tela de senhas atualiza
    ↓
Cliente vê status
```

## 🔌 API Endpoints

```
POST   /business/establishments/{id}/kitchen-orders
GET    /business/establishments/{id}/kitchen-orders
GET    /business/establishments/{id}/kitchen-orders/{id}
PATCH  /business/establishments/{id}/kitchen-orders/{id}/status
POST   /business/establishments/{id}/kitchen-orders/{id}/cancel
GET    /business/establishments/{id}/kitchen-orders/number/{orderNumber}
```

## 🎨 Status e Cores

| Status | Emoji | Cor | Significado |
|--------|-------|-----|-------------|
| PENDING | 🆕 | Vermelho | Recebido |
| CONFIRMED | ✓ | Amarelo | Confirmado |
| PREPARING | 👨‍🍳 | Azul | Preparando |
| READY | ✅ | Verde | Pronto |
| PICKED_UP | 📦 | Cinza | Retirado |
| CANCELLED | ❌ | Cinza | Cancelado |

## 🎯 Tipos de Pedido

| Tipo | Emoji | Uso |
|------|-------|-----|
| COUNTER | 🏪 | Balcão |
| DINE_IN | 🍽️ | Mesa |
| DELIVERY | 🚚 | Entrega |

## 📱 URLs de Acesso

| Tela | URL |
|------|-----|
| KDS | `http://localhost:3000/kitchen/display` |
| Senhas | `http://localhost:3000/kitchen/tickets` |

## 🚀 Como Começar

### 1. Leitura Rápida (5 min)
- Leia: [Guia de Início Rápido](KITCHEN_ORDERS_QUICK_START.md)

### 2. Entender o Sistema (10 min)
- Leia: [Sumário Executivo](../KITCHEN_ORDERS_SUMMARY.md)

### 3. Acessar as Telas (2 min)
- KDS: `http://localhost:3000/kitchen/display`
- Senhas: `http://localhost:3000/kitchen/tickets`

### 4. Integrar com PDV (30 min)
- Leia: [Exemplo de Integração](KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md)
- Siga os passos

### 5. Testar (10 min)
- Crie um pedido no PDV
- Veja na tela KDS
- Atualize o status
- Veja na tela de senhas

## 📚 Documentação por Tópico

### Instalação e Setup
- Nenhuma instalação necessária
- Usa a mesma API base do sistema

### Uso Básico
- [Guia de Início Rápido](KITCHEN_ORDERS_QUICK_START.md)
- [Guia Rápido](KITCHEN_ORDERS_README.md)

### Integração
- [Exemplo de Integração com PDV](KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md)
- [Documentação Técnica](KITCHEN_ORDERS_INTEGRATION.md)

### Desenvolvimento
- [Detalhes de Implementação](../KITCHEN_ORDERS_IMPLEMENTATION.md)
- [Tipos](../lib/types/kitchen-order.ts)
- [API](../lib/api/kitchen-orders.ts)
- [Hook](../lib/hooks/use-kitchen-orders.ts)

### Troubleshooting
- [Guia de Início Rápido - Troubleshooting](KITCHEN_ORDERS_QUICK_START.md#-troubleshooting)
- [Documentação Técnica - Troubleshooting](KITCHEN_ORDERS_INTEGRATION.md#-troubleshooting)

## 🎓 Exemplos

### Criar um Pedido
```typescript
const { createOrder } = useKitchenOrders();

await createOrder({
  orderType: 'counter',
  items: [
    {
      productName: 'Hambúrguer',
      quantity: 2,
      unitPrice: 25.00,
      notes: 'Sem cebola',
      preparationTime: 15,
    },
  ],
  discount: 0,
  notes: 'Cliente com pressa',
  priority: 'high',
});
```

### Atualizar Status
```typescript
const { updateStatus } = useKitchenOrders();

await updateStatus(orderId, {
  status: 'preparing',
  description: 'Começou a preparar',
});
```

### Listar Pedidos
```typescript
const { orders, refetch } = useKitchenOrders({
  status: 'pending',
  limit: 50,
});

await refetch();
```

## 🔧 Configuração

### Variáveis de Ambiente
Nenhuma variável adicional necessária.

### Permissões
- **Cozinha**: Acesso a `/kitchen/display`
- **Atendimento**: Acesso a `/kitchen/tickets`
- **Gerente**: Acesso a ambas

## 📈 Métricas

- Tempo médio de preparo
- Pedidos por hora
- Taxa de cancelamento
- Tempo de espera
- Pedidos por tipo
- Pedidos por prioridade

## 🐛 Troubleshooting

### Pedido não aparece
1. Verificar se backend está rodando
2. Verificar console (F12)
3. Verificar estabelecimento selecionado

### Som não toca
1. Verificar se som está habilitado
2. Clicar na página primeiro
3. Verificar volume

### Tela não atualiza
1. Verificar conexão
2. Clicar em "Atualizar"
3. Recarregar página (F5)

## 📞 Suporte

Para dúvidas:
1. Consulte a documentação
2. Verifique os exemplos
3. Abra uma issue no GitHub

## ✅ Checklist

- [ ] Li o Guia de Início Rápido
- [ ] Acessei a tela KDS
- [ ] Acessei a tela de senhas
- [ ] Integrei com o PDV
- [ ] Criei um pedido de teste
- [ ] Testei o fluxo completo
- [ ] Testei o som
- [ ] Testei a responsividade

## 🎉 Próximos Passos

1. **Integração com PDV** (Próximo)
   - Seguir: [Exemplo de Integração](KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md)

2. **Testes**
   - Testar fluxo completo
   - Testar som
   - Testar responsividade

3. **Deploy**
   - Staging
   - Treinamento
   - Produção

## 📋 Sumário de Arquivos

| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| `lib/types/kitchen-order.ts` | 200 | Tipos e interfaces |
| `lib/api/kitchen-orders.ts` | 60 | API endpoints |
| `lib/hooks/use-kitchen-orders.ts` | 150 | Hook React |
| `app/(dashboard)/kitchen/display/page.tsx` | 350 | Tela KDS |
| `app/(dashboard)/kitchen/tickets/page.tsx` | 300 | Tela de senhas |
| `components/kitchen/kitchen-order-card.tsx` | 150 | Card do pedido |
| `components/kitchen/update-kitchen-order-status-modal.tsx` | 200 | Modal |
| **Documentação** | **1000+** | Guias e exemplos |
| **Total** | **~2.400** | Código + Documentação |

---

**Versão**: 1.0.0
**Status**: ✅ Completo
**Data**: 2024
