# Script para Popular Dados de Teste

## 🎯 Objetivo
Criar dados de teste para visualizar os relatórios com informações reais.

## 📝 Passo a Passo

### 1. Criar Produtos (via Interface)

Acesse: `http://localhost:3000/inventory`

**Produto 1:**
```
Nome: Coca-Cola 2L
Código de Barras: 7894900011517
Categoria: Bebidas
Marca: Coca-Cola
Preço de Custo: R$ 5,00
Preço de Venda: R$ 7,50
Quantidade: 100
Estoque Mínimo: 10
Unidade: un
```

**Produto 2:**
```
Nome: Pão Francês
Código de Barras: 1234567890123
Categoria: Padaria
Marca: Própria
Preço de Custo: R$ 0,50
Preço de Venda: R$ 1,00
Quantidade: 200
Estoque Mínimo: 50
Unidade: un
```

**Produto 3:**
```
Nome: Leite Integral 1L
Código de Barras: 7891000100103
Categoria: Laticínios
Marca: Parmalat
Preço de Custo: R$ 3,50
Preço de Venda: R$ 5,00
Quantidade: 50
Estoque Mínimo: 10
Unidade: un
```

**Produto 4:**
```
Nome: Arroz 5kg
Código de Barras: 7896005200018
Categoria: Grãos
Marca: Tio João
Preço de Custo: R$ 15,00
Preço de Venda: R$ 22,00
Quantidade: 30
Estoque Mínimo: 5
Unidade: un
```

**Produto 5:**
```
Nome: Café 500g
Código de Barras: 7896005200025
Categoria: Bebidas
Marca: Pilão
Preço de Custo: R$ 8,00
Preço de Venda: R$ 12,00
Quantidade: 40
Estoque Mínimo: 10
Unidade: un
```

---

### 2. Criar Vendas (via PDV)

Acesse: `http://localhost:3000/sales/pos`

**Venda 1:**
```
Produtos:
- Coca-Cola 2L (2x) = R$ 15,00
- Pão Francês (10x) = R$ 10,00
Total: R$ 25,00
Pagamento: PIX
```

**Venda 2:**
```
Produtos:
- Leite Integral 1L (3x) = R$ 15,00
- Café 500g (1x) = R$ 12,00
Total: R$ 27,00
Pagamento: Dinheiro
```

**Venda 3:**
```
Produtos:
- Arroz 5kg (2x) = R$ 44,00
- Pão Francês (5x) = R$ 5,00
Total: R$ 49,00
Pagamento: Cartão de Crédito
```

**Venda 4:**
```
Produtos:
- Coca-Cola 2L (1x) = R$ 7,50
- Pão Francês (20x) = R$ 20,00
- Leite Integral 1L (2x) = R$ 10,00
Total: R$ 37,50
Pagamento: PIX
Desconto: R$ 2,50
Total Final: R$ 35,00
```

**Venda 5:**
```
Produtos:
- Café 500g (2x) = R$ 24,00
- Arroz 5kg (1x) = R$ 22,00
Total: R$ 46,00
Pagamento: Cartão de Débito
```

**Venda 6:**
```
Produtos:
- Coca-Cola 2L (3x) = R$ 22,50
- Leite Integral 1L (1x) = R$ 5,00
Total: R$ 27,50
Pagamento: PIX
```

**Venda 7:**
```
Produtos:
- Pão Francês (30x) = R$ 30,00
Total: R$ 30,00
Pagamento: Dinheiro
```

**Venda 8:**
```
Produtos:
- Arroz 5kg (1x) = R$ 22,00
- Café 500g (1x) = R$ 12,00
- Coca-Cola 2L (2x) = R$ 15,00
Total: R$ 49,00
Pagamento: Cartão de Crédito
```

**Venda 9 (Cancelada):**
```
Produtos:
- Leite Integral 1L (5x) = R$ 25,00
Total: R$ 25,00
Pagamento: PIX
Status: Cancelar após criar
Motivo: Cliente desistiu da compra
```

**Venda 10:**
```
Produtos:
- Pão Francês (15x) = R$ 15,00
- Leite Integral 1L (2x) = R$ 10,00
Total: R$ 25,00
Pagamento: Dinheiro
```

---

### 3. Verificar Relatórios

Acesse: `http://localhost:3000/reports`

**O que você verá:**

#### Resumo Financeiro
```
Receita Total: ~R$ 330,00
Lucro Estimado: ~R$ 110,00
Ticket Médio: ~R$ 33,00
Total de Vendas: 10
```

#### Produtos Mais Vendidos
```
1. Pão Francês - 90 unidades - R$ 90,00
2. Coca-Cola 2L - 10 unidades - R$ 75,00
3. Leite Integral 1L - 13 unidades - R$ 65,00
4. Arroz 5kg - 4 unidades - R$ 88,00
5. Café 500g - 4 unidades - R$ 48,00
```

#### Vendas por Forma de Pagamento
```
PIX: 4 vendas - R$ 132,50 (40%)
Dinheiro: 3 vendas - R$ 82,00 (25%)
Cartão de Crédito: 2 vendas - R$ 98,00 (30%)
Cartão de Débito: 1 venda - R$ 46,00 (14%)
```

#### Métricas Adicionais
```
Taxa de Cancelamento: 10% (1 venda cancelada)
Margem de Lucro: ~33% (lucro sobre receita)
Produtos Diferentes: 5 (variedade vendida)
```

---

## 🚀 Via API (Opcional)

Se preferir criar via API diretamente:

### Criar Produto
```bash
curl -X POST \
  'http://localhost:3001/business/establishments/{establishmentId}/inventory' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Coca-Cola 2L",
    "barcode": "7894900011517",
    "category": "Bebidas",
    "brand": "Coca-Cola",
    "costPrice": 5.00,
    "salePrice": 7.50,
    "quantity": 100,
    "minQuantity": 10,
    "unit": "un"
  }'
```

### Criar Venda
```bash
curl -X POST \
  'http://localhost:3001/business/establishments/{establishmentId}/sales' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "itemId": "{productId}",
        "unitPrice": 7.50,
        "quantity": 2
      }
    ],
    "paymentMethod": "pix"
  }'
```

---

## ✅ Checklist

Após popular os dados:

- [ ] 5+ produtos criados
- [ ] 10+ vendas realizadas
- [ ] 1 venda cancelada
- [ ] Diferentes formas de pagamento
- [ ] Diferentes quantidades
- [ ] Alguns com desconto

Agora acesse `/reports` e veja todos os dados!

---

## 🎯 Resultado Esperado

Após seguir esses passos, você terá:

✅ **Produtos Mais Vendidos** - Lista com 5 produtos
✅ **Taxa de Cancelamento** - ~10%
✅ **Margem de Lucro** - ~33%
✅ **Produtos Diferentes** - 5
✅ **Gráficos** - Com dados reais
✅ **Tabela de Detalhes** - Com 10 vendas

**Seus relatórios estarão completos e funcionais!** 📊✨
