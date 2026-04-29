# Sistema de Pedidos Internos (Cozinha) - Documentação

## 📋 Visão Geral

Sistema completo de gerenciamento de pedidos internos para restaurantes, bares e lanchonetes. Inclui:

1. **KDS (Kitchen Display System)** - Tela da cozinha com pedidos organizados por status
2. **Tela de Senhas** - Acompanhamento de pedidos pelo cliente
3. **Integração com PDV** - Criação automática de pedidos ao finalizar venda

## 🏗️ Arquitetura

### Tipos (`lib/types/kitchen-order.ts`)

```typescript
// Status do pedido
enum KitchenOrderStatus {
  PENDING = 'pending',           // Recebido
  CONFIRMED = 'confirmed',       // Confirmado
  PREPARING = 'preparing',       // Preparando
  READY = 'ready',               // Pronto
  PICKED_UP = 'picked_up',       // Retirado
  CANCELLED = 'cancelled',       // Cancelado
}

// Tipo de pedido
enum OrderType {
  COUNTER = 'counter',           // Balcão
  DINE_IN = 'dine_in',           // Mesa
  DELIVERY = 'delivery',         // Entrega
}
```

### API (`lib/api/kitchen-orders.ts`)

Endpoints disponíveis:

```
POST   /business/establishments/{id}/kitchen-orders
GET    /business/establishments/{id}/kitchen-orders
GET    /business/establishments/{id}/kitchen-orders/{id}
PATCH  /business/establishments/{id}/kitchen-orders/{id}/status
POST   /business/establishments/{id}/kitchen-orders/{id}/cancel
GET    /business/establishments/{id}/kitchen-orders/number/{orderNumber}
```

### Hook (`lib/hooks/use-kitchen-orders.ts`)

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
} = useKitchenOrders(filters);
```

## 🎨 Componentes

### 1. KDS - Tela da Cozinha (`app/(dashboard)/kitchen/display/page.tsx`)

Tela em tempo real com 4 colunas:
- **Novo** (Vermelho) - Pedidos recém-chegados
- **Confirmado** (Amarelo) - Pedidos confirmados
- **Preparando** (Azul) - Pedidos em preparo
- **Pronto** (Verde) - Pedidos prontos para retirada

**Recursos:**
- Auto-refresh a cada 3 segundos
- Som de alerta para novos pedidos
- Indicador de atraso (vermelho se passou do tempo estimado)
- Clique no card para atualizar status

### 2. Tela de Senhas (`app/(dashboard)/kitchen/tickets/page.tsx`)

Tela pública para cliente acompanhar seu pedido:
- Grid de senhas grandes e coloridas
- Clique para ver detalhes
- Status em tempo real
- Mensagens personalizadas por status

### 3. Card do Pedido (`components/kitchen/kitchen-order-card.tsx`)

Componente reutilizável que mostra:
- Número do pedido (senha)
- Tipo de pedido (balcão/mesa/entrega)
- Prioridade (baixa/normal/alta)
- Tempo decorrido vs estimado
- Itens do pedido
- Notas especiais
- Dados do cliente

### 4. Modal de Atualização (`components/kitchen/update-kitchen-order-status-modal.tsx`)

Modal para atualizar status com:
- Transições de status válidas
- Campo de observação
- Tempo decorrido
- Confirmação visual

## 🔌 Integração com PDV

### Passo 1: Importar o Hook

```typescript
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
```

### Passo 2: Usar no Checkout

No arquivo `app/(dashboard)/sales/pos/page.tsx`, após finalizar a venda:

```typescript
const { createOrder } = useKitchenOrders();

const handleCheckout = async (paymentMethod: PaymentMethod) => {
  try {
    // ... código existente de criar venda ...
    
    // Criar pedido interno se for balcão ou mesa
    if (orderType === 'counter' || orderType === 'dine_in') {
      await createOrder({
        orderType: orderType,
        tableNumber: tableNumber, // se dine_in
        customerName: selectedCustomer?.name,
        customerPhone: selectedCustomer?.phone,
        items: items.map(item => ({
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          preparationTime: item.preparationTime,
        })),
        discount: discount,
        notes: notes,
        priority: 'normal',
      });
      
      showToast('Pedido enviado para a cozinha!', 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
};
```

### Passo 3: Adicionar Campos ao Carrinho

Estender o tipo de item do carrinho para incluir:

```typescript
interface CartItem {
  // ... campos existentes ...
  notes?: string;              // Acompanhamentos
  preparationTime?: number;    // Tempo estimado
  orderType?: 'counter' | 'dine_in' | 'delivery';
  tableNumber?: number;        // Se dine_in
}
```

## 📊 Fluxo de Pedido

```
PDV (Venda)
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

## 🎯 Casos de Uso

### Restaurante com Mesas

1. Garçom faz pedido no PDV
2. Pedido vai para cozinha com número de mesa
3. Cozinha vê na tela KDS
4. Cliente vê na tela de senhas
5. Quando pronto, garçom retira

### Lanchonete com Balcão

1. Atendente faz pedido no PDV
2. Pedido vai para cozinha com número de senha
3. Cozinha vê na tela KDS
4. Cliente vê na tela de senhas
5. Quando pronto, cliente retira no balcão

### Delivery

1. Pedido criado no PDV ou app
2. Vai para cozinha com número de senha
3. Cozinha prepara
4. Entregador retira quando pronto

## 🔧 Configuração

### Variáveis de Ambiente

Nenhuma variável adicional necessária. Usa a mesma API base do sistema.

### Permissões

Recomenda-se criar roles:
- **Cozinha**: Acesso apenas a `/kitchen/display`
- **Atendimento**: Acesso a `/kitchen/tickets` (público)
- **Gerente**: Acesso a ambas + relatórios

## 📱 Responsividade

- **KDS**: Otimizada para telas grandes (27"+ recomendado)
- **Senhas**: Responsiva, funciona em TV, tablet ou celular
- **PDV**: Integração no fluxo existente

## 🔔 Notificações

### Som de Alerta

Toca automaticamente quando:
- Novo pedido chega (PENDING)
- Pedido pronto (READY)

Pode ser desabilitado com botão "Mudo" na KDS.

### Toast Notifications

Mostra mensagens de sucesso/erro ao:
- Criar pedido
- Atualizar status
- Cancelar pedido

## 📈 Métricas

Dados disponíveis para relatórios:
- Tempo médio de preparo
- Pedidos por hora
- Taxa de cancelamento
- Tempo de espera do cliente
- Pedidos por tipo (balcão/mesa/delivery)

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

## 🚀 Próximas Melhorias

- [ ] Integração com impressora de cupom
- [ ] Relatórios de performance
- [ ] Priorização automática por tempo de espera
- [ ] Integração com app mobile
- [ ] Histórico de pedidos
- [ ] Análise de tempo de preparo por item
- [ ] Notificação push para cliente
- [ ] Integração com sistema de fidelidade

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação da API: `/docs/api`
- Exemplos de código: `/docs/examples`
- Issues: GitHub issues
