# Onde Encontrar Cada Informação

## 🗺️ Mapa da Página de Relatórios

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Relatório de Vendas          [Comparar] [Exportar CSV]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔍 FILTROS AVANÇADOS                                        │
│ [Hoje] [7 dias] [30 dias] [Este mês]                      │
│ Data Inicial: [____] Data Final: [____]                    │
│ Status: [____] Pagamento: [____]                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 💰 RESUMO FINANCEIRO (4 cards)                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ Receita  │ │  Lucro   │ │  Ticket  │ │  Vendas  │      │
│ │  Total   │ │ Estimado │ │  Médio   │ │  Total   │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📈 GRÁFICOS                                                 │
│ ┌─────────────────────┐ ┌─────────────────────┐          │
│ │  Evolução de Vendas │ │  Distribuição por   │          │
│ │   (Gráfico Linha)   │ │    Pagamento        │          │
│ │                     │ │  (Gráfico Pizza)    │          │
│ └─────────────────────┘ └─────────────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🏆 PRODUTOS MAIS VENDIDOS ← AQUI!                          │
│ ┌───┬──────────────┬──────────┬──────────┐                │
│ │ # │   Produto    │   Qtd    │ Receita  │                │
│ ├───┼──────────────┼──────────┼──────────┤                │
│ │ 1 │ Coca-Cola 2L │    150   │ R$ 1.125 │                │
│ │ 2 │ Pão Francês  │    500   │ R$ 1.000 │                │
│ │ 3 │ Leite 1L     │    100   │ R$ 500   │                │
│ └───┴──────────────┴──────────┴──────────┘                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📊 MÉTRICAS ADICIONAIS ← AQUI!                             │
│ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐│
│ │ Taxa de          │ │ Margem de        │ │ Produtos    ││
│ │ Cancelamento     │ │ Lucro            │ │ Diferentes  ││
│ │                  │ │                  │ │             ││
│ │    10.5%         │ │    33.2%         │ │     15      ││
│ │ 5 vendas         │ │ Lucro sobre      │ │ Variedade   ││
│ │ canceladas       │ │ receita          │ │ vendida     ││
│ └──────────────────┘ └──────────────────┘ └─────────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📋 DETALHES DAS VENDAS                                      │
│ [Tabela com todas as vendas + paginação]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 Localização Exata

### 1. Produtos Mais Vendidos
**Onde:** Seção do meio da página, após os gráficos
**Formato:** Tabela com ranking
**Colunas:**
- # (posição)
- Produto (nome)
- Quantidade (total vendido)
- Receita (valor gerado)

**Código:** `app/(dashboard)/reports/page.tsx` linha ~180

### 2. Taxa de Cancelamento
**Onde:** Cards de métricas adicionais (primeiro card)
**Formato:** Card com ícone de X
**Mostra:**
- Percentual (ex: 10.5%)
- Quantidade absoluta (ex: 5 vendas canceladas)

**Código:** `app/(dashboard)/reports/page.tsx` linha ~220

### 3. Margem de Lucro
**Onde:** Cards de métricas adicionais (segundo card)
**Formato:** Card com ícone de gráfico
**Mostra:**
- Percentual (ex: 33.2%)
- Descrição: "Lucro sobre receita"

**Código:** `app/(dashboard)/reports/page.tsx` linha ~235

### 4. Produtos Diferentes
**Onde:** Cards de métricas adicionais (terceiro card)
**Formato:** Card com ícone de caixa
**Mostra:**
- Número (ex: 15)
- Descrição: "Variedade vendida"

**Código:** `app/(dashboard)/reports/page.tsx` linha ~250

---

## 🔍 Como os Dados São Calculados

### Produtos Mais Vendidos
```typescript
// Backend agrupa por produto
SELECT 
  product_name,
  SUM(quantity) as total_quantity,
  SUM(subtotal) as total_revenue
FROM sale_items
WHERE sale_id IN (vendas do período)
GROUP BY product_name
ORDER BY total_revenue DESC
LIMIT 10
```

### Taxa de Cancelamento
```typescript
// Frontend calcula
const taxaCancelamento = 
  (vendasCanceladas / totalVendas) * 100
```

### Margem de Lucro
```typescript
// Backend calcula
const lucro = receita - custoTotal
const margem = (lucro / receita) * 100
```

