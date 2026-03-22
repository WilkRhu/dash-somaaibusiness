# API Routes: Delivery e Entregadores

## 🚚 ENTREGADORES (Drivers)

### 1. Criar Entregador
```
POST /business/establishments/:establishmentId/delivery/drivers
```

**Recebe:**
```json
{
  "name": "João Silva",
  "phone": "+5511987654321",
  "email": "joao@example.com",
  "vehicleType": "motorcycle",
  "vehiclePlate": "ABC-1234",
  "userId": "user-456"
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "establishmentId": "est-123",
    "name": "João Silva",
    "phone": "+5511987654321",
    "email": "joao@example.com",
    "vehicleType": "motorcycle",
    "vehiclePlate": "ABC-1234",
    "isActive": true,
    "isAvailable": true,
    "totalDeliveries": 0,
    "averageRating": 0,
    "createdAt": "2026-03-20T10:30:00Z",
    "updatedAt": "2026-03-20T10:30:00Z"
  },
  "message": "Entregador criado com sucesso"
}
```

---

### 2. Listar Entregadores
```
GET /business/establishments/:establishmentId/delivery/drivers
GET /business/establishments/:establishmentId/delivery/drivers?isActive=true&isAvailable=true&page=1&limit=10
```

**Recebe:** Query params (opcional)
- `isActive`: true/false
- `isAvailable`: true/false
- `page`: número
- `limit`: número

**Envia:**
```json
{
  "success": true,
  "data": [
    {
      "id": "driver-789",
      "name": "João Silva",
      "phone": "+5511987654321",
      "vehicleType": "motorcycle",
      "vehiclePlate": "ABC-1234",
      "isActive": true,
      "isAvailable": true,
      "totalDeliveries": 45,
      "averageRating": 4.8
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 3. Obter Entregador
```
GET /business/establishments/:establishmentId/delivery/drivers/:driverId
```

**Recebe:** Nada

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "establishmentId": "est-123",
    "name": "João Silva",
    "phone": "+5511987654321",
    "email": "joao@example.com",
    "vehicleType": "motorcycle",
    "vehiclePlate": "ABC-1234",
    "isActive": true,
    "isAvailable": true,
    "totalDeliveries": 45,
    "averageRating": 4.8,
    "createdAt": "2026-03-20T10:30:00Z",
    "updatedAt": "2026-03-20T10:30:00Z"
  }
}
```

---

### 4. Atualizar Entregador
```
PUT /business/establishments/:establishmentId/delivery/drivers/:driverId
```

**Recebe:**
```json
{
  "name": "João Silva Santos",
  "phone": "+5511987654322",
  "email": "joao.silva@example.com",
  "vehicleType": "car",
  "vehiclePlate": "XYZ-5678",
  "isActive": true,
  "isAvailable": true
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva Santos",
    "phone": "+5511987654322",
    "email": "joao.silva@example.com",
    "vehicleType": "car",
    "vehiclePlate": "XYZ-5678",
    "isActive": true,
    "isAvailable": true
  },
  "message": "Entregador atualizado com sucesso"
}
```

---

### 5. Deletar Entregador
```
DELETE /business/establishments/:establishmentId/delivery/drivers/:driverId
```

**Recebe:** Nada

**Envia:**
```json
{
  "success": true,
  "message": "Entregador deletado com sucesso"
}
```

---

### 6. Alternar Disponibilidade
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/availability
```

**Recebe:**
```json
{
  "isAvailable": false
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva",
    "isAvailable": false
  },
  "message": "Entregador indisponível"
}
```

---

### 7. Alternar Status Ativo
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/status
```

**Recebe:**
```json
{
  "isActive": false
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva",
    "isActive": false
  },
  "message": "Entregador desativado"
}
```

---

### 8. Listar Entregadores Disponíveis
```
GET /business/establishments/:establishmentId/delivery/drivers/available/list
```

**Recebe:** Nada

**Envia:**
```json
{
  "success": true,
  "data": [
    {
      "id": "driver-789",
      "name": "João Silva",
      "phone": "+5511987654321",
      "vehicleType": "motorcycle",
      "isActive": true,
      "isAvailable": true,
      "averageRating": 4.8
    }
  ],
  "count": 1
}
```

---

### 9. Upload Foto de Perfil
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/profile-photo
```

**Recebe:**
```json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva",
    "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
  },
  "message": "Foto de perfil atualizada com sucesso"
}
```

---

### 10. Upload Foto do Veículo
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/vehicle-photo
```

**Recebe:**
```json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva",
    "vehiclePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
  },
  "message": "Foto do veículo atualizada com sucesso"
}
```

---

