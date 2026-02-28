# SomaAI Business - Contrato de API para Frontend

## Sumário
- [Autenticação](#autenticação)
- [Establishments (Estabelecimentos)](#establishments-estabelecimentos)
- [Inventory (Inventário)](#inventory-inventário)
- [Tipos e Enums](#tipos-e-enums)

---

## Autenticação

Todas as rotas requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

---

## Establishments (Estabelecimentos)

### 1. Criar Estabelecimento
**POST** `/business/establishments`

**Body:**
```typescript
{
  name: string;              // min: 3, max: 255
  cnpj: string;              // formato: XX.XXX.XXX/XXXX-XX
  type: string;              // ex: "padaria", "mercado", "restaurante"
  phone?: string;            // max: 20
  email?: string;            // email válido
  address?: string;
  city?: string;             // max: 100
  state?: string;            // max: 2 (UF)
  zipCode?: string;          // max: 10
  latitude?: number;
  longitude?: number;
  businessHours?: {          // JSON com horários
    monday?: { open: string; close: string; };
    tuesday?: { open: string; close: string; };
    // ... outros dias
  };
  description?: string;
  logo?: string;             // Base64 ou URL
}
```

**Response 201:**
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    cnpj: string;
    type: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    latitude: number | null;
    longitude: number | null;
    businessHours: object | null;
    description: string | null;
    logo: string | null;
    ownerId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: "Estabelecimento criado com sucesso";
}
```

**Errors:**
- 400: Dados inválidos
- 409: CNPJ já cadastrado

---

### 2. Listar Meus Estabelecimentos
**GET** `/business/establishments`

**Response 200:**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    name: string;
    cnpj: string;
    type: string;
    logo: string | null;
    role: "business_owner" | "business_admin" | "business_sales" | "business_stock" | "business_marketing";
    // ... outros campos
  }>;
}
```

---

### 3. Buscar Estabelecimento por ID
**GET** `/business/establishments/:id`

**Response 200:**
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    cnpj: string;
    // ... todos os campos
    owner: {
      id: string;
      name: string;
      email: string;
    };
    members: Array<{
      id: string;
      userId: string;
      role: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  };
}
```

**Errors:**
- 403: Sem permissão (não é membro)
- 404: Estabelecimento não encontrado

---

### 4. Atualizar Estabelecimento
**PATCH** `/business/establishments/:id`

**Permissões:** Apenas OWNER

**Body:** (todos os campos opcionais)
```typescript
{
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  businessHours?: object;
  description?: string;
}
```

**Response 200:**
```typescript
{
  success: true;
  data: { /* estabelecimento atualizado */ };
  message: "Estabelecimento atualizado com sucesso";
}
```

---

### 5. Deletar Estabelecimento
**DELETE** `/business/establishments/:id`

**Permissões:** Apenas OWNER

**Response 200:**
```typescript
{
  success: true;
  message: "Estabelecimento deletado com sucesso";
}
```

---

### 6. Adicionar Membro
**POST** `/business/establishments/:id/members`

**Permissões:** OWNER ou ADMIN

**Body:**
```typescript
{
  userId: string;
  role: "business_admin" | "business_sales" | "business_stock" | "business_marketing";
}
```

**Response 201:**
```typescript
{
  success: true;
  data: {
    id: string;
    userId: string;
    establishmentId: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  message: "Membro adicionado com sucesso";
}
```

**Errors:**
- 409: Usuário já é membro

---

### 7. Remover Membro
**DELETE** `/business/establishments/:id/members/:userId`

**Permissões:** OWNER ou ADMIN

**Response 200:**
```typescript
{
  success: true;
  message: "Membro removido com sucesso";
}
```

---

### 8. Atualizar Role do Membro
**PATCH** `/business/establishments/:id/members/:userId/role`

**Permissões:** OWNER ou ADMIN

**Body:**
```typescript
{
  role: "business_admin" | "business_sales" | "business_stock" | "business_marketing";
}
```

**Response 200:**
```typescript
{
  success: true;
  data: { /* membro atualizado */ };
  message: "Role atualizado com sucesso";
}
```

---

### 9. Upload de Logo
**POST** `/business/establishments/:id/logo`

**Permissões:** Apenas OWNER

**Content-Type:** `multipart/form-data`

**Body:**
```typescript
{
  logo: File; // JPEG, PNG ou WebP, máximo 5MB
}
```

**Response 200:**
```typescript
{
  success: true;
  data: {
    id: string;
    logo: string; // URL da logo
  };
  message: "Logo atualizado com sucesso";
}
```

---

## Inventory (Inventário)

### 1. Adicionar Produto
**POST** `/business/establishments/:establishmentId/inventory`

**Permissões:** OWNER, ADMIN ou STOCK

**Body:**
```typescript
{
  barcode?: string;          // max: 50
  name: string;              // min: 3, max: 255
  category?: string;         // max: 100
  brand?: string;            // max: 100
  costPrice: number;         // >= 0
  salePrice: number;         // >= 0
  quantity: number;          // >= 0
  minQuantity: number;       // >= 0 (estoque mínimo para alertas)
  unit: string;              // ex: "un", "kg", "l", "cx"
  expirationDate?: string;   // ISO date string
  image?: string;            // URL
  description?: string;
}
```

**Response 201:**
```typescript
{
  success: true;
  data: {
    id: string;
    establishmentId: string;
    barcode: string | null;
    name: string;
    category: string | null;
    brand: string | null;
    costPrice: number;
    salePrice: number;
    quantity: number;
    minQuantity: number;
    unit: string;
    expirationDate: string | null;
    image: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: "Produto adicionado com sucesso";
}
```

---

### 2. Listar Produtos
**GET** `/business/establishments/:establishmentId/inventory`

**Query Params:**
```typescript
{
  search?: string;           // busca por nome ou código de barras
  category?: string;         // filtrar por categoria
  brand?: string;            // filtrar por marca
  sortBy?: "name" | "quantity" | "salePrice" | "createdAt";
  sortOrder?: "ASC" | "DESC";
  page?: number;             // padrão: 1
  limit?: number;            // padrão: 20
}
```

**Response 200:**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    name: string;
    barcode: string | null;
    category: string | null;
    brand: string | null;
    costPrice: number;
    salePrice: number;
    quantity: number;
    minQuantity: number;
    unit: string;
    // ... outros campos
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

### 3. Buscar Produto por ID
**GET** `/business/establishments/:establishmentId/inventory/:id`

**Response 200:**
```typescript
{
  success: true;
  data: {
    id: string;
    // ... todos os campos do produto
  };
}
```

**Errors:**
- 404: Produto não encontrado

---

### 4. Atualizar Produto
**PATCH** `/business/establishments/:establishmentId/inventory/:id`

**Permissões:** OWNER, ADMIN ou STOCK

**Body:** (todos os campos opcionais)
```typescript
{
  name?: string;
  category?: string;
  brand?: string;
  costPrice?: number;
  salePrice?: number;
  minQuantity?: number;
  unit?: string;
  expirationDate?: string;
  image?: string;
  description?: string;
}
```

**Response 200:**
```typescript
{
  success: true;
  data: { /* produto atualizado */ };
  message: "Produto atualizado com sucesso";
}
```

---

### 5. Deletar Produto
**DELETE** `/business/establishments/:establishmentId/inventory/:id`

**Permissões:** OWNER ou ADMIN

**Response 200:**
```typescript
{
  success: true;
  message: "Produto deletado com sucesso";
}
```

---

### 6. Atualizar Estoque
**POST** `/business/establishments/:establishmentId/inventory/:id/stock`

**Permissões:** OWNER, ADMIN ou STOCK

**Body:**
```typescript
{
  type: "entry" | "sale" | "adjustment" | "loss" | "return";
  quantity: number;          // >= 0
  reason?: string;           // motivo da movimentação
}
```

**Tipos de Movimentação:**
- `entry`: Entrada de estoque (adiciona)
- `sale`: Venda (subtrai)
- `adjustment`: Ajuste (define quantidade absoluta)
- `loss`: Perda/quebra (subtrai)
- `return`: Devolução (adiciona)

**Response 200:**
```typescript
{
  success: true;
  data: {
    id: string;
    quantity: number; // nova quantidade
    // ... outros campos
  };
  message: "Estoque atualizado com sucesso";
}
```

**Errors:**
- 400: Estoque não pode ficar negativo

---

### 7. Produtos com Estoque Baixo
**GET** `/business/establishments/:establishmentId/inventory/alerts/low-stock`

**Response 200:**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    name: string;
    quantity: number;
    minQuantity: number;
    unit: string;
    // ... outros campos
  }>;
  count: number;
}
```

---

### 8. Produtos Vencendo
**GET** `/business/establishments/:establishmentId/inventory/alerts/expiring`

**Query Params:**
```typescript
{
  daysAhead?: number;        // padrão: 30 dias
}
```

**Response 200:**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    name: string;
    expirationDate: string;
    quantity: number;
    unit: string;
    // ... outros campos
  }>;
  count: number;
}
```

---

### 9. Histórico de Movimentações
**GET** `/business/establishments/:establishmentId/inventory/:id/history`

**Response 200:**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    inventoryItemId: string;
    type: "entry" | "sale" | "adjustment" | "loss" | "return";
    quantity: number;
    previousQuantity: number;
    newQuantity: number;
    reason: string | null;
    saleId: string | null;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
  count: number;
}
```

---

## Tipos e Enums

### BusinessRole
```typescript
enum BusinessRole {
  OWNER = "business_owner",
  ADMIN = "business_admin",
  SALES = "business_sales",
  STOCK = "business_stock",
  MARKETING = "business_marketing"
}
```

### StockMovementType
```typescript
enum StockMovementType {
  ENTRY = "entry",
  SALE = "sale",
  ADJUSTMENT = "adjustment",
  LOSS = "loss",
  RETURN = "return"
}
```

### InventorySortBy
```typescript
enum InventorySortBy {
  NAME = "name",
  QUANTITY = "quantity",
  SALE_PRICE = "salePrice",
  CREATED_AT = "createdAt"
}
```

### SortOrder
```typescript
enum SortOrder {
  ASC = "ASC",
  DESC = "DESC"
}
```

---

## Exemplos de Uso (React/Next.js)

### Criar Estabelecimento
```typescript
const createEstablishment = async (data: CreateEstablishmentDto) => {
  const response = await fetch('http://localhost:3001/business/establishments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
};
```

### Listar Produtos com Filtros
```typescript
const listProducts = async (establishmentId: string, filters: InventoryFiltersDto) => {
  const params = new URLSearchParams(filters as any);
  
  const response = await fetch(
    `http://localhost:3001/business/establishments/${establishmentId}/inventory?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.json();
};
```

### Atualizar Estoque
```typescript
const updateStock = async (
  establishmentId: string,
  itemId: string,
  data: UpdateStockDto
) => {
  const response = await fetch(
    `http://localhost:3001/business/establishments/${establishmentId}/inventory/${itemId}/stock`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );
  
  return response.json();
};
```

---

## Códigos de Erro Comuns

- **400 Bad Request**: Dados inválidos ou regra de negócio violada
- **401 Unauthorized**: Token inválido ou ausente
- **403 Forbidden**: Sem permissão para acessar o recurso
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: CNPJ duplicado, usuário já é membro)
- **500 Internal Server Error**: Erro no servidor

---

## Notas Importantes

1. **Autenticação**: Todas as rotas requerem JWT token válido
2. **Permissões**: Verifique os roles necessários para cada operação
3. **Paginação**: Use `page` e `limit` para controlar a quantidade de dados
4. **Estoque**: Movimentações de estoque são transacionais e auditadas
5. **Soft Delete**: Estabelecimentos e produtos são deletados logicamente (soft delete)
6. **Validações**: O backend valida todos os dados antes de processar
