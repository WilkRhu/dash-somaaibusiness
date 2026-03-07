# API de Ofertas - Documentação

## Visão Geral

A API de Ofertas permite que estabelecimentos criem e gerenciem promoções de produtos, com tracking de performance e integração com o app Consumer.

## Endpoints

### 1. Criar Oferta

Cria uma nova oferta para um produto do inventário.

**Endpoint:** `POST /business/establishments/:establishmentId/offers`

**Roles necessárias:** OWNER, ADMIN, MARKETING

**Request Body:**
```json
{
  "itemId": "uuid-do-produto",
  "title": "Promoção de Verão",
  "description": "Desconto especial para o verão",
  "offerPrice": 15.90,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-da-oferta",
  "establishmentId": "uuid-do-estabelecimento",
  "itemId": "uuid-do-produto",
  "title": "Promoção de Verão",
  "description": "Desconto especial para o verão",
  "originalPrice": 25.90,
  "offerPrice": 15.90,
  "discountPercentage": 38.61,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isActive": true,
  "viewCount": 0,
  "saveCount": 0,
  "conversionCount": 0,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

**Validações:**
- `itemId` deve existir e pertencer ao estabelecimento
- `offerPrice` deve ser menor que o preço original do produto
- `startDate` deve ser anterior a `endDate`
- `title` deve ter entre 1 e 255 caracteres

---

### 2. Listar Ofertas

Lista todas as ofertas de um estabelecimento com filtros opcionais.

**Endpoint:** `GET /business/establishments/:establishmentId/offers`

**Roles necessárias:** OWNER, ADMIN, MARKETING, SALES

**Query Parameters:**
- `isActive` (boolean, opcional): Filtrar por status ativo/inativo
- `startDate` (date, opcional): Filtrar por data de início
- `endDate` (date, opcional): Filtrar por data de término

**Exemplo:** `GET /business/establishments/123/offers?isActive=true`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-da-oferta",
    "title": "Promoção de Verão",
    "originalPrice": 25.90,
    "offerPrice": 15.90,
    "discountPercentage": 38.61,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "isActive": true,
    "viewCount": 150,
    "saveCount": 45,
    "conversionCount": 12,
    "item": {
      "id": "uuid-do-produto",
      "name": "Produto X",
      "barcode": "7891234567890"
    }
  }
]
```

---

### 3. Buscar Oferta por ID

Retorna detalhes de uma oferta específica.

**Endpoint:** `GET /business/establishments/:establishmentId/offers/:id`

**Roles necessárias:** OWNER, ADMIN, MARKETING, SALES

**Response:** `200 OK`
```json
{
  "id": "uuid-da-oferta",
  "establishmentId": "uuid-do-estabelecimento",
  "itemId": "uuid-do-produto",
  "title": "Promoção de Verão",
  "description": "Desconto especial para o verão",
  "originalPrice": 25.90,
  "offerPrice": 15.90,
  "discountPercentage": 38.61,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isActive": true,
  "viewCount": 150,
  "saveCount": 45,
  "conversionCount": 12,
  "establishment": {
    "id": "uuid",
    "name": "Meu Estabelecimento"
  },
  "item": {
    "id": "uuid",
    "name": "Produto X",
    "barcode": "7891234567890"
  }
}
```

---

### 4. Atualizar Oferta

Atualiza informações de uma oferta existente.

**Endpoint:** `PATCH /business/establishments/:establishmentId/offers/:id`

**Roles necessárias:** OWNER, ADMIN, MARKETING

**Request Body:** (todos os campos são opcionais)
```json
{
  "title": "Novo Título",
  "description": "Nova descrição",
  "offerPrice": 12.90,
  "startDate": "2024-01-05T00:00:00Z",
  "endDate": "2024-02-05T23:59:59Z",
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-da-oferta",
  "title": "Novo Título",
  "offerPrice": 12.90,
  "discountPercentage": 50.19,
  ...
}
```

**Nota:** Se `offerPrice` for atualizado, `discountPercentage` é recalculado automaticamente.

---

### 5. Remover Oferta

Remove uma oferta permanentemente.

**Endpoint:** `DELETE /business/establishments/:establishmentId/offers/:id`

**Roles necessárias:** OWNER, ADMIN, MARKETING

**Response:** `200 OK`
```json
{
  "message": "Oferta removida com sucesso"
}
```

---

### 6. Ativar Oferta

Ativa uma oferta desativada (se estiver dentro do período de validade).

**Endpoint:** `POST /business/establishments/:establishmentId/offers/:id/activate`

**Roles necessárias:** OWNER, ADMIN, MARKETING

**Response:** `200 OK`
```json
{
  "id": "uuid-da-oferta",
  "isActive": true,
  ...
}
```

**Validação:** A data atual deve estar entre `startDate` e `endDate`.

---

### 7. Desativar Oferta

Desativa uma oferta ativa.

**Endpoint:** `POST /business/establishments/:establishmentId/offers/:id/deactivate`

**Roles necessárias:** OWNER, ADMIN, MARKETING

**Response:** `200 OK`
```json
{
  "id": "uuid-da-oferta",
  "isActive": false,
  ...
}
```

---

### 8. Analytics da Oferta

Retorna métricas de performance de uma oferta.

**Endpoint:** `GET /business/establishments/:establishmentId/offers/:id/analytics`

**Roles necessárias:** OWNER, ADMIN, MARKETING

**Response:** `200 OK`
```json
{
  "offerId": "uuid-da-oferta",
  "title": "Promoção de Verão",
  "viewCount": 150,
  "saveCount": 45,
  "conversionCount": 12,
  "conversionRate": 8.0,
  "saveRate": 30.0,
  "totalRevenue": 190.80,
  "isActive": true,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z"
}
```

**Métricas:**
- `conversionRate`: (conversionCount / viewCount) × 100
- `saveRate`: (saveCount / viewCount) × 100
- `totalRevenue`: conversionCount × offerPrice

---

## Códigos de Erro

### 400 Bad Request
- Item não pertence ao estabelecimento
- Preço da oferta maior ou igual ao preço original
- Data de início posterior à data de término
- Oferta fora do período de validade (ao ativar)

### 404 Not Found
- Oferta não encontrada
- Item não encontrado

### 403 Forbidden
- Usuário não tem permissão para acessar o estabelecimento
- Role insuficiente para a operação

---

## Fluxo de Uso

1. **Criar oferta**: Selecione um produto do inventário e defina preço e período
2. **Monitorar performance**: Use o endpoint de analytics para acompanhar visualizações e conversões
3. **Ajustar oferta**: Atualize preço ou período conforme necessário
4. **Ativar/Desativar**: Controle quando a oferta está visível para consumidores
5. **Remover**: Delete ofertas que não são mais necessárias

---

## Integração com Consumer

Ofertas ativas são automaticamente sincronizadas com o app Consumer e aparecem para usuários próximos ao estabelecimento. Os contadores de visualização, salvamento e conversão são atualizados automaticamente quando usuários interagem com as ofertas.

---

## Limites por Plano

O número de ofertas ativas simultâneas pode ser limitado pelo plano de assinatura do estabelecimento:

- **Básico**: 5 ofertas ativas
- **Profissional**: 20 ofertas ativas
- **Enterprise**: Ilimitado

Verifique o endpoint `/subscriptions/usage` para ver os limites atuais.
