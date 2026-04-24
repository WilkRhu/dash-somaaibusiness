# Integração do Toast Persistente de Pedidos

## Visão Geral

O novo sistema de notificação de pedidos oferece um toast persistente que permanece visível até que o usuário visualize o pedido. Diferente do sistema anterior que desaparecia automaticamente, este novo sistema garante que o usuário não perca nenhuma notificação importante.

## Componentes Criados

### 1. `PersistentOrderToast` (`components/delivery/persistent-order-toast.tsx`)
Componente visual que exibe o toast com:
- Ícone animado com efeito de pulso
- Informações do pedido (número, cliente, valor)
- Botão "Ver Pedido" para navegar
- Botão de fechar para descartar
- Animações suaves e feedback visual

### 2. `usePersistentOrderToast` (`lib/hooks/use-persistent-order-toast.ts`)
Hook que gerencia o estado do toast:
- `showNewOrder(order)` - Exibe novo pedido
- `markAsViewed(orderId)` - Marca como visualizado
- `dismiss()` - Descarta a notificação
- Auto-dismiss 3 segundos após visualizar

### 3. `DeliveryOrderNotificationsContainer` (`components/delivery/delivery-order-notifications-container.tsx`)
Componente container que integra:
- WebSocket para novos pedidos
- Gerenciamento de estado do toast
- Navegação para o pedido

## Como Usar

### Opção 1: Substituir o componente existente (Recomendado)

No arquivo `app/(dashboard)/delivery/page.tsx`:

```tsx
// Remover:
import { DeliveryNotifications } from '@/components/delivery/delivery-notifications';

// Adicionar:
import { DeliveryOrderNotificationsContainer } from '@/components/delivery/delivery-order-notifications-container';

// Substituir no JSX:
// De:
<DeliveryNotifications
  establishmentId={currentEstablishment.id}
  onNewOrder={() => refetchOrders()}
/>

// Para:
<DeliveryOrderNotificationsContainer
  establishmentId={currentEstablishment.id}
/>
```

### Opção 2: Usar o hook diretamente

Se você quiser mais controle, pode usar o hook diretamente:

```tsx
'use client';

import { usePersistentOrderToast } from '@/lib/hooks/use-persistent-order-toast';
import { PersistentOrderToast } from '@/components/delivery/persistent-order-toast';
import { useNewOrders } from '@/lib/hooks/use-delivery-websocket';

export function MyComponent({ establishmentId }: { establishmentId: string }) {
  const { order, isViewed, showNewOrder, markAsViewed, dismiss } = usePersistentOrderToast();

  const handleNewOrder = (newOrder: any) => {
    showNewOrder(newOrder);
  };

  useNewOrders(establishmentId, handleNewOrder);

  return (
    <PersistentOrderToast
      order={order}
      isViewed={isViewed}
      onViewOrder={(orderId) => {
        markAsViewed(orderId);
        // Sua lógica de navegação aqui
      }}
      onDismiss={dismiss}
    />
  );
}
```

## Recursos

### Visual
- ✅ Gradiente azul com animações
- ✅ Ícone de sino com efeito de pulso
- ✅ Borda superior animada
- ✅ Barra de progresso na base
- ✅ Animação de entrada suave

### Comportamento
- ✅ Persiste até visualizar o pedido
- ✅ Som de notificação ao receber novo pedido
- ✅ Auto-dismiss 3 segundos após visualizar
- ✅ Botão para descartar manualmente
- ✅ Navegação automática ao clicar "Ver Pedido"

### Responsividade
- ✅ Posicionado no canto inferior direito
- ✅ Máximo de 448px de largura
- ✅ Adapta-se a diferentes tamanhos de tela

## Customização

### Alterar tempo de auto-dismiss
No arquivo `lib/hooks/use-persistent-order-toast.ts`, linha ~50:

```ts
const timer = setTimeout(() => {
  dismiss();
}, 3000); // Alterar este valor (em ms)
```

### Alterar posição do toast
No arquivo `components/delivery/persistent-order-toast.tsx`, linha ~48:

```tsx
<div className="fixed bottom-6 right-6 z-50 max-w-sm ...">
  // Alterar bottom-6 right-6 para sua posição desejada
  // Exemplos: top-6 left-6, bottom-6 left-6, etc.
</div>
```

### Alterar cores
No arquivo `components/delivery/persistent-order-toast.tsx`:

```tsx
// Alterar as classes de cor:
// from-blue-600 to-blue-700 (gradiente)
// border-blue-500 (borda)
// ring-blue-400 (anel de pulso)
// bg-white text-blue-600 (botão)
```

## Integração com Páginas Específicas

### Dashboard de Delivery
```tsx
// app/(dashboard)/delivery/page.tsx
import { DeliveryOrderNotificationsContainer } from '@/components/delivery/delivery-order-notifications-container';

export default function DeliveryPage() {
  return (
    <>
      <DeliveryOrderNotificationsContainer establishmentId={establishmentId} />
      {/* Resto do conteúdo */}
    </>
  );
}
```

### Admin - Estabelecimentos
```tsx
// app/admin/business/establishments/[id]/delivery/page.tsx
import { DeliveryOrderNotificationsContainer } from '@/components/delivery/delivery-order-notifications-container';

export default function EstablishmentDeliveryPage() {
  return (
    <>
      <DeliveryOrderNotificationsContainer establishmentId={establishmentId} />
      {/* Resto do conteúdo */}
    </>
  );
}
```

## Notas Importantes

1. **WebSocket**: O componente depende do hook `useNewOrders` que deve estar conectado ao seu WebSocket
2. **Navegação**: Certifique-se de que a rota de navegação está correta para seu caso de uso
3. **Som**: O arquivo `/notification.mp3` deve existir na pasta `public/`
4. **Acessibilidade**: O componente inclui `aria-label` para leitores de tela

## Troubleshooting

### Toast não aparece
- Verifique se o WebSocket está conectado
- Confirme que `useNewOrders` está retornando dados
- Verifique o console para erros

### Som não toca
- Certifique-se de que `/notification.mp3` existe
- Verifique as permissões de áudio do navegador
- Alguns navegadores requerem interação do usuário antes de reproduzir áudio

### Toast desaparece muito rápido
- Aumente o tempo de auto-dismiss em `use-persistent-order-toast.ts`
- Ou remova o auto-dismiss se preferir que o usuário feche manualmente
