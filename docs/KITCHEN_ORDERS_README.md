# 🍳 Sistema de Pedidos Internos (Cozinha)

## O que foi criado?

Um sistema completo de gerenciamento de pedidos internos para restaurantes, bares e lanchonetes com:

### 1. **KDS - Kitchen Display System** 
📍 `/app/(dashboard)/kitchen/display`

Tela em tempo real para a cozinha com 4 colunas:
- **Novo** (Vermelho) - Pedidos recém-chegados
- **Confirmado** (Amarelo) - Pedidos confirmados
- **Preparando** (Azul) - Pedidos em preparo
- **Pronto** (Verde) - Pedidos prontos

**Recursos:**
- ✅ Auto-refresh a cada 3 segundos
- 🔊 Som de alerta para novos pedidos
- ⏱️ Indicador de atraso (vermelho se passou do tempo)
- 👆 Clique no card para atualizar status

### 2. **Tela de Senhas**
📍 `/app/(dashboard)/kitchen/tickets`

Tela pública para cliente acompanhar seu pedido:
- 🎫 Grid de senhas grandes e coloridas
- 📊 Status em tempo real
- 💬 Mensagens personalizadas por status
- 📱 Responsiva (funciona em TV, tablet, celular)

### 3. **Integração com PDV**
📍 Modificações em `app/(dashboard)/sales/pos/page.tsx`

Quando a venda é finalizada:
- Cria automaticamente um pedido interno
- Envia para a cozinha
- Gera número de senha
- Toca som de alerta

## 📁 Arquivos Criados

```
lib/
├── types/
│   └── kitchen-order.ts              # Tipos e enums
├── api/
│   └── kitchen-orders.ts             # API endpoints
└── hooks/
    └── use-kitchen-orders.ts         # Hook para gerenciar pedidos

app/(dashboard)/kitchen/
├── display/
│   └── page.tsx                      # Tela KDS
└── tickets/
    └── page.tsx                      # Tela de senhas

components/kitchen/
├── kitchen-order-card.tsx            # Card do pedido
└── update-kitchen-order-status-modal.tsx  # Modal de atualização

docs/
├── KITCHEN_ORDERS_INTEGRATION.md     # Documentação completa
└── KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md  # Exemplo de integração
```

## 🚀 Como Usar

### 1. Acessar a Tela da Cozinha

```
http://localhost:3000/kitchen/display
```

Você verá 4 colunas com os pedidos organizados por status.

### 2. Acessar a Tela de Senhas

```
http://localhost:3000/kitchen/tickets
```

Clientes podem acompanhar seus pedidos aqui.

### 3. Integrar com PDV

Veja o arquivo `docs/KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md` para instruções passo a passo.

## 📊 Fluxo de Pedido

```
PDV (Venda Finalizada)
        ↓
Criar Pedido Interno (PENDING)
        ↓
Cozinha Confirma (CONFIRMED)
        ↓
Cozinha Começa Preparo (PREPARING)
        ↓
Cozinha Marca Pronto (READY)
        ↓
Cliente Retira (PICKED_UP)
```

## 🎯 Status do Pedido

| Status | Emoji | Cor | Significado |
|--------|-------|-----|-------------|
| PENDING | 🆕 | Vermelho | Recebido, aguardando confirmação |
| CONFIRMED | ✓ | Amarelo | Confirmado, pode começar a preparar |
| PREPARING | 👨‍🍳 | Azul | Preparando |
| READY | ✅ | Verde | Pronto para retirada |
| PICKED_UP | 📦 | Cinza | Retirado pelo cliente |
| CANCELLED | ❌ | Cinza | Cancelado |

## 🔧 Tipos de Pedido

| Tipo | Emoji | Uso |
|------|-------|-----|
| COUNTER | 🏪 | Balcão (retirada no local) |
| DINE_IN | 🍽️ | Comer no local (mesa) |
| DELIVERY | 🚚 | Entrega |

## 📱 Responsividade

