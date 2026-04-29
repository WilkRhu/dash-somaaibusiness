# Exemplo: Integração de Pedidos Internos com PDV

## 📝 Modificações Necessárias no PDV

### 1. Adicionar Campos ao Carrinho

**Arquivo**: `lib/stores/cart-store.ts`

```typescript
interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  isCustom?: boolean;
  
  // NOVOS CAMPOS
  notes?: string;              // Acompanhamentos/observações
  preparationTime?: number;    // Tempo estimado em minutos
  orderType?: 'counter' | 'dine_in' | 'delivery';
  tableNumber?: number;        // Número da mesa (se dine_in)
}
```

### 2. Adicionar Opções de Tipo de Pedido

**Arquivo**: `app/(dashboard)/sales/pos/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { OrderType } from '@/lib/types/kitchen-order';

export default function POSPage() {
  // ... código existente ...
  
  // NOVO: Estado para tipo de pedido
  const [orderType, setOrderType] = useState<OrderType>(OrderType.COUNTER);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  
  const { createOrder } = useKitchenOrders();

  // ... resto do código ...
}
```

### 3. Adicionar UI para Seleção de Tipo

**No formulário de busca de produtos**:

```typescript
<div className="grid grid-cols-3 gap-2 mb-4">
  <button
    onClick={() => {
      setOrderType(OrderType.COUNTER);
      setTableNumber(null);
    }}
    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
      orderType === OrderType.COUNTER
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    🏪 Balcão
  </button>
  
  <button
    onClick={() => setOrderType(OrderType.DINE_IN)}
    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
      orderType === OrderType.DINE_IN
        ? 'bg-purple-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    🍽️ Mesa
  </button>
  
  <button
    onClick={() => setOrderType(OrderType.DELIVERY)}
    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
      orderType === OrderType.DELIVERY
        ? 'bg-orange-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    🚚 Entrega
  </button>
</div>

{/* Seleção de Mesa (se dine_in) */}
{orderType === OrderType.DINE_IN && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Número da Mesa
    </label>
    <input
      type="number"
      min="1"
      value={tableNumber || ''}
      onChange={(e) => setTableNumber(e.target.value ? parseInt(e.target.value) : null)}
      placeholder="Ex: 5"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
)}

{/* Notas do Pedido */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Observações
  </label>
  <textarea
    value={orderNotes}
    onChange={(e) => setOrderNotes(e.target.value)}
    placeholder="Ex: Sem cebola, sem alface, etc."
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    rows={2}
  />
</div>
```

### 4. Modificar Função de Checkout

**Substituir a função `handleCheckout`**:

```typescript
const handleCheckout = async (paymentMethod: PaymentMethod) => {
  try {
    // ... código existente de criar venda ...
    
    const saleResult = await createSale({
      items: itemsWithOffers,
      paymentMethod,
      discount,
      notes: orderNotes,
      customerId: selectedCustomer?.id,
    });

    // NOVO: Criar pedido interno se for balcão ou mesa
    if ((orderType === OrderType.COUNTER || orderType === OrderType.DINE_IN) && saleResult?.id) {
      try {
        const kitchenOrder = await createOrder({
          orderType,
          tableNumber: orderType === OrderType.DINE_IN ? tableNumber : undefined,
          customerName: selectedCustomer?.name || 'Cliente',
          customerPhone: selectedCustomer?.phone,
          items: items.map((item) => ({
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            notes: item.notes,
            preparationTime: item.preparationTime || 15, // Padrão 15 min
          })),
          discount,
          notes: orderNotes,
          priority: 'normal',
        });

        showToast(
          `Pedido #${kitchenOrder.orderNumber} enviado para a cozinha!`,
          'success'
        );
      } catch (kitchenError: any) {
        console.error('Erro ao criar pedido interno:', kitchenError);
        showToast(
          'Venda realizada, mas erro ao enviar para cozinha',
          'warning'
        );
      }
    }

    // Limpar carrinho
    clear();
    setSelectedCustomer(null);
    setOrderNotes('');
    setTableNumber(null);
    setIsCheckoutOpen(false);
    refetchInventory();
    refetchSales();

    return saleResult;
  } catch (error: any) {
    showToast(error.message || 'Erro ao finalizar venda', 'error');
  }
};
```

### 5. Adicionar Campos de Acompanhamento

**Criar modal para adicionar acompanhamentos**:

```typescript
// Novo estado
const [showNotesModal, setShowNotesModal] = useState(false);
const [selectedItemForNotes, setSelectedItemForNotes] = useState<string | null>(null);
const [itemNotes, setItemNotes] = useState('');

