# Vendas com Ofertas - Guia de Integração

## Visão Geral

O sistema permite aplicar automaticamente ofertas ativas durante a criação de vendas, garantindo que o cliente pague o preço promocional e que as métricas da oferta sejam atualizadas.

---

## Como Funciona

### 1. Verificar se Produto Tem Oferta Ativa

Antes de criar a venda, você pode verificar se há oferta ativa para o produto.

**Endpoint:** `GET /business/establishments/:establishmentId/offers/active-offer/:itemId`

**Response quando há oferta:**
```json
{
  "hasOffer": true,
  "offer": {
    "id": "offer-uuid",
    "title": "Flash Sale - 50% OFF",
    "originalPrice": 25.90,
    "offerPrice": 12.95,
    "discountPercentage": 50.00,
    "endDate": "2024-01-15T18:00:00Z",
    "whileStockLasts": false
  }
}
```

**Response quando NÃO há oferta:**
```json
{
  "hasOffer": false,
  "offer": null
}
```

---

### 2. Criar Venda Aplicando Oferta

Para aplicar a oferta automaticamente, adicione `"applyOffer": true` no item da venda.

**Endpoint:** `POST /business/establishments/:establishmentId/sales`

**Payload SEM oferta (preço normal):**
```json
{
  "items": [
    {
      "itemId": "product-uuid",
      "unitPrice": 25.90,
      "quantity": 1
    }
  ],
  "paymentMethod": "credit_card"
}
```

**Payload COM oferta (preço promocional):**
```json
{
  "items": [
    {
      "itemId": "product-uuid",
      "unitPrice": 25.90,
      "quantity": 1,
      "applyOffer": true
    }
  ],
  "paymentMethod": "credit_card"
}
```

**O que acontece quando `applyOffer: true`:**
1. Sistema busca oferta ativa para o produto
2. Se encontrar, substitui `unitPrice` pelo `offerPrice`
3. Venda é criada com preço promocional
4. Contador de conversões da oferta é incrementado
5. Se estoque zerar, oferta é desativada automaticamente

---

## Fluxo Completo

### Cenário: PDV com Oferta Ativa

```
1. Operador escaneia código de barras
   ↓
2. Sistema busca produto no inventário
   ↓
3. Sistema verifica se há oferta ativa
   GET /offers/active-offer/{itemId}
   ↓
4. Se hasOffer = true:
   - Mostra preço original riscado: R$ 25,90
   - Mostra preço da oferta: R$ 12,95
   - Badge: "50% OFF"
   ↓
5. Operador confirma venda
   ↓
6. Sistema cria venda com applyOffer: true
   POST /sales
   {
     "items": [{
       "itemId": "...",
       "unitPrice": 25.90,  // Será substituído por 12.95
       "quantity": 1,
       "applyOffer": true
     }]
   }
   ↓
7. Sistema processa:
   - Aplica offerPrice (12.95)
   - Cria venda
   - Atualiza estoque
   - Incrementa conversionCount da oferta
   - Verifica se estoque zerou
   ↓
8. Venda concluída com preço promocional
```

---

## Exemplos de Uso

### Exemplo 1: Venda Simples com Oferta

```javascript
// 1. Verificar oferta
const response = await fetch(
  '/business/establishments/123/offers/active-offer/product-abc'
);
const { hasOffer, offer } = await response.json();

// 2. Criar venda
const saleData = {
  items: [{
    itemId: 'product-abc',
    unitPrice: hasOffer ? offer.originalPrice : 25.90,
    quantity: 1,
    applyOffer: hasOffer  // true se houver oferta
  }],
  paymentMethod: 'credit_card'
};

const saleResponse = await fetch(
  '/business/establishments/123/sales',
  {
    method: 'POST',
    body: JSON.stringify(saleData)
  }
);
```

### Exemplo 2: Venda com Múltiplos Produtos (alguns com oferta)

```json
{
  "items": [
    {
      "itemId": "product-1",
      "unitPrice": 25.90,
      "quantity": 2,
      "applyOffer": true  // Tem oferta ativa
    },
    {
      "itemId": "product-2",
      "unitPrice": 15.00,
      "quantity": 1,
      "applyOffer": false  // Sem oferta ou não quer aplicar
    },
    {
      "itemId": "product-3",
      "unitPrice": 30.00,
      "quantity": 1,
      "applyOffer": true  // Tem oferta ativa
    }
  ],
  "paymentMethod": "cash"
}
```

**Resultado:**
- product-1: Preço da oferta aplicado (ex: R$ 12,95)
- product-2: Preço normal (R$ 15,00)
- product-3: Preço da oferta aplicado (ex: R$ 20,00)