- **KDS**: Otimizada para telas grandes (27"+ recomendado)
- **Senhas**: Responsiva, funciona em qualquer dispositivo
- **PDV**: Integração no fluxo existente

## 🔌 API Endpoints

```
POST   /business/establishments/{id}/kitchen-orders
GET    /business/establishments/{id}/kitchen-orders
GET    /business/establishments/{id}/kitchen-orders/{id}
PATCH  /business/establishments/{id}/kitchen-orders/{id}/status
POST   /business/establishments/{id}/kitchen-orders/{id}/cancel
GET    /business/establishments/{id}/kitchen-orders/number/{orderNumber}
```

## 🎨 Componentes Principais

### `useKitchenOrders(filters?)`

Hook para gerenciar pedidos internos:

```typescript
const {
  orders,           // Array de pedidos
  isLoading,        // Carregando?
  error,            // Erro?
  pagination,       // Paginação
  refetch,          // Recarregar
  createOrder,      // Criar pedido
  updateStatus,     // Atualizar status
  cancelOrder,      // Cancelar pedido
  getByOrderNumber, // Buscar por número
} = useKitchenOrders();
```

### `KitchenOrderCard`

Componente que mostra um card do pedido:

```typescript
<KitchenOrderCard
  order={order}
  onSelect={() => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  }}
/>
```

### `UpdateKitchenOrderStatusModal`

Modal para atualizar status:

```typescript
<UpdateKitchenOrderStatusModal
  order={selectedOrder}
  onClose={() => setShowUpdateModal(false)}
  onStatusUpdate={handleStatusUpdate}
/>
```

## 💡 Exemplos de Uso

### Criar um Pedido

```typescript
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';

const { createOrder } = useKitchenOrders();

const newOrder = await createOrder({
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

console.log(`Pedido #${newOrder.orderNumber} criado!`);
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

// Recarregar
await refetch();
```

## 🔔 Notificações

### Som de Alerta

Toca automaticamente quando novo pedido chega. Pode ser desabilitado com botão "Mudo" na KDS.

### Toast Notifications

Mostra mensagens de sucesso/erro ao criar, atualizar ou cancelar pedidos.

## 📈 Próximas Melhorias

- [ ] Integração com impressora de cupom
- [ ] Relatórios de performance
- [ ] Priorização automática por tempo de espera
- [ ] Integração com app mobile
- [ ] Histórico de pedidos
- [ ] Análise de tempo de preparo por item
- [ ] Notificação push para cliente
- [ ] Integração com sistema de fidelidade

## 📚 Documentação

- **Documentação Completa**: `docs/KITCHEN_ORDERS_INTEGRATION.md`
- **Exemplo de Integração com PDV**: `docs/KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md`
- **Tipos**: `lib/types/kitchen-order.ts`
- **API**: `lib/api/kitchen-orders.ts`
- **Hook**: `lib/hooks/use-kitchen-orders.ts`

## 🐛 Troubleshooting

### Pedido não aparece na cozinha

1. Verificar se o backend está respondendo
2. Verificar se o estabelecimento está selecionado
3. Verificar permissões do usuário

### Som não toca

1. Verificar se som está habilitado no navegador
2. Verificar se o navegador permite autoplay de áudio
3. Tentar clicar na página primeiro

### Status não atualiza em tempo real

1. Verificar conexão de internet
2. Verificar se auto-refresh está ativado
3. Clicar em "Atualizar" manualmente

## ✅ Checklist de Implementação

- [x] Tipos criados
- [x] API criada
- [x] Hook criado
- [x] Tela KDS criada
- [x] Tela de senhas criada
- [x] Componentes criados
- [ ] Integração com PDV (próximo passo)
- [ ] Testes
- [ ] Deploy

## 🎓 Próximos Passos

1. **Integrar com PDV**: Seguir `docs/KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md`
2. **Testar**: Criar alguns pedidos e verificar fluxo
3. **Treinar equipe**: Mostrar como usar as telas
4. **Deploy**: Colocar em produção
5. **Monitorar**: Coletar feedback e melhorar

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação
2. Verifique os exemplos
3. Abra uma issue no GitHub
