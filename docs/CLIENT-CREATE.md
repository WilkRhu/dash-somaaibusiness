# Módulo de Clientes - Business

## Visão Geral

O módulo de clientes permite que estabelecimentos gerenciem seus clientes, incluindo cadastro, histórico de compras e programa de fidelidade.

## Endpoints

### 1. Criar Cliente

**POST** `/business/establishments/:establishmentId/customers`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "birthDate": "1990-01-15"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "establishmentId": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "birthDate": "1990-01-15",
  "loyaltyPoints": 0,
  "totalSpent": 0,
  "purchaseCount": 0,
  "lastPurchaseDate": null,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Listar Clientes

**GET** `/business/establishments/:establishmentId/customers`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "loyaltyPoints": 150,
    "totalSpent": 450.00,
    "purchaseCount": 5,
    "lastPurchaseDate": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Buscar Cliente por ID

**GET** `/business/establishments/:establishmentId/customers/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "establishmentId": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "birthDate": "1990-01-15",
  "loyaltyPoints": 150,
  "totalSpent": 450.00,
  "purchaseCount": 5,
  "lastPurchaseDate": "2024-01-15T10:30:00.000Z",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Atualizar Cliente

**PATCH** `/business/establishments/:establishmentId/customers/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "João Silva Santos",
  "phone": "11988888888"
}
```

**Response:** `200 OK`

### 5. Remover Cliente (Soft Delete)

**DELETE** `/business/establishments/:establishmentId/customers/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

### 6. Adicionar Pontos de Fidelidade

**POST** `/business/establishments/:establishmentId/customers/:id/loyalty/add`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "points": 50
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "loyaltyPoints": 200,
  ...
}
```

## Integração com Vendas

O módulo de clientes se integra automaticamente com o módulo de vendas. Quando uma venda é criada com `customerId`, as estatísticas do cliente são atualizadas automaticamente:

- `totalSpent` é incrementado com o valor da venda
- `purchaseCount` é incrementado
- `lastPurchaseDate` é atualizado

## Validações

- **name**: obrigatório, 1-255 caracteres
- **phone**: obrigatório, 10-20 caracteres
- **email**: opcional, formato de email válido
- **cpf**: opcional, 11-14 caracteres
- **birthDate**: opcional, formato ISO date string

## Permissões

Todos os endpoints requerem:
- Autenticação JWT válida
- Usuário deve ser membro do estabelecimento (verificado pelo `EstablishmentOwnershipGuard`)

## Exemplo de Uso Completo

```typescript
// 1. Criar cliente
const customer = await fetch('/business/establishments/123/customers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '11987654321',
    cpf: '98765432100'
  })
});

// 2. Criar venda associada ao cliente
const sale = await fetch('/business/establishments/123/sales', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: customer.id,
    items: [
      { itemId: 'item-uuid', quantity: 2, unitPrice: 10.00 }
    ],
    paymentMethod: 'credit_card'
  })
});

// 3. Adicionar pontos de fidelidade
await fetch(`/business/establishments/123/customers/${customer.id}/loyalty/add`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ points: 20 })
});
```

## Próximos Passos

Para funcionalidades adicionais planejadas:
- Histórico de compras do cliente (integração com módulo de vendas)
- Resgate de pontos de fidelidade
- Segmentação de clientes
- Relatórios de clientes