### 11. Upload Ambas as Fotos
```
PATCH /business/establishments/:establishmentId/delivery/drivers/:driverId/photos
```

**Recebe:**
```json
{
  "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=",
  "vehiclePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "driver-789",
    "name": "João Silva",
    "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=",
    "vehiclePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
  },
  "message": "Fotos atualizadas com sucesso"
}
```

---

## 📦 PEDIDOS DE DELIVERY

### 1. Criar Pedido
```
POST /business/establishments/:establishmentId/delivery/orders
```

**Recebe:**
```json
{
  "customerId": "cust-456",
  "customerName": "João Silva",
  "customerPhone": "11987654321",
  "deliveryAddress": "Rua ABC, 123",
  "deliveryNeighborhood": "Centro",
  "deliveryCity": "São Paulo",
  "deliveryState": "SP",
  "deliveryZipCode": "01234-567",
  "items": [
    {
      "itemId": "item-789",
      "quantity": 2,
      "unitPrice": 25.90
    }
  ],
  "paymentMethod": "pix"
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "establishmentId": "est-123",
    "orderNumber": "ORD-001",
    "status": "pending",
    "customerName": "João Silva",
    "deliveryAddress": "Rua ABC, 123",
    "deliveryFee": 8.00,
    "total": 100.00,
    "estimatedDeliveryTime": 30,
    "createdAt": "2026-03-20T10:30:00Z"
  },
  "message": "Pedido de delivery criado com sucesso"
}
```

---

### 2. Listar Pedidos
```
GET /business/establishments/:establishmentId/delivery/orders
GET /business/establishments/:establishmentId/delivery/orders?status=pending&driverId=driver-789&page=1&limit=10
```

**Recebe:** Query params (opcional)
- `status`: pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled
- `driverId`: id do entregador
- `userId`: id do usuário
- `startDate`: data inicial
- `endDate`: data final
- `page`: número
- `limit`: número

**Envia:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-123",
      "orderNumber": "ORD-001",
      "status": "pending",
      "customerName": "João Silva",
      "deliveryAddress": "Rua ABC, 123",
      "deliveryFee": 8.00,
      "total": 100.00,
      "driverId": null,
      "createdAt": "2026-03-20T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 3. Obter Pedido
```
GET /business/establishments/:establishmentId/delivery/orders/:orderId
```

