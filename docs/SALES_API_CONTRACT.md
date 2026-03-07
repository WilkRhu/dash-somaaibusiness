# Sales API Contract

## Overview

Este documento descreve o contrato da API do módulo de Sales (PDV) da plataforma SomaAI Business. O módulo gerencia vendas, processamento de pagamentos e integração com o estoque.

## Base URL

```
/business/establishments/:establishmentId/sales
```

## Authentication

Todos os endpoints requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Create Sale (Criar Venda)

Cria uma nova venda no PDV com baixa automática no estoque.

**Endpoint:** `POST /business/establishments/:establishmentId/sales`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento

**Request Body:**
```typescript
{
  items: [
    {
      itemId: string;        // UUID do produto no inventário
      unitPrice: number;     // Preço unitário (min: 0.01)
      quantity: number;      // Quantidade (min: 1)
      discount?: number;     // Desconto no item (min: 0, opcional)
    }
  ];
  paymentMethod: 'cash' | 'debit_card' | 'credit_card' | 'pix' | 'bank_transfer';
  customerId?: string;       // UUID do cliente (opcional)
  discount?: number;         // Desconto total da venda (min: 0, opcional)
  notes?: string;            // Observações (opcional)
}
```

**Response:** `201 Created`
```typescript
{
  id: string;
  establishmentId: string;
  saleNumber: string;        // Formato: YYYYMMDD-XXXX
  items: [
    {
      id: string;
      saleId: string;
      itemId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      discount: number;
      subtotal: number;
      createdAt: string;
    }
  ];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'cancelled' | 'pending';
  customerId: string | null;
  sellerId: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  establishment: {
    id: string;
    name: string;
    cnpj: string;
  };
}
```

**Error Responses:**

