# Debug do Toast Persistente

## Passos para Verificar se está Funcionando

### 1. Abra o Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (Mac)
- Vá para a aba "Console"

### 2. Procure por estes logs:
```
DeliveryOrderNotificationsContainer - rendering with order: ...
DeliveryOrderNotificationsContainer - handleNewOrder called with: ...
usePersistentOrderToast - showNewOrder called with: ...
PersistentOrderToast - order: ... isViewed: ...
```

### 3. Se você NÃO vir estes logs:

#### Problema 1: WebSocket não está conectando
- Verifique a aba "Network" do DevTools
- Procure por uma conexão WebSocket (deve aparecer como "ws://" ou "wss://")
- Se não houver, o WebSocket não está conectando

**Solução:**
- Verifique se o servidor WebSocket está rodando
- Verifique a URL do WebSocket em `lib/services/delivery-websocket.ts`

#### Problema 2: O hook `useNewOrders` não está sendo chamado
- Adicione este log no arquivo `lib/hooks/use-delivery-websocket.ts`:

```ts
export function useNewOrders(establishmentId: string, onNewOrder: (order: any) => void) {
  console.log('useNewOrders hook called with establishmentId:', establishmentId);
  
  useEffect(() => {
    console.log('useNewOrders - subscribing to establishment:', establishmentId);
    deliveryWebSocket.subscribeToEstablishment(establishmentId);

    const unsubscribe = deliveryWebSocket.on('order:new', (data) => {
      console.log('useNewOrders - order:new event received:', data);
      onNewOrder(data);
      // ... resto do código
    });

    return () => {
      unsubscribe();
    };
  }, [establishmentId, onNewOrder]);
}
```

### 4. Se o toast aparecer mas desaparecer muito rápido:

Aumente o tempo de auto-dismiss em `lib/hooks/use-persistent-order-toast.ts`:

```ts
const timer = setTimeout(() => {
  console.log('usePersistentOrderToast - auto-dismissing after view');
  dismiss();
}, 10000); // Aumentar de 3000 para 10000 (10 segundos)
```

### 5. Teste Manual

Se o WebSocket não estiver funcionando, você pode testar o componente manualmente:

Crie um arquivo `test-toast.tsx` em `components/delivery/`:

```tsx
'use client';

import { useState } from 'react';
import { PersistentOrderToast } from './persistent-order-toast';
import { DeliveryOrder } from '@/lib/types/delivery';

export function TestToast() {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [isViewed, setIsViewed] = useState(false);

  const mockOrder: DeliveryOrder = {
    id: 'test-123',
    orderNumber: '12345',
    customerName: 'João Silva',
    total: 150.00,
    status: 'pending',
    // ... outros campos necessários
  };

  return (
    <div className="p-4">
      <button
        onClick={() => {
          setOrder(mockOrder);
          setIsViewed(false);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Mostrar Toast
      </button>

      <PersistentOrderToast
        order={order}
        isViewed={isViewed}
        onViewOrder={(id) => {
          console.log('View order:', id);
          setIsViewed(true);
        }}
        onDismiss={() => {
          console.log('Dismiss');
          setOrder(null);
        }}
      />
    </div>
  );
}
```

Depois adicione na página de delivery:

```tsx
import { TestToast } from '@/components/delivery/test-toast';

// ... dentro do componente
<TestToast />
```

### 6. Verificar Estrutura do Pedido

Certifique-se de que o objeto `DeliveryOrder` tem estes campos:
- `id` (string)
- `orderNumber` (string)
- `customerName` (string)
- `total` (number)

Se o pedido não tiver estes campos, o toast não vai renderizar corretamente.

## Checklist de Debug

- [ ] Console mostra logs de `DeliveryOrderNotificationsContainer`?
- [ ] Console mostra logs de `useNewOrders`?
- [ ] WebSocket está conectado (aba Network)?
- [ ] Evento `order:new` está sendo disparado?
- [ ] Objeto do pedido tem todos os campos necessários?
- [ ] Toast aparece quando você clica no botão de teste?
- [ ] Toast desaparece após clicar "Ver Pedido"?

## Próximos Passos

Se ainda não funcionar:
1. Compartilhe os logs do console
2. Verifique se o WebSocket está enviando eventos `order:new`
3. Verifique a estrutura do objeto `DeliveryOrder` que está sendo enviado
