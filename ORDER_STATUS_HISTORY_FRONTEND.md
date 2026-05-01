# Implementação Frontend - Histórico de Status de Pedidos

## 📋 Resumo

Implementação completa do frontend para consumir o histórico de mudanças de status de pedidos da cozinha. Inclui tipos, API service, hooks, componentes e exemplos de uso.

## 🏗️ Estrutura Criada

### 1. **Types** (`lib/types/kitchen-order.ts`)
```typescript
export interface OrderStatusChange {
  id: string;
  previousStatus: KitchenOrderStatus;
  newStatus: KitchenOrderStatus;
  changedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}
```

### 2. **API Service** (`lib/api/kitchen-orders.ts`)
Novo método adicionado:
```typescript
getStatusHistory: async (
  establishmentId: string,
  orderId: string
): Promise<OrderStatusChange[]>
```

### 3. **Hook** (`lib/hooks/use-order-status-history.ts`)
```typescript
export function useOrderStatusHistory(orderId?: string) {
  const { history, isLoading, error, fetchHistory } = useOrderStatusHistory(orderId);
  // ...
}
```

### 4. **Componentes**

#### `components/kitchen/order-status-history.tsx`
Exibe o histórico em formato de timeline com:
- Status anterior → novo status
- Quem fez a mudança
- Quando foi feita (tempo relativo)

#### `components/kitchen/order-status-history-modal.tsx`
Modal que encapsula o componente de histórico

#### `components/kitchen/kitchen-order-card-with-history.tsx`
Versão estendida do card com botão de histórico (aparece ao passar o mouse)

## 🚀 Como Usar

### Opção 1: Componente Simples (Timeline)
```tsx
import OrderStatusHistory from '@/components/kitchen/order-status-history';

export default function MyPage() {
  return (
    <OrderStatusHistory orderId="order-123" />
  );
}
```

### Opção 2: Modal
```tsx
import { useState } from 'react';
import OrderStatusHistoryModal from '@/components/kitchen/order-status-history-modal';

export default function MyPage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <button onClick={() => setShowHistory(true)}>
        Ver Histórico
      </button>
      
      <OrderStatusHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        orderId="order-123"
        orderNumber="001"
      />
    </>
  );
}
```

### Opção 3: Card com Histórico Integrado
```tsx
import KitchenOrderCardWithHistory from '@/components/kitchen/kitchen-order-card-with-history';

export default function MyPage() {
  return (
    <KitchenOrderCardWithHistory
      order={order}
      onSelect={() => console.log('selected')}
      showHistoryButton={true}
    />
  );
}
```

### Opção 4: Hook Direto
```tsx
import { useOrderStatusHistory } from '@/lib/hooks/use-order-status-history';

export default function MyComponent() {
  const { history, isLoading, error, fetchHistory } = useOrderStatusHistory('order-123');

  useEffect(() => {
    fetchHistory('order-123');
  }, []);

  return (
    <div>
      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {history.map(change => (
        <div key={change.id}>
          {change.previousStatus} → {change.newStatus}
          por {change.changedBy.name}
        </div>
      ))}
    </div>
  );
}
```

## 📊 Exemplo de Resposta da API

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "previousStatus": "pending",
      "newStatus": "confirmed",
      "changedBy": {
        "id": "user-1",
        "name": "João Silva"
      },
      "createdAt": "2026-04-30T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "previousStatus": "confirmed",
      "newStatus": "preparing",
      "changedBy": {
        "id": "user-2",
        "name": "Maria Santos"
      },
      "createdAt": "2026-04-30T10:35:00Z"
    }
  ]
}
```

## 🎨 Integração no Kitchen Display

Para integrar no Kitchen Display System, substitua o import de `KitchenOrderCard` por `KitchenOrderCardWithHistory`:

```tsx
// Antes
import KitchenOrderCard from './kitchen-order-card';

// Depois
import KitchenOrderCardWithHistory from './kitchen-order-card-with-history';

// No render
{columnOrders.map((order) => (
  <KitchenOrderCardWithHistory
    key={order.id}
    order={order}
    onSelect={() => handleCardClick(order)}
    isDraggable
    onDragStart={(e) => handleDragStart(e, order.id, order.status)}
    onDragEnd={handleDragEnd}
    isDragging={draggedOrderId === order.id}
    isUpdating={updatingOrderId === order.id}
    showHistoryButton={true}
  />
))}
```

## 🔄 Fluxo de Dados

```
User clica no botão de histórico
    ↓
OrderStatusHistoryModal abre
    ↓
OrderStatusHistory carrega dados
    ↓
useOrderStatusHistory chama fetchHistory
    ↓
kitchenOrdersApi.getStatusHistory faz requisição
    ↓
GET /business/establishments/{id}/kitchen-orders/{orderId}/history
    ↓
Backend retorna OrderStatusChange[]
    ↓
Timeline renderiza com formatação de data
```

## 📝 Notas

- O componente usa `date-fns` para formatação de datas em português
- O histórico é exibido em ordem cronológica (mais recente primeiro)
- O botão de histórico aparece ao passar o mouse no card
- Suporta loading, erro e estado vazio
- Totalmente responsivo

## ✅ Checklist de Integração

- [x] Types criados
- [x] API service atualizado
- [x] Hook criado
- [x] Componente de timeline criado