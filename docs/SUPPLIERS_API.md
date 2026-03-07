# Suppliers API - Gerenciamento de Fornecedores

## Visão Geral

O módulo de fornecedores permite gerenciar fornecedores e pedidos de compra de um estabelecimento. Facilita o controle de compras, acompanhamento de entregas e histórico de pedidos.

## Endpoints

### 1. Criar Fornecedor

```
POST /business/establishments/:establishmentId/suppliers
```

**Autenticação:** JWT + Owner/Admin/Stock

**Body:**
```json
{
  "name": "Distribuidora ABC",
  "cnpj": "12345678901234",
  "email": "contato@distribuidoraabc.com",
  "phone": "11999999999",
  "address": "Rua das Flores, 123 - São Paulo, SP",
  "notes": "Fornecedor principal de bebidas",
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "supplier-uuid",
    "name": "Distribuidora ABC",
    "cnpj": "12345678901234",
    "email": "contato@distribuidoraabc.com",
    "phone": "11999999999",
    "address": "Rua das Flores, 123 - São Paulo, SP",
    "notes": "Fornecedor principal de bebidas",
    "rating": 5,
    "isActive": true,
    "createdAt": "2026-03-01T10:00:00.000Z"
  },
  "message": "Fornecedor criado com sucesso"
}
```

### 2. Listar Fornecedores

```
GET /business/establishments/:establishmentId/suppliers
```

**Autenticação:** JWT + Owner/Admin/Stock

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "supplier-uuid",
      "name": "Distribuidora ABC",
      "cnpj": "12345678901234",
      "email": "contato@distribuidoraabc.com",
      "phone": "11999999999",
      "rating": 5,
      "isActive": true
    }
  ]
}
```

### 3. Buscar Fornecedor por ID

```
GET /business/establishments/:establishmentId/suppliers/:id
```

**Autenticação:** JWT + Owner/Admin/Stock

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "supplier-uuid",
    "name": "Distribuidora ABC",
    "cnpj": "12345678901234",
    "email": "contato@distribuidoraabc.com",
    "phone": "11999999999",
    "address": "Rua das Flores, 123 - São Paulo, SP",
    "notes": "Fornecedor principal de bebidas",
    "rating": 5,
    "isActive": true,
    "purchaseOrders": [
      {
        "id": "order-uuid",
        "orderNumber": "PO-20260301-0001",
        "total": 1500.00,
        "status": "delivered",
        "createdAt": "2026-03-01T10:00:00.000Z"
      }
    ]
  }
}
```

### 4. Atualizar Fornecedor

```
PATCH /business/establishments/:establishmentId/suppliers/:id
```

**Autenticação:** JWT + Owner/Admin/Stock

**Body:**
```json
{
  "name": "Distribuidora ABC Ltda",
  "phone": "11988888888",
  "rating": 4,
  "isActive": true
}
```

**Todos os campos são opcionais.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "supplier-uuid",
    "name": "Distribuidora ABC Ltda",
    "phone": "11988888888",
    "rating": 4,
    "isActive": true
  },
  "message": "Fornecedor atualizado com sucesso"
}
```

### 5. Deletar Fornecedor

```
DELETE /business/establishments/:establishmentId/suppliers/:id
```

**Autenticação:** JWT + Owner/Admin

**Response:**
```json
{
  "success": true,
  "message": "Fornecedor deletado com sucesso"
}
```

**Nota:** Soft delete - o fornecedor é marcado como inativo mas não é removido do banco.

### 6. Criar Pedido de Compra

```
POST /business/establishments/:establishmentId/suppliers/:id/orders
```

**Autenticação:** JWT + Owner/Admin/Stock

**Body:**
```json
{
  "supplierId": "supplier-uuid",
  "items": [
    {
      "productName": "Coca-Cola 2L",
      "quantity": 50,
      "unitPrice": 5.50,
      "subtotal": 275.00
    },
    {
      "productName": "Guaraná Antarctica 2L",
      "quantity": 30,
      "unitPrice": 4.80,
      "subtotal": 144.00
    }
  ],
  "expectedDeliveryDate": "2026-03-05",
  "notes": "Entregar pela manhã"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "PO-20260301-0001",
    "supplierId": "supplier-uuid",
    "items": [
      {
        "productName": "Coca-Cola 2L",
        "quantity": 50,
        "unitPrice": 5.50,
        "subtotal": 275.00
      },
      {
        "productName": "Guaraná Antarctica 2L",
        "quantity": 30,
        "unitPrice": 4.80,
        "subtotal": 144.00
      }
    ],
    "total": 419.00,
    "status": "pending",
    "expectedDeliveryDate": "2026-03-05T00:00:00.000Z",
    "notes": "Entregar pela manhã",
    "createdAt": "2026-03-01T10:00:00.000Z"
  },
  "message": "Pedido de compra criado com sucesso"
}
```

**Formato do número do pedido:** `PO-YYYYMMDD-XXXX`
- PO = Purchase Order
- YYYYMMDD = Data
- XXXX = Sequencial do dia (0001, 0002, etc.)

### 7. Listar Pedidos de um Fornecedor

```
GET /business/establishments/:establishmentId/suppliers/:id/orders
```

**Autenticação:** JWT + Owner/Admin/Stock

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "PO-20260301-0001",
      "total": 419.00,
      "status": "pending",
      "expectedDeliveryDate": "2026-03-05T00:00:00.000Z",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "supplier": {
        "id": "supplier-uuid",
        "name": "Distribuidora ABC"
      },
      "createdBy": {
        "id": "user-uuid",
        "name": "João Silva"
      }
    }
  ]
}
```