**Recebe:** Nada

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "establishmentId": "est-123",
    "orderNumber": "ORD-001",
    "status": "pending",
    "customerName": "João Silva",
    "customerPhone": "11987654321",
    "deliveryAddress": "Rua ABC, 123",
    "deliveryNeighborhood": "Centro",
    "deliveryCity": "São Paulo",
    "deliveryState": "SP",
    "deliveryZipCode": "01234-567",
    "deliveryFee": 8.00,
    "total": 100.00,
    "estimatedDeliveryTime": 30,
    "driverId": null,
    "driver": null,
    "createdAt": "2026-03-20T10:30:00Z"
  }
}
```

---

### 4. Atualizar Status do Pedido
```
PATCH /business/establishments/:establishmentId/delivery/orders/:orderId/status
```

**Recebe:**
```json
{
  "status": "confirmed"
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "status": "confirmed",
    "confirmedAt": "2026-03-20T10:35:00Z"
  },
  "message": "Status atualizado com sucesso"
}
```

---

### 5. Atribuir Entregador ao Pedido
```
POST /business/establishments/:establishmentId/delivery/orders/:orderId/assign-driver
```

**Recebe:**
```json
{
  "driverId": "driver-789"
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "status": "out_for_delivery",
    "driverId": "driver-789",
    "driver": {
      "id": "driver-789",
      "name": "João Silva",
      "phone": "+5511987654321",
      "vehicleType": "motorcycle",
      "vehiclePlate": "ABC-1234"
    }
  },
  "message": "Entregador atribuído com sucesso"
}
```

---

## 🗺️ ZONAS DE ENTREGA

### 1. Criar Zona
```
POST /business/establishments/:establishmentId/delivery/zones
```

**Recebe:**
```json
{
  "name": "Centro",
  "neighborhoods": ["Centro", "Bom Retiro"],
  "deliveryFee": 8.00,
  "radiusKm": 5,
  "centerLatitude": -23.5505,
  "centerLongitude": -46.6333,
  "isActive": true
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "zone-123",
    "establishmentId": "est-123",
    "name": "Centro",
    "neighborhoods": ["Centro", "Bom Retiro"],
    "deliveryFee": 8.00,
    "radiusKm": 5,
    "centerLatitude": -23.5505,
    "centerLongitude": -46.6333,
    "isActive": true,
    "createdAt": "2026-03-20T10:30:00Z"
  },
  "message": "Zona de entrega criada com sucesso"
}
```

---

### 2. Listar Zonas
```
GET /business/establishments/:establishmentId/delivery/zones
```

**Recebe:** Nada

**Envia:**
```json
{
  "success": true,
  "data": [
    {
      "id": "zone-123",
      "name": "Centro",
      "neighborhoods": ["Centro", "Bom Retiro"],
      "deliveryFee": 8.00,
      "radiusKm": 5,
      "isActive": true
    }
  ],
  "count": 1
}
```

---

### 3. Atualizar Zona
```
PUT /business/establishments/:establishmentId/delivery/zones/:zoneId
PATCH /business/establishments/:establishmentId/delivery/zones/:zoneId
```

**Recebe:**
```json
{
  "name": "Centro Expandido",
  "neighborhoods": ["Centro", "Bom Retiro", "Consolação"],
  "deliveryFee": 10.00,
  "radiusKm": 8,
  "isActive": true
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "id": "zone-123",
    "name": "Centro Expandido",
    "neighborhoods": ["Centro", "Bom Retiro", "Consolação"],
    "deliveryFee": 10.00,
    "radiusKm": 8,
    "isActive": true
  },
  "message": "Zona de entrega atualizada com sucesso"
}
```

---

## 💰 CÁLCULOS

### 1. Calcular Taxa de Entrega
```
POST /business/establishments/:establishmentId/delivery/calculate-fee
```

**Recebe:**
```json
{
  "neighborhood": "Centro",
  "latitude": -23.5505,
  "longitude": -46.6333
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "deliveryFee": 8.00,
    "estimatedTime": 30,
    "zoneId": "zone-123"
  }
}
```

---

### 2. Verificar Disponibilidade
```
POST /business/establishments/:establishmentId/delivery/check-availability
```

**Recebe:**
```json
{
  "neighborhood": "Centro",
  "latitude": -23.5505,
  "longitude": -46.6333
}
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "deliveryFee": 8.00,
    "estimatedTime": 30
  }
}
```

---

## 📊 RELATÓRIOS

### 1. Relatório Geral
```
GET /business/establishments/:establishmentId/delivery/reports/general?startDate=2026-03-01&endDate=2026-03-31
```

**Recebe:** Query params
- `startDate`: data inicial
- `endDate`: data final

**Envia:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 1200.00,
    "averageDeliveryTime": 28,
    "successRate": 98.5
  }
}
```

---

### 2. Relatório por Entregador
```
GET /business/establishments/:establishmentId/delivery/reports/drivers?startDate=2026-03-01&endDate=2026-03-31
```

**Recebe:** Query params
- `startDate`: data inicial
- `endDate`: data final

**Envia:**
```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "driverId": "driver-789",
        "driverName": "João Silva",
        "totalDeliveries": 45,
        "averageRating": 4.8,
        "totalRevenue": 360.00,
        "averageDeliveryTime": 28
      }
    ]
  }
}
```

---

### 3. Relatório Diário
```
GET /business/establishments/:establishmentId/delivery/reports/daily?startDate=2026-03-01&endDate=2026-03-31
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "daily": [
      {
        "date": "2026-03-20",
        "totalOrders": 5,
        "totalRevenue": 40.00,
        "averageDeliveryTime": 28
      }
    ]
  }
}
```

---

### 4. Relatório de Atrasos
```
GET /business/establishments/:establishmentId/delivery/reports/delays?startDate=2026-03-01&endDate=2026-03-31
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "delayedOrders": 2,
    "delayPercentage": 1.5,
    "averageDelayMinutes": 15
  }
}
```

---

### 5. Relatório de Receita
```
GET /business/establishments/:establishmentId/delivery/reports/revenue?startDate=2026-03-01&endDate=2026-03-31
```

**Envia:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 1200.00,
    "byPaymentMethod": {
      "pix": 600.00,
      "credit_card": 400.00,
      "cash": 200.00
    }
  }
}
```

---

## 🔐 Headers Obrigatórios

Todas as requisições devem incluir:

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## ✅ Status Codes

- `200` - Sucesso
- `201` - Criado
- `400` - Erro de validação
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `500` - Erro do servidor

---

## 📝 Tipos de Veículos

```
motorcycle  - Moto
bicycle     - Bicicleta
car         - Carro
van         - Van
truck       - Caminhão
```

---

## 📊 Status de Pedido

```
pending              - Pendente
confirmed            - Confirmado
preparing            - Preparando
ready                - Pronto
out_for_delivery     - Saiu para Entrega
delivered            - Entregue
cancelled            - Cancelado
```

---

## 💳 Métodos de Pagamento

```
pix
credit_card
debit_card
cash
```

