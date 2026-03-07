# Integração Ofertas + Vendas - Frontend TODO

## 📋 O que o Backend já faz

✅ Endpoint para verificar oferta ativa: `GET /offers/active-offer/:itemId`
✅ Aplicar oferta automaticamente quando `applyOffer: true` no item
✅ Incrementar `conversionCount` automaticamente
✅ Desativar oferta quando estoque zera
✅ Calcular métricas automaticamente

## 🎯 O que precisa ser implementado no Frontend

### 1. API Client - Verificar Oferta Ativa

**Arquivo:** `lib/api/offers.ts`

```typescript
// Adicionar novo método
checkActiveOffer: async (establishmentId: string, itemId: string) => {
  const response = await apiClient.get<{
    hasOffer: boolean;
    offer: {
      id: string;
      title: string;
      originalPrice: number;
      offerPrice: number;
      discountPercentage: number;
      endDate?: string;
      whileStockLasts: boolean;
    } | null;
  }>(
    `/business/establishments/${establishmentId}/offers/active-offer/${itemId}`
  );
  return response.data;
},
```

### 2. Atualizar Tipo de Sale Item

**Arquivo:** `lib/types/sales.ts` (ou onde estiver)

```typescript
interface SaleItem {
  itemId: string;
  unitPrice: number;
  quantity: number;
  applyOffer?: boolean;  // ← ADICIONAR ESTE CAMPO
}
```

### 3. Componente de Produto com Badge de Oferta

**Novo arquivo:** `components/sales/product-with-offer-badge.tsx`

Mostrar:
- Preço original riscado
- Preço da oferta em destaque
- Badge "X% OFF"
- Ícone de oferta

### 4. Atualizar PDV para Verificar Ofertas

**Arquivo:** `app/(dashboard)/sales/pos/page.tsx`

Ao adicionar produto ao carrinho:
1. Verificar se tem oferta ativa
2. Se tiver, mostrar preço promocional
3. Adicionar `applyOffer: true` no item
4. Mostrar economia total

### 5. Atualizar Checkout Modal

**Arquivo:** `components/sales/checkout-modal.tsx`

Adicionar:
- Linha "Economia com ofertas"
- Destacar produtos com oferta aplicada
- Mostrar total economizado

### 6. Hook para Ofertas Ativas

**Novo arquivo:** `lib/hooks/use-active-offers.ts`

```typescript
export function useActiveOffers(itemIds: string[]) {
  const [offers, setOffers] = useState<Map<string, ActiveOffer>>(new Map());
  
  useEffect(() => {
    // Buscar ofertas ativas para todos os produtos
    // Cachear resultados
  }, [itemIds]);
  
  return { offers, hasOffer: (itemId: string) => offers.has(itemId) };
}
```

## 🎨 Melhorias de UX

### No PDV

```
┌─────────────────────────────────────┐
│ Leite Em Pó                         │
│                                     │
│ R$ 4,16  ← riscado                  │
│ R$ 3,70  ← verde, destaque          │
│ 🏷️ 11% OFF - Promoção Camponesa    │
│                                     │
│ Estoque: 6 un                       │
│ [Adicionar]                         │
└─────────────────────────────────────┘
```

### No Carrinho

```
┌─────────────────────────────────────┐
│ Carrinho                            │
├─────────────────────────────────────┤
│ Leite Em Pó  🏷️                     │
│ 1x R$ 3,70 (era R$ 4,16)            │
│                                     │
│ Café                                │
│ 2x R$ 15,00                         │
├─────────────────────────────────────┤
│ Subtotal:     R$ 33,70              │
│ Economia:     R$ 0,46 (11%)         │
│ Total:        R$ 33,70              │
└─────────────────────────────────────┘
```

## 📊 Analytics no Dashboard

Adicionar card no dashboard de vendas:
- "Vendas com Ofertas Hoje"
- "Economia Total Gerada"
- "Taxa de Conversão de Ofertas"

## ⚠️ Validações Importantes

1. **Sempre verificar oferta antes de adicionar ao carrinho**
2. **Não confiar apenas no cache** - verificar novamente no checkout
3. **Mostrar claramente quando oferta expira**
4. **Alertar se estoque está acabando**

## 🔄 Fluxo Recomendado

```
1. Usuário escaneia/seleciona produto
   ↓
2. Sistema verifica oferta ativa
   GET /offers/active-offer/{itemId}
   ↓
3. Se hasOffer = true:
   - Mostra badge de oferta
   - Mostra preço promocional
   - Adiciona applyOffer: true
   ↓
4. Produto adicionado ao carrinho
   ↓
5. No checkout, mostra economia total
   ↓
6. Ao finalizar venda:
   POST /sales com applyOffer: true
   ↓
7. Backend aplica oferta e incrementa conversões
```

## 🚀 Prioridades

### Alta Prioridade
- [ ] Adicionar método `checkActiveOffer` na API
- [ ] Atualizar tipo `SaleItem` com `applyOffer`
- [ ] Modificar PDV para verificar ofertas
- [ ] Mostrar badge de oferta nos produtos

### Média Prioridade
- [ ] Adicionar linha de economia no checkout
- [ ] Criar hook `useActiveOffers`
- [ ] Cachear ofertas ativas

### Baixa Prioridade
- [ ] Analytics de ofertas no dashboard
- [ ] Relatório de vendas com ofertas
- [ ] Notificações quando oferta está acabando

## 📝 Notas

- Backend já está 100% pronto
- Apenas frontend precisa consumir os endpoints
- Ofertas são aplicadas automaticamente pelo backend
- Métricas são atualizadas automaticamente
- Não precisa implementar lógica de negócio no frontend

## 🎯 Resultado Final

Quando implementado, o sistema:
1. ✅ Mostra ofertas ativas automaticamente no PDV
2. ✅ Aplica preço promocional nas vendas
3. ✅ Atualiza métricas de conversão
4. ✅ Mostra economia para o cliente
5. ✅ Desativa ofertas quando estoque acaba