### 8. Listar Todos os Pedidos de Compra

```
GET /business/establishments/:establishmentId/purchase-orders
```

**Query Parameters:**
- `supplierId` (opcional): Filtrar por fornecedor

**Autenticação:** JWT + Owner/Admin/Stock

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "PO-20260301-0001",
      "total": 419.00,
      "status": "pending",
      "expectedDeliveryDate": "2026-03-05T00:00:00.000Z",
      "supplier": {
        "id": "supplier-uuid",
        "name": "Distribuidora ABC"
      },
      "createdBy": {
        "id": "user-uuid",
        "name": "João Silva"
      }
    }
  ]
}
```

### 9. Buscar Pedido de Compra por ID

```
GET /business/establishments/:establishmentId/purchase-orders/:id
```

**Autenticação:** JWT + Owner/Admin/Stock

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "PO-20260301-0001",
    "items": [
      {
        "productName": "Coca-Cola 2L",
        "quantity": 50,
        "unitPrice": 5.50,
        "subtotal": 275.00
      }
    ],
    "total": 419.00,
    "status": "pending",
    "expectedDeliveryDate": "2026-03-05T00:00:00.000Z",
    "notes": "Entregar pela manhã",
    "supplier": {
      "id": "supplier-uuid",
      "name": "Distribuidora ABC",
      "phone": "11999999999"
    },
    "createdBy": {
      "id": "user-uuid",
      "name": "João Silva"
    },
    "createdAt": "2026-03-01T10:00:00.000Z"
  }
}
```

### 10. Atualizar Status do Pedido

```
PATCH /business/establishments/:establishmentId/purchase-orders/:id/status
```

**Autenticação:** JWT + Owner/Admin/Stock

**Body:**
```json
{
  "status": "delivered",
  "deliveredDate": "2026-03-05T09:30:00.000Z",
  "notes": "Entrega realizada com sucesso"
}
```

**Status disponíveis:**
- `pending`: Pendente
- `approved`: Aprovado
- `delivered`: Entregue
- `cancelled`: Cancelado

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "PO-20260301-0001",
    "status": "delivered",
    "deliveredDate": "2026-03-05T09:30:00.000Z",
    "notes": "Entrega realizada com sucesso"
  },
  "message": "Status do pedido atualizado com sucesso"
}
```

**Nota:** Quando o status é alterado para `delivered`, o sistema registra automaticamente a data de entrega.

## Fluxo de Uso

### 1. Cadastrar Fornecedor

```typescript
const response = await axios.post(
  `/business/establishments/${establishmentId}/suppliers`,
  {
    name: 'Distribuidora ABC',
    cnpj: '12345678901234',
    email: 'contato@distribuidoraabc.com',
    phone: '11999999999',
    address: 'Rua das Flores, 123',
    rating: 5
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

### 2. Criar Pedido de Compra

```typescript
const response = await axios.post(
  `/business/establishments/${establishmentId}/suppliers/${supplierId}/orders`,
  {
    supplierId: supplierId,
    items: [
      {
        productName: 'Coca-Cola 2L',
        quantity: 50,
        unitPrice: 5.50,
        subtotal: 275.00
      }
    ],
    expectedDeliveryDate: '2026-03-05',
    notes: 'Entregar pela manhã'
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

### 3. Acompanhar Pedidos

```typescript
// Listar todos os pedidos
const allOrders = await axios.get(
  `/business/establishments/${establishmentId}/purchase-orders`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

// Filtrar por fornecedor
const supplierOrders = await axios.get(
  `/business/establishments/${establishmentId}/purchase-orders?supplierId=${supplierId}`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

### 4. Atualizar Status ao Receber Entrega

```typescript
const response = await axios.patch(
  `/business/establishments/${establishmentId}/purchase-orders/${orderId}/status`,
  {
    status: 'delivered',
    deliveredDate: new Date().toISOString(),
    notes: 'Entrega conferida e aprovada'
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

## Permissões por Role

### business_owner
- ✅ Todas as operações
- ✅ Criar, editar e deletar fornecedores
- ✅ Criar e gerenciar pedidos de compra

### business_admin
- ✅ Todas as operações
- ✅ Criar, editar e deletar fornecedores
- ✅ Criar e gerenciar pedidos de compra

### business_stock
- ✅ Criar e editar fornecedores
- ✅ Criar e gerenciar pedidos de compra
- ❌ Deletar fornecedores

### business_sales
- ❌ Sem acesso ao módulo de fornecedores

### business_marketing
- ❌ Sem acesso ao módulo de fornecedores

## Notas Importantes

1. **CNPJ único**: Cada CNPJ só pode ser cadastrado uma vez por estabelecimento

2. **Soft delete**: Fornecedores deletados são marcados como inativos mas não são removidos

3. **Número do pedido**: Gerado automaticamente no formato `PO-YYYYMMDD-XXXX`

4. **Atualização de estoque**: Quando um pedido é marcado como `delivered`, o sistema registra a entrega (futura integração automática com estoque)

5. **Rating**: Avaliação do fornecedor de 0 a 5 estrelas

6. **Histórico**: Todos os pedidos ficam vinculados ao fornecedor para histórico

## Próximos Passos

Melhorias futuras para o módulo:

1. **Integração automática com estoque**: Atualizar estoque automaticamente quando pedido é entregue
2. **Análise de fornecedores**: Relatórios de desempenho por fornecedor
3. **Previsão de compras**: Sugestões baseadas em histórico de vendas
4. **Aprovação de pedidos**: Workflow de aprovação para pedidos acima de certo valor
5. **Notificações**: Alertas de entrega próxima ou atrasada
