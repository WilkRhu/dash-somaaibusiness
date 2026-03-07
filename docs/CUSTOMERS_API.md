# Customers API Documentation

API para gerenciamento de clientes e programa de fidelidade.

## Endpoints

### 1. Criar Cliente

```http
POST /business/establishments/:establishmentId/customers
```

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11987654321",
  "cpf": "12345678900",
  "birthDate": "1990-05-15"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11987654321",
  "cpf": "12345678900",
  "birthDate": "1990-05-15",
  "loyaltyPoints": 0,
  "totalSpent": 0,
  "purchaseCount": 0,
  "lastPurchaseDate": null,
  "isActive": true,
  "establishmentId": "uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### 2. Listar Clientes

```http
GET /business/establishments/:establishmentId/customers
```

**Query Parameters:**
- `search` (opcional): Busca por nome, telefone, CPF ou email
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

Sem paginação:
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11987654321",
    "loyaltyPoints": 150,
    "totalSpent": 1500.00,
    "purchaseCount": 10,
    "lastPurchaseDate": "2024-01-15T10:00:00Z"
  }
]
```

Com paginação:
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

### 3. Buscar Cliente por ID

```http
GET /business/establishments/:establishmentId/customers/:id
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11987654321",
  "cpf": "12345678900",
  "birthDate": "1990-05-15",
  "loyaltyPoints": 150,
  "totalSpent": 1500.00,
  "purchaseCount": 10,
  "lastPurchaseDate": "2024-01-15T10:00:00Z",
  "isActive": true,
  "establishmentId": "uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### 4. Atualizar Cliente

```http
PATCH /business/establishments/:establishmentId/customers/:id
```

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "João Silva Santos",
  "phone": "11999887766"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "João Silva Santos",
  "phone": "11999887766",
  ...
}
```

---

### 5. Deletar Cliente (Soft Delete)

```http
DELETE /business/establishments/:establishmentId/customers/:id
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### 6. Histórico de Compras

```http
GET /business/establishments/:establishmentId/customers/:id/purchases
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "saleNumber": "SALE-001",
    "total": 150.00,
    "paymentMethod": "credit_card",
    "status": "completed",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

---

### 7. Consultar Pontos de Fidelidade

```http
GET /business/establishments/:establishmentId/customers/:id/loyalty
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "customerId": "uuid",
  "customerName": "João Silva",
  "currentPoints": 150,
  "totalEarned": 150,
  "totalRedeemed": 0
}
```

---

### 8. Adicionar Pontos de Fidelidade

```http
POST /business/establishments/:establishmentId/customers/:id/loyalty/add
```

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

---

### 9. Resgatar Pontos de Fidelidade

```http
POST /business/establishments/:establishmentId/customers/:id/loyalty/redeem
```

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "points": 100
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "loyaltyPoints": 100,
  ...
}
```

**Errors:**
- `400 Bad Request`: Saldo insuficiente
```json
{
  "statusCode": 400,
  "message": "Saldo insuficiente. Cliente possui 50 pontos"
}
```

---

## Endpoints Simplificados (sem establishmentId na URL)

Para facilitar o uso, também existem endpoints que automaticamente usam o primeiro estabelecimento do usuário:

```http
POST /business/customers
GET /business/customers
```

---

## Regras de Negócio

### Programa de Fidelidade

- **Acúmulo de Pontos**: 1 ponto a cada R$ 10 gastos
- **Resgate**: Pontos podem ser resgatados a qualquer momento
- **Validação**: Sistema valida saldo antes do resgate

### Atualização Automática de Estatísticas

Quando uma venda é criada com um cliente associado:
- `totalSpent` é incrementado com o valor da venda
- `purchaseCount` é incrementado em 1
- `lastPurchaseDate` é atualizado para a data atual
- Pontos de fidelidade são adicionados automaticamente

### Busca e Filtros

A busca (`search`) procura em:
- Nome do cliente
- Telefone
- CPF
- Email

---

## Exemplos de Uso

### Criar e gerenciar cliente

```bash
# 1. Criar cliente
curl -X POST http://localhost:3000/business/establishments/{id}/customers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "phone": "11987654321",
    "email": "maria@email.com"
  }'

# 2. Buscar clientes
curl -X GET "http://localhost:3000/business/establishments/{id}/customers?search=Maria&page=1&limit=10" \
  -H "Authorization: Bearer {token}"

# 3. Adicionar pontos
curl -X POST http://localhost:3000/business/establishments/{id}/customers/{customerId}/loyalty/add \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"points": 50}'
```

---

## Integração com Vendas

O módulo de Customers se integra automaticamente com o módulo de Sales:

```typescript
// Ao criar uma venda com cliente
const sale = await salesService.createSale({
  customerId: 'customer-uuid',
  items: [...],
  total: 150.00
});

// Automaticamente:
// - customer.totalSpent += 150.00
// - customer.purchaseCount += 1
// - customer.lastPurchaseDate = now()
// - customer.loyaltyPoints += 15 (150 * 0.1)
```

---

## Validações

### CreateCustomerDto
- `name`: obrigatório, 1-255 caracteres
- `email`: opcional, formato de email válido
- `phone`: obrigatório, 10-20 caracteres
- `cpf`: opcional, 11-14 caracteres
- `birthDate`: opcional, formato ISO date

### AddLoyaltyPointsDto / RedeemLoyaltyPointsDto
- `points`: obrigatório, inteiro, mínimo 1

---

## Códigos de Erro

- `400 Bad Request`: Dados inválidos ou saldo insuficiente
- `401 Unauthorized`: Token inválido ou ausente
- `403 Forbidden`: Usuário não tem permissão no estabelecimento
- `404 Not Found`: Cliente não encontrado