`400 Bad Request` - Estoque insuficiente:
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for product Coca-Cola 2L. Available: 5, Requested: 10",
  "error": "Bad Request"
}
```

`400 Bad Request` - Total negativo:
```json
{
  "statusCode": 400,
  "message": "Sale total cannot be negative",
  "error": "Bad Request"
}
```

`404 Not Found` - Item não encontrado:
```json
{
  "statusCode": 404,
  "message": "Inventory item {itemId} not found",
  "error": "Not Found"
}
```

---

### 2. List Sales (Listar Vendas)

Lista todas as vendas de um estabelecimento com filtros e paginação.

**Endpoint:** `GET /business/establishments/:establishmentId/sales`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento

**Query Parameters:**
- `startDate` (string, optional): Data inicial (ISO 8601 format)
- `endDate` (string, optional): Data final (ISO 8601 format)
- `status` (string, optional): Status da venda (`completed`, `cancelled`, `pending`)
- `page` (number, optional): Número da página (default: 1, min: 1)
- `limit` (number, optional): Itens por página (default: 20, min: 1)

**Example Request:**
```
GET /business/establishments/123e4567-e89b-12d3-a456-426614174000/sales?startDate=2026-02-01&endDate=2026-02-28&status=completed&page=1&limit=20
```

**Response:** `200 OK`
```typescript
{
  data: [
    {
      id: string;
      establishmentId: string;
      saleNumber: string;
      items: [...];
      subtotal: number;
      discount: number;
      total: number;
      paymentMethod: string;
      status: string;
      customerId: string | null;
      sellerId: string;
      notes: string | null;
      cancellationReason: string | null;
      createdAt: string;
      updatedAt: string;
      seller: {
        id: string;
        name: string;
        email: string;
      };
    }
  ];
  total: number;      // Total de registros
  page: number;       // Página atual
  limit: number;      // Itens por página
}
```

---

### 3. Get Sale Details (Detalhes da Venda)

Retorna os detalhes completos de uma venda específica.

**Endpoint:** `GET /business/establishments/:establishmentId/sales/:id`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento
- `id` (string, required): UUID da venda

**Response:** `200 OK`
```typescript
{
  id: string;
  establishmentId: string;
  saleNumber: string;
  items: [
    {
      id: string;
      saleId: string;
      itemId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      discount: number;
      subtotal: number;
      createdAt: string;
      item: {
        id: string;
        name: string;
        barcode: string;
        category: string;
        brand: string;
        salePrice: number;
        quantity: number;
      };
    }
  ];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
  customerId: string | null;
  sellerId: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  establishment: {
    id: string;
    name: string;
    cnpj: string;
    address: string;
    phone: string;
  };
}
```

**Error Responses:**

`404 Not Found`:
```json
{
  "statusCode": 404,
  "message": "Sale {saleId} not found",
  "error": "Not Found"
}
```

---

### 4. Cancel Sale (Cancelar Venda)

Cancela uma venda e reverte o estoque dos produtos.

**Endpoint:** `POST /business/establishments/:establishmentId/sales/:id/cancel`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento
- `id` (string, required): UUID da venda

**Request Body:**
```typescript
{
  reason: string;  // Motivo do cancelamento (required)
}
```

**Response:** `200 OK`
```typescript
{
  id: string;
  establishmentId: string;
  saleNumber: string;
  items: [...];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: "cancelled";
  customerId: string | null;
  sellerId: string;
  notes: string | null;
  cancellationReason: string;  // Motivo fornecido
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**

`400 Bad Request` - Venda já cancelada:
```json
{
  "statusCode": 400,
  "message": "Sale is already cancelled",
  "error": "Bad Request"
}
```

`404 Not Found`:
```json
{
  "statusCode": 404,
  "message": "Sale {saleId} not found",
  "error": "Not Found"
}
```

---

## Data Models

### Sale Entity

```typescript
interface Sale {
  id: string;
  establishmentId: string;
  saleNumber: string;           // Formato: YYYYMMDD-XXXX
  items: SaleItem[];
  subtotal: number;              // Soma dos subtotais dos itens
  discount: number;              // Desconto total aplicado
  total: number;                 // subtotal - discount
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  customerId: string | null;
  sellerId: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### SaleItem Entity

```typescript
interface SaleItem {
  id: string;
  saleId: string;
  itemId: string;
  productName: string;           // Snapshot do nome do produto
  unitPrice: number;             // Preço unitário no momento da venda
  quantity: number;
  discount: number;
  subtotal: number;              // (unitPrice * quantity) - discount
  createdAt: Date;
}
```

### Enums

```typescript
enum PaymentMethod {
  CASH = 'cash',
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer'
}

enum SaleStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING = 'pending'
}
```

---

## Business Rules

### Sale Creation

1. **Stock Validation**: Antes de criar a venda, o sistema valida se há estoque suficiente para todos os itens
2. **Atomic Transaction**: A criação da venda e a baixa no estoque ocorrem em uma transação atômica
3. **Sale Number Generation**: Número único gerado no formato `YYYYMMDD-XXXX` (data + sequencial do dia)
4. **Total Calculation**: `total = Σ(item.subtotal) - sale.discount`
5. **Item Subtotal**: `subtotal = (unitPrice × quantity) - item.discount`
6. **Customer Stats**: Se `customerId` for fornecido, atualiza automaticamente `totalSpent`, `purchaseCount` e `lastPurchaseDate`

### Sale Cancellation

1. **Stock Reversal**: Todos os itens têm seu estoque revertido (movimento tipo `RETURN`)
2. **Customer Stats Update**: Se a venda tinha cliente, reverte as estatísticas (`totalSpent` e `purchaseCount`)
3. **Idempotency**: Não é possível cancelar uma venda já cancelada
4. **Audit Trail**: O motivo do cancelamento é registrado no campo `cancellationReason`

### Stock Integration

1. **Movement Type**: Vendas criam movimentos de estoque do tipo `SALE`
2. **Movement Reference**: Cada movimento de estoque referencia o `saleId`
3. **Audit Trail**: Histórico completo de movimentações é mantido na tabela `stock_movements`

---

## Validation Rules

### CreateSaleDto

- `items`: Array não vazio, cada item validado com `SaleItemDto`
- `items[].itemId`: UUID válido
- `items[].unitPrice`: Número >= 0.01
- `items[].quantity`: Número inteiro >= 1
- `items[].discount`: Número >= 0 (opcional)
- `paymentMethod`: Enum válido (`cash`, `debit_card`, `credit_card`, `pix`, `bank_transfer`)
- `customerId`: UUID válido (opcional)
- `discount`: Número >= 0 (opcional)
- `notes`: String (opcional)

### SalesFiltersDto

- `startDate`: String no formato ISO 8601 (opcional)
- `endDate`: String no formato ISO 8601 (opcional)
- `status`: Enum válido (`completed`, `cancelled`, `pending`) (opcional)
- `page`: Número inteiro >= 1 (default: 1)
- `limit`: Número inteiro >= 1 (default: 20)

---

## Examples

### Example 1: Create Simple Sale

**Request:**
```bash
POST /business/establishments/123e4567-e89b-12d3-a456-426614174000/sales
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [
    {
      "itemId": "789e4567-e89b-12d3-a456-426614174000",
      "unitPrice": 5.50,
      "quantity": 2
    },
    {
      "itemId": "456e4567-e89b-12d3-a456-426614174000",
      "unitPrice": 3.00,
      "quantity": 1
    }
  ],
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174000",
  "establishmentId": "123e4567-e89b-12d3-a456-426614174000",
  "saleNumber": "20260228-0001",
  "subtotal": 14.00,
  "discount": 0,
  "total": 14.00,
  "paymentMethod": "cash",
  "status": "completed",
  "createdAt": "2026-02-28T12:30:00.000Z"
}
```

### Example 2: Create Sale with Discount and Customer

**Request:**
```bash
POST /business/establishments/123e4567-e89b-12d3-a456-426614174000/sales
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [
    {
      "itemId": "789e4567-e89b-12d3-a456-426614174000",
      "unitPrice": 10.00,
      "quantity": 3,
      "discount": 2.00
    }
  ],
  "paymentMethod": "pix",
  "customerId": "customer-uuid-here",
  "discount": 3.00,
  "notes": "Cliente fidelidade - desconto especial"
}
```

**Response:**
```json
{
  "id": "def12345-e89b-12d3-a456-426614174000",
  "saleNumber": "20260228-0002",
  "subtotal": 28.00,
  "discount": 3.00,
  "total": 25.00,
  "paymentMethod": "pix",
  "status": "completed",
  "customerId": "customer-uuid-here",
  "notes": "Cliente fidelidade - desconto especial"
}
```

### Example 3: List Sales with Filters

**Request:**
```bash
GET /business/establishments/123e4567-e89b-12d3-a456-426614174000/sales?startDate=2026-02-01&endDate=2026-02-28&status=completed&page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "abc12345-e89b-12d3-a456-426614174000",
      "saleNumber": "20260228-0001",
      "total": 14.00,
      "paymentMethod": "cash",
      "status": "completed",
      "createdAt": "2026-02-28T12:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Example 4: Cancel Sale

**Request:**
```bash
POST /business/establishments/123e4567-e89b-12d3-a456-426614174000/sales/abc12345-e89b-12d3-a456-426614174000/cancel
Content-Type: application/json
Authorization: Bearer <token>

{
  "reason": "Cliente solicitou cancelamento - produto com defeito"
}
```

**Response:**
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174000",
  "saleNumber": "20260228-0001",
  "status": "cancelled",
  "cancellationReason": "Cliente solicitou cancelamento - produto com defeito",
  "total": 14.00,
  "updatedAt": "2026-02-28T13:00:00.000Z"
}
```

---

## Notes

- Todas as datas são retornadas no formato ISO 8601 (UTC)
- Valores monetários são retornados como números com 2 casas decimais
- O sistema mantém um histórico completo de movimentações de estoque
- Vendas canceladas não podem ser reativadas
- O número da venda é único e sequencial por dia dentro de cada estabelecimento
