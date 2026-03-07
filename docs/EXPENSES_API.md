# API de Despesas e Balanço Financeiro

## Visão Geral

Sistema completo de gestão de despesas e balanço financeiro para estabelecimentos. Permite registrar todas as despesas operacionais, gerar relatórios financeiros e calcular lucro líquido.

## Recursos

- Registro manual de despesas
- Criação automática de despesas ao adicionar produtos no estoque
- Categorização de despesas
- Controle de status (pendente, pago, vencido, cancelado)
- Despesas recorrentes
- Vinculação com fornecedores
- Balanço financeiro completo (receitas vs despesas)
- Fluxo de caixa diário
- Relatórios por categoria

## Endpoints

### 1. Criar Despesa

```http
POST /business/establishments/:establishmentId/expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Aluguel de Março",
  "category": "rent",
  "amount": 2500.00,
  "status": "pending",
  "expenseDate": "2026-03-01",
  "dueDate": "2026-03-10",
  "isRecurring": true,
  "recurrenceInterval": "monthly",
  "notes": "Aluguel do estabelecimento"
}
```

**Categorias disponíveis:**
- `inventory_purchase` - Compra de Mercadorias
- `rent` - Aluguel
- `utilities` - Água, Luz e Gás
- `internet_phone` - Internet e Telefone
- `salaries` - Salários
- `taxes` - Impostos
- `maintenance` - Manutenção
- `marketing` - Marketing
- `fuel` - Combustível
- `cleaning` - Material de Limpeza
- `office_supplies` - Material de Escritório
- `delivery` - Despesas com Delivery
- `equipment` - Equipamentos
- `software` - Software e Sistemas
- `insurance` - Seguros
- `bank_fees` - Taxas Bancárias
- `other` - Outras Despesas

**Status:**
- `pending` - Pendente
- `paid` - Pago
- `overdue` - Vencido
- `cancelled` - Cancelado

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "description": "Aluguel de Março",
    "category": "rent",
    "amount": "2500.00",
    "status": "pending",
    "expenseDate": "2026-03-01",
    "dueDate": "2026-03-10",
    "isRecurring": true,
    "recurrenceInterval": "monthly",
    "createdAt": "2026-03-02T10:00:00.000Z"
  },
  "message": "Despesa criada com sucesso"
}
```

### 2. Listar Despesas

```http
GET /business/establishments/:establishmentId/expenses?startDate=2026-03-01&endDate=2026-03-31&category=rent&status=pending&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final
- `category` (opcional): Filtrar por categoria
- `status` (opcional): Filtrar por status
- `supplierId` (opcional): Filtrar por fornecedor
- `page` (opcional): Página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "description": "Aluguel de Março",
      "category": "rent",
      "amount": "2500.00",
      "status": "pending",
      "expenseDate": "2026-03-01",
      "dueDate": "2026-03-10",
      "supplier": null,
      "creator": {
        "id": "uuid",
        "name": "João Silva"
      }
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

### 3. Obter Despesa por ID

```http
GET /business/establishments/:establishmentId/expenses/:id
Authorization: Bearer {token}
```

### 4. Atualizar Despesa

```http
PATCH /business/establishments/:establishmentId/expenses/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 2600.00,
  "notes": "Valor atualizado com reajuste"
}
```

### 5. Marcar como Paga

```http
PATCH /business/establishments/:establishmentId/expenses/:id/mark-as-paid
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentDate": "2026-03-08",
  "paymentMethod": "pix"
}
```

**Métodos de pagamento:**
- `cash` - Dinheiro
- `debit_card` - Cartão de Débito
- `credit_card` - Cartão de Crédito
- `pix` - PIX
- `bank_transfer` - Transferência Bancária
- `bank_slip` - Boleto
- `check` - Cheque
- `other` - Outro

### 6. Excluir Despesa

```http
DELETE /business/establishments/:establishmentId/expenses/:id
Authorization: Bearer {token}
```

### 7. Balanço Financeiro (Principal)

