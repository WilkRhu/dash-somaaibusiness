# Integração Ofertas + Vendas - Implementado ✅

## O que foi implementado

### 1. ✅ API Client - Método para verificar oferta ativa
**Arquivo:** `lib/api/offers.ts`
- Adicionado método `checkActiveOffer(establishmentId, itemId)`
- Retorna se há oferta ativa e seus detalhes

### 2. ✅ Tipos TypeScript
**Arquivo:** `lib/types/offers.ts`
- Criado interface `ActiveOfferCheck`

**Arquivo:** `lib/types/sale.ts`
- Adicionado campo `applyOffer?: boolean` em `CreateSaleItemDto`

### 3. ✅ Hook Customizado
**Arquivo:** `lib/hooks/use-active-offer.ts`
- Hook `useActiveOffer(itemId)` para verificar ofertas
- Retorna: `{ hasOffer, offer, isLoading, error }`
- Atualiza automaticamente quando itemId muda

### 4. ✅ Componente de Badge
**Arquivo:** `components/sales/offer-badge.tsx`
- Componente `<OfferBadge />` para mostrar ofertas
- Exibe preço original riscado
- Exibe preço da oferta em destaque
- Badge com percentual de desconto
- Mostra economia

## Como usar

### Exemplo 1: Verificar se produto tem oferta

```typescript
import { useActiveOffer } from '@/lib/hooks/use-active-offer';

function ProductCard({ itemId }: { itemId: string }) {
  const { hasOffer, offer, isLoading } = useActiveOffer(itemId);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {hasOffer && offer ? (
        <OfferBadge
          originalPrice={offer.originalPrice}
          offerPrice={offer.offerPrice}
          discountPercentage={offer.discountPercentage}
          title={offer.title}
        />
      ) : (
        <p>R$ {product.price}</p>
      )}
    </div>
  );
}
```

### Exemplo 2: Criar venda com oferta

```typescript
import { offersApi } from '@/lib/api/offers';
import { salesApi } from '@/lib/api/sales';

async function createSaleWithOffer(itemId: string, quantity: number) {
  // 1. Verificar se tem oferta
  const { hasOffer, offer } = await offersApi.checkActiveOffer(
    establishmentId,
    itemId
  );

  // 2. Criar venda
  const saleData = {
    items: [{
      itemId,
      unitPrice: hasOffer ? offer!.originalPrice : normalPrice,
      quantity,
      applyOffer: hasOffer  // ← Backend aplica oferta automaticamente
    }],
    paymentMethod: 'cash'
  };

  await salesApi.create(establishmentId, saleData);
}
```

### Exemplo 3: Mostrar economia no carrinho

```typescript
function Cart({ items }: { items: CartItem[] }) {
  const totalSavings = items.reduce((sum, item) => {
    if (item.hasOffer && item.offer) {
      const savings = (item.offer.originalPrice - item.offer.offerPrice) * item.quantity;
      return sum + savings;
    }
    return sum;
  }, 0);

  return (
    <div>
      <p>Subtotal: R$ {subtotal}</p>
      {totalSavings > 0 && (
        <p className="text-green-600">
          Economia: R$ {totalSavings.toFixed(2)} 🎉
        </p>
      )}
      <p>Total: R$ {total}</p>
    </div>
  );
}
```

## Próximos passos

Para completar a integração no PDV:

### 1. Atualizar página do PDV
**Arquivo:** `app/(dashboard)/sales/pos/page.tsx`
- Usar `useActiveOffer` ao selecionar produto
- Mostrar `<OfferBadge />` quando houver oferta
- Adicionar `applyOffer: true` ao adicionar no carrinho

### 2. Atualizar Checkout Modal
**Arquivo:** `components/sales/checkout-modal.tsx`
- Mostrar linha "Economia com ofertas"
- Destacar produtos com oferta aplicada
- Calcular e exibir economia total

### 3. Atualizar Product Card (se houver)
- Adicionar badge de oferta
- Mostrar preço promocional

## Benefícios

✅ **Automático**: Backend aplica oferta e atualiza métricas
✅ **Simples**: Apenas adicionar `applyOffer: true`
✅ **Seguro**: Backend valida se oferta está ativa
✅ **Métricas**: Conversões são contadas automaticamente
✅ **Estoque**: Ofertas desativadas quando estoque acaba

## Fluxo completo

```
1. Usuário seleciona produto
   ↓
2. useActiveOffer verifica oferta
   ↓
3. Se hasOffer = true:
   - Mostra OfferBadge
   - Adiciona applyOffer: true
   ↓
4. Ao finalizar venda:
   - Backend aplica offerPrice
   - Incrementa conversionCount
   - Verifica estoque
   ↓
5. Venda concluída com preço promocional ✅
```

## Testes

Para testar:
1. Criar uma oferta ativa no módulo de Ofertas
2. Ir ao PDV
3. Selecionar o produto com oferta
4. Verificar se badge aparece
5. Finalizar venda
6. Verificar se preço da oferta foi aplicado
7. Verificar se conversionCount aumentou

## Documentação

- `docs/SALES_WITH_OFFERS.md` - Documentação completa do backend
- `OFFERS_SALES_INTEGRATION_TODO.md` - Lista de tarefas
- `OFFERS_SALES_IMPLEMENTED.md` - Este arquivo