// Função para adicionar notas ao item
const handleAddItemNotes = (itemId: string, notes: string) => {
  // Atualizar item no carrinho com notas
  const updatedItems = items.map((item) =>
    item.itemId === itemId ? { ...item, notes } : item
  );
  // Atualizar store
};
```

## 🎯 Fluxo Completo

### Antes (Sem Pedidos Internos)

```
1. Atendente faz pedido no PDV
2. Finaliza venda
3. Recibo impresso
4. Cozinha não sabe que tem pedido novo
```

### Depois (Com Pedidos Internos)

```
1. Atendente seleciona tipo de pedido (balcão/mesa)
2. Se mesa, seleciona número
3. Adiciona observações (sem cebola, etc)
4. Finaliza venda
5. Pedido criado automaticamente na cozinha
6. Som toca na cozinha
7. Cozinha vê na tela KDS
8. Cliente vê na tela de senhas
9. Quando pronto, cozinha marca como pronto
10. Cliente retira
```

## 📱 Exemplo de Uso

### Cenário 1: Lanchonete com Balcão

```
Atendente:
1. Clica em "🏪 Balcão"
2. Adiciona: 2x Hambúrguer, 1x Refrigerante
3. Clica em "Finalizar"
4. Paga em dinheiro
5. Sistema cria pedido #042 na cozinha

Cozinha:
1. Vê pedido #042 na coluna "Novo"
2. Clica para confirmar
3. Começa a preparar
4. Quando pronto, marca como "Pronto"

Cliente:
1. Vê na tela de senhas: "Senha 042 - Pronto"
2. Retira no balcão
```

### Cenário 2: Restaurante com Mesas

```
Garçom:
1. Clica em "🍽️ Mesa"
2. Seleciona "Mesa 5"
3. Adiciona: 2x Prato Principal, 1x Sobremesa
4. Adiciona notas: "Sem cebola no prato 1"
5. Clica em "Finalizar"
6. Paga com cartão

Cozinha:
1. Vê pedido "Mesa 5" na coluna "Novo"
2. Clica para confirmar
3. Começa a preparar
4. Quando pronto, marca como "Pronto"

Garçom:
1. Vê na tela de senhas: "Mesa 5 - Pronto"
2. Retira na cozinha
3. Leva para a mesa
```

## 🔄 Integração com Delivery

Se o pedido for delivery, o sistema pode:

1. Criar pedido interno na cozinha
2. Criar pedido de delivery simultaneamente
3. Quando pronto, notificar entregador
4. Entregador retira e sai

```typescript
if (orderType === OrderType.DELIVERY) {
  // Criar pedido de delivery (já existe no sistema)
  const deliveryOrder = await createDeliveryOrder({
    // ... dados de delivery ...
  });
  
  // Criar pedido interno para cozinha
  const kitchenOrder = await createOrder({
    orderType: OrderType.DELIVERY,
    items: items.map(/* ... */),
    // ...
  });
}
```

## ✅ Checklist de Implementação

- [ ] Adicionar tipos ao cart-store
- [ ] Adicionar UI de seleção de tipo
- [ ] Adicionar campo de mesa (se dine_in)
- [ ] Adicionar campo de notas
- [ ] Integrar createOrder no handleCheckout
- [ ] Testar fluxo completo
- [ ] Testar som de alerta
- [ ] Testar tela de senhas
- [ ] Testar tela KDS
- [ ] Treinar equipe

## 🚀 Próximos Passos

1. Implementar integração com PDV
2. Testar em ambiente de staging
3. Treinar equipe
4. Deploy em produção
5. Monitorar e ajustar tempos de preparo
6. Coletar feedback
7. Melhorias contínuas