### Exemplo 3: Venda sem Aplicar Oferta (mesmo tendo)

```json
{
  "items": [
    {
      "itemId": "product-uuid",
      "unitPrice": 25.90,
      "quantity": 1,
      "applyOffer": false  // Ou omitir o campo
    }
  ],
  "paymentMethod": "cash"
}
```

**Resultado:** Venda criada com preço normal, oferta não é aplicada.

---

## Métricas Atualizadas Automaticamente

Quando uma venda é criada com `applyOffer: true`:

### 1. Conversion Count
```
offer.conversionCount++
```

### 2. Total Revenue (calculado)
```
totalRevenue = conversionCount × offerPrice
```

### 3. Conversion Rate (calculado)
```
conversionRate = (conversionCount / viewCount) × 100
```

---

## Interface do PDV

### Tela de Produto com Oferta

```
┌─────────────────────────────────────────┐
│ Produto X                               │
│                                         │
│ Preço: R$ 25,90  ← riscado             │
│ OFERTA: R$ 12,95  ← destaque           │
│                                         │
│ [🏷️ 50% OFF - Flash Sale]              │
│                                         │
│ Quantidade: [1] [+] [-]                 │
│                                         │
│ [Adicionar ao Carrinho]                 │
└─────────────────────────────────────────┘
```

### Carrinho com Oferta

```
┌─────────────────────────────────────────┐
│ Carrinho                                │
├─────────────────────────────────────────┤
│ Produto X                               │
│ 1x R$ 12,95  🏷️ (era R$ 25,90)         │
│                                         │
│ Produto Y                               │
│ 2x R$ 15,00                             │
│                                         │
├─────────────────────────────────────────┤
│ Subtotal:        R$ 42,95               │
│ Desconto:        R$ 0,00                │
│ Total:           R$ 42,95               │
│                                         │
│ Economia: R$ 12,95 (33%)                │
└─────────────────────────────────────────┘
```

---

## Validações

### O que o sistema valida:

1. ✅ Oferta está ativa (`isActive = true`)
2. ✅ Data atual está entre `startDate` e `endDate` (se não for whileStockLasts)
3. ✅ Produto tem estoque disponível
4. ✅ Oferta pertence ao produto correto

### O que NÃO é validado:

- ❌ Se o cliente é elegível para a oferta (implementar se necessário)
- ❌ Limite de quantidade por cliente (implementar se necessário)
- ❌ Cupons de desconto adicionais (implementar se necessário)

---

## Comportamento Especial

### Oferta "Enquanto Durar o Estoque"

Se a venda zerar o estoque:
1. Venda é processada normalmente
2. Estoque vai para 0
3. Oferta é desativada automaticamente
4. Notificação é criada
5. Próximas tentativas de venda falham (estoque insuficiente)

### Oferta Expira Durante a Venda

Se a oferta expirar entre a verificação e a criação da venda:
- Sistema ainda aplica o preço da oferta
- Conversão é contabilizada
- Oferta já está desativada para próximas vendas

---

## Troubleshooting

### Oferta não é aplicada

**Problema:** `applyOffer: true` mas preço normal é usado

**Possíveis causas:**
1. Oferta não está ativa
2. Oferta expirou
3. Produto não tem oferta ativa
4. Erro ao buscar oferta

**Solução:**
```javascript
// Sempre verificar antes
const { hasOffer } = await getActiveOffer(itemId);
if (!hasOffer) {
  console.log('Nenhuma oferta ativa para este produto');
}
```

### Conversion count não incrementa

**Problema:** Venda criada mas `conversionCount` não aumenta

**Possíveis causas:**
1. `applyOffer` não foi enviado como `true`
2. Erro ao incrementar (verificar logs)

**Solução:** Verificar logs do servidor para erros.

---

## Boas Práticas

1. **Sempre verificar oferta antes**: Use o endpoint `active-offer` antes de criar venda
2. **Mostrar economia**: Exiba quanto o cliente está economizando
3. **Badge visual**: Use badges/tags para destacar produtos em oferta
4. **Preço riscado**: Mostre o preço original riscado
5. **Confirmação**: Confirme com o operador se quer aplicar a oferta
6. **Logs**: Registre quando ofertas são aplicadas para auditoria

---

## Resumo

✅ Sistema aplica ofertas automaticamente quando `applyOffer: true`
✅ Preço da oferta substitui o preço normal
✅ Métricas são atualizadas automaticamente
✅ Estoque é verificado e ofertas desativadas se necessário
✅ Endpoint para verificar ofertas ativas disponível
✅ Suporte para múltiplos produtos com/sem ofertas na mesma venda