```http
GET /business/establishments/:establishmentId/expenses/financial-balance?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2026-03-01",
      "endDate": "2026-03-31"
    },
    "totalRevenue": 45000.00,
    "totalExpenses": 28500.00,
    "netProfit": 16500.00,
    "profitMargin": 36.67,
    "expensesByCategory": [
      {
        "category": "inventory_purchase",
        "categoryLabel": "Compra de Mercadorias",
        "total": 15000.00,
        "percentage": 52.63
      },
      {
        "category": "rent",
        "categoryLabel": "Aluguel",
        "total": 2500.00,
        "percentage": 8.77
      },
      {
        "category": "utilities",
        "categoryLabel": "Água, Luz e Gás",
        "total": 800.00,
        "percentage": 2.81
      }
    ],
    "revenueByPaymentMethod": [
      {
        "method": "pix",
        "total": 20000.00,
        "percentage": 44.44
      },
      {
        "method": "credit_card",
        "total": 15000.00,
        "percentage": 33.33
      },
      {
        "method": "cash",
        "total": 10000.00,
        "percentage": 22.22
      }
    ],
    "expensesByStatus": [
      {
        "status": "paid",
        "total": 25000.00,
        "count": 12
      },
      {
        "status": "pending",
        "total": 3500.00,
        "count": 3
      }
    ],
    "dailyCashFlow": [
      {
        "date": "2026-03-01",
        "revenue": 1500.00,
        "expenses": 2500.00,
        "balance": -1000.00
      },
      {
        "date": "2026-03-02",
        "revenue": 2300.00,
        "expenses": 500.00,
        "balance": 1800.00
      }
    ]
  }
}
```

## Integração com Estoque

Para registrar despesas ao adicionar produtos no estoque, você pode:

**Opção 1: Criar despesa manualmente após adicionar estoque**

```javascript
// 1. Adicionar estoque
const stockUpdate = await fetch(`/business/establishments/${id}/inventory/${itemId}/stock`, {
  method: 'PATCH',
  body: JSON.stringify({
    type: 'entry',
    quantity: 50,
    supplierId: 'supplier-uuid'
  })
});

// 2. Criar despesa correspondente
const expense = await fetch(`/business/establishments/${id}/expenses`, {
  method: 'POST',
  body: JSON.stringify({
    description: 'Compra de 50 un de Arroz',
    category: 'inventory_purchase',
    amount: 500.00, // costPrice * quantity
    status: 'paid',
    expenseDate: '2026-03-02',
    supplierId: 'supplier-uuid'
  })
});
```

**Opção 2: Usar o método auxiliar do ExpensesService**

```typescript
// No backend, após adicionar estoque
await expensesService.createFromStockEntry(
  establishmentId,
  stockMovementId,
  totalCost,
  supplierId,
  description,
  userId
);
```

## Casos de Uso

### 1. Registrar Aluguel Mensal

```javascript
const response = await fetch(`/business/establishments/${id}/expenses`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'Aluguel de Março',
    category: 'rent',
    amount: 2500.00,
    status: 'pending',
    expenseDate: '2026-03-01',
    dueDate: '2026-03-10',
    isRecurring: true,
    recurrenceInterval: 'monthly'
  })
});
```

### 2. Registrar Conta de Luz

```javascript
await fetch(`/business/establishments/${id}/expenses`, {
  method: 'POST',
  body: JSON.stringify({
    description: 'Conta de Luz - Março',
    category: 'utilities',
    amount: 450.00,
    status: 'pending',
    expenseDate: '2026-03-15',
    dueDate: '2026-03-20'
  })
});
```

### 3. Ver Balanço do Mês

```javascript
const response = await fetch(
  `/business/establishments/${id}/expenses/financial-balance?startDate=2026-03-01&endDate=2026-03-31`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);

const { data } = await response.json();

console.log(`Receitas: R$ ${data.totalRevenue}`);
console.log(`Despesas: R$ ${data.totalExpenses}`);
console.log(`Lucro: R$ ${data.netProfit}`);
console.log(`Margem: ${data.profitMargin}%`);
```

### 4. Marcar Despesa como Paga

```javascript
await fetch(`/business/establishments/${id}/expenses/${expenseId}/mark-as-paid`, {
  method: 'PATCH',
  body: JSON.stringify({
    paymentDate: '2026-03-08',
    paymentMethod: 'pix'
  })
});
```

## Relatórios Disponíveis

### Despesas por Categoria
Mostra quanto foi gasto em cada categoria e a porcentagem do total.

### Receitas por Forma de Pagamento
Mostra como os clientes estão pagando (PIX, cartão, dinheiro, etc).

### Fluxo de Caixa Diário
Mostra dia a dia as entradas (vendas) e saídas (despesas) e o saldo.

### Despesas por Status
Mostra quantas despesas estão pagas, pendentes ou vencidas.

## Permissões

Apenas membros com permissão de acesso ao estabelecimento podem:
- Criar despesas
- Visualizar despesas
- Atualizar despesas
- Excluir despesas
- Ver balanço financeiro

## Notas Importantes

1. **Despesas automáticas**: Entradas de estoque geram despesas automaticamente
2. **Despesas recorrentes**: Marque como recorrente para facilitar o controle mensal
3. **Vinculação com fornecedores**: Associe despesas a fornecedores para melhor rastreabilidade
4. **Status automático**: Despesas vencidas podem ser marcadas automaticamente como `overdue`
5. **Soft delete**: Despesas excluídas são mantidas no banco para auditoria
