# Setup Global do Toast de Pedidos

## Visão Geral

O toast de notificação de novos pedidos agora é **global** e aparece em qualquer página do sistema, não apenas na página de delivery.

## Como Funciona

### Arquitetura

1. **OrderToastProvider** (`components/providers/order-toast-provider.tsx`)
   - Provider React que gerencia o estado do toast
   - Renderiza o componente `PersistentOrderToast` globalmente
   - Fornece métodos para mostrar, visualizar e descartar notificações

2. **OrderToastListener** (`components/providers/order-toast-listener.tsx`)
   - Componente que escuta eventos de novos pedidos via WebSocket
   - Chama `showNewOrder()` quando um novo pedido chega
   - Integrado no layout do dashboard

3. **useOrderToast** Hook (`lib/context/order-toast-context.tsx`)
   - Hook para acessar o contexto do toast de qualquer componente
   - Permite mostrar notificações programaticamente

## Integração

### ✅ Já Integrado

O sistema já está integrado no layout do dashboard (`app/(dashboard)/layout.tsx`):

```tsx
<OrderToastProvider establishmentId={currentEstablishment?.id}>
  {/* Conteúdo do dashboard */}
  {currentEstablishment && (
    <OrderToastListener establishmentId={currentEstablishment.id} />
  )}
</OrderToastProvider>
```

### Para Outras Áreas do Sistema

Se você quiser adicionar o toast em outras áreas (como admin, landing, etc.), adicione o provider no layout correspondente:

```tsx
import { OrderToastProvider } from '@/components/providers/order-toast-provider';
import { OrderToastListener } from '@/components/providers/order-toast-listener';

export default function YourLayout({ children }: { children: React.ReactNode }) {
  const { currentEstablishment } = useEstablishmentStore();

  return (
    <OrderToastProvider establishmentId={currentEstablishment?.id}>
      {children}
      {currentEstablishment && (
        <OrderToastListener establishmentId={currentEstablishment.id} />
      )}
    </OrderToastProvider>
  );
}
```

## Usar o Toast Programaticamente

Se você quiser mostrar uma notificação de pedido de forma programática em qualquer componente:

```tsx
'use client';

import { useOrderToast } from '@/lib/context/order-toast-context';

export function MyComponent() {
  const { showNewOrder } = useOrderToast();

  const handleSomeEvent = () => {
    const mockOrder = {
      id: 'order-123',
      orderNumber: '12345',
      customerName: 'João Silva',
      total: 150.00,
      status: 'pending',
      // ... outros campos necessários
    };

    showNewOrder(mockOrder);
  };

  return (
    <button onClick={handleSomeEvent}>
      Simular Novo Pedido
    </button>
  );
}
```

## Fluxo de Dados

```
WebSocket (novo pedido)
    ↓
useNewOrders Hook
    ↓
OrderToastListener
    ↓
useOrderToast.showNewOrder()
    ↓
OrderToastProvider (atualiza estado)
    ↓
PersistentOrderToast (renderiza)
    ↓
Usuário vê o toast em qualquer página
```

## Comportamento

### Quando um novo pedido chega:
1. ✅ Toast aparece no canto inferior direito
2. ✅ Ícone de sino pulsa
3. ✅ Som de notificação toca
4. ✅ Toast permanece visível até o usuário agir

### Quando o usuário clica "Ver Pedido":
1. ✅ Toast marca como visualizado
2. ✅ Navega para a página do pedido
3. ✅ Toast desaparece após 3 segundos

### Quando o usuário clica o X:
1. ✅ Toast é descartado imediatamente

## Customização

### Alterar tempo de auto-dismiss
Em `components/providers/order-toast-provider.tsx`:

```ts
const timer = setTimeout(() => {
  dismiss();
}, 3000); // Alterar este valor (em ms)
```

### Alterar posição do toast
Em `components/delivery/persistent-order-toast.tsx`:

```tsx
<div className="fixed bottom-6 right-6 z-50 max-w-sm ...">
  // Alterar bottom-6 right-6 para sua posição desejada
</div>
```

### Alterar cores
Em `components/delivery/persistent-order-toast.tsx`:

```tsx
// Alterar as classes de cor:
// from-blue-600 to-blue-700 (gradiente)
// border-blue-500 (borda)
// ring-blue-400 (anel de pulso)
```

## Debug

### Verificar se está funcionando

1. Abra o Console do Navegador (F12)
2. Procure por logs:
   - `OrderToastProvider - showNewOrder called`
   - `OrderToastListener - handleNewOrder called`
   - `OrderToastProvider - markAsViewed called`

### Se o toast não aparecer

1. Verifique se o WebSocket está conectado
2. Verifique se o evento `order:new` está sendo disparado
3. Verifique se o `establishmentId` está sendo passado corretamente
4. Verifique o console para erros

## Arquivos Criados

- `lib/context/order-toast-context.tsx` - Context e hook
- `components/providers/order-toast-provider.tsx` - Provider
- `components/providers/order-toast-listener.tsx` - Listener
- `components/delivery/persistent-order-toast.tsx` - Componente visual

## Próximos Passos

1. Teste o sistema criando um novo pedido
2. Verifique se o toast aparece em diferentes páginas
3. Verifique se o som toca
4. Verifique se a navegação funciona
5. Verifique se o auto-dismiss funciona

Se tiver problemas, consulte o arquivo `docs/DEBUG_TOAST.md`.