### Produtos Diferentes
```typescript
// Frontend conta
const produtosDiferentes = 
  report.topProducts.length
```

---

## 🎯 Passo a Passo Para Ver os Dados

### Opção 1: Via Interface (Recomendado)

```
1. Criar Produtos
   └─ Acesse: /inventory
   └─ Clique: "Adicionar Produto"
   └─ Preencha os dados
   └─ Salve
   └─ Repita 5x

2. Fazer Vendas
   └─ Acesse: /sales/pos
   └─ Adicione produtos
   └─ Finalize venda
   └─ Repita 10x

3. Cancelar Uma Venda (opcional)
   └─ Acesse: /sales
   └─ Encontre uma venda
   └─ Clique em cancelar
   └─ Informe motivo

4. Ver Relatórios
   └─ Acesse: /reports
   └─ Veja todos os dados!
```

### Opção 2: Via Script SQL (Rápido)

Se você tem acesso ao banco de dados:

```sql
-- Inserir produtos de teste
INSERT INTO inventory_items (establishment_id, name, cost_price, sale_price, quantity, unit)
VALUES 
  ('seu-establishment-id', 'Coca-Cola 2L', 5.00, 7.50, 100, 'un'),
  ('seu-establishment-id', 'Pão Francês', 0.50, 1.00, 200, 'un'),
  ('seu-establishment-id', 'Leite 1L', 3.50, 5.00, 50, 'un');

-- Inserir vendas de teste
-- (Use o endpoint da API para isso)
```

---

## 🚨 Problemas Comuns

### "Produtos Mais Vendidos" está vazio
**Causa:** Não há vendas no período selecionado
**Solução:**
1. Verifique os filtros de data
2. Faça algumas vendas
3. Recarregue a página

### "Taxa de Cancelamento" mostra 0%
**Causa:** Não há vendas canceladas
**Solução:**
1. Cancele uma venda de teste
2. Recarregue os relatórios

### "Margem de Lucro" mostra 100%
**Causa:** Produtos sem preço de custo definido
**Solução:**
1. Edite os produtos
2. Adicione preço de custo
3. Faça novas vendas

### "Produtos Diferentes" mostra 0
**Causa:** Não há vendas
**Solução:**
1. Faça vendas com produtos variados
2. Recarregue os relatórios

---

## 📊 Exemplo Real

Depois de seguir o guia `scripts/populate-test-data.md`, você verá:

```
┌─────────────────────────────────────────┐
│ Produtos Mais Vendidos                  │
├───┬──────────────┬──────────┬───────────┤
│ 1 │ Pão Francês  │    90    │ R$ 90,00  │
│ 2 │ Coca-Cola 2L │    10    │ R$ 75,00  │
│ 3 │ Leite 1L     │    13    │ R$ 65,00  │
│ 4 │ Arroz 5kg    │     4    │ R$ 88,00  │
│ 5 │ Café 500g    │     4    │ R$ 48,00  │
└───┴──────────────┴──────────┴───────────┘

┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐
│ Taxa de          │ │ Margem de        │ │ Produtos    │
│ Cancelamento     │ │ Lucro            │ │ Diferentes  │
│                  │ │                  │ │             │
│    10.0%         │ │    33.3%         │ │      5      │
│ 1 venda          │ │ Lucro sobre      │ │ Variedade   │
│ cancelada        │ │ receita          │ │ vendida     │
└──────────────────┘ └──────────────────┘ └─────────────┘
```

---

## ✅ Checklist Final

Para ter todos os dados visíveis:

- [ ] Pelo menos 5 produtos cadastrados
- [ ] Pelo menos 10 vendas realizadas
- [ ] Pelo menos 1 venda cancelada
- [ ] Produtos com preço de custo definido
- [ ] Vendas com diferentes formas de pagamento
- [ ] Período de filtro correto (inclui as vendas)

**Depois disso, todos os dados aparecerão!** 📊✨

---

## 🎓 Dica Pro

Para testar rapidamente:

1. Use o período "Últimos 30 dias"
2. Faça 5-10 vendas hoje
3. Cancele 1 venda
4. Recarregue `/reports`
5. Todos os dados aparecerão!

**URL Direta:** `http://localhost:3000/reports`
