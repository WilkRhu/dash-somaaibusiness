# Integração Dashboard e App - Delivery

## 📊 Campos Disponíveis na Entidade DeliveryOrder

A entidade `DeliveryOrder` possui todos os campos necessários para integração. Aqui está o mapeamento completo:

---

## 🏪 Dashboard do Estabelecimento

### O que o estabelecimento precisa ver

#### 1. Lista de Pedidos (Visão Geral)

```typescript
interface DeliveryOrderListItem {
  id: string;                          // ID do pedido
  orderNumber: string;                 // Número do pedido (ex: "PED-001")
  customerName: string;                // Nome do cliente
  customerPhone: string;               // Telefone do cliente
  status: DeliveryStatus;              // Status (pending, confirmed, preparing, etc)
  total: number;                       // Valor total
  deliveryFee: number;                 // Taxa de entrega
  estimatedDeliveryTime: number;       // Tempo estimado em minutos
  estimatedDeliveryTimestamp: Date;    // Timestamp da entrega estimada
  isDelayed: boolean;                  // Se está atrasada
  delayMinutes: number;                // Quantos minutos de atraso
  driverId: string;                    // ID do entregador
  driver: {                            // Dados do entregador
    id: string;
    name: string;
    phone: string;
    vehicle: string;
  };
  createdAt: Date;                     // Quando foi criado
  updatedAt: Date;                     // Última atualização
}
```

**Campos do Backend:**
```typescript
✅ id
✅ orderNumber
✅ customerName
✅ customerPhone
✅ status
✅ total
✅ deliveryFee
✅ estimatedDeliveryTime
✅ estimatedDeliveryTimestamp
✅ isDelayed
✅ delayMinutes
✅ driverId
✅ driver (relação)
✅ createdAt
✅ updatedAt
```

#### 2. Detalhes do Pedido

```typescript
interface DeliveryOrderDetail {
  // Informações básicas
  id: string;
  orderNumber: string;
  status: DeliveryStatus;
  
  // Cliente
  customerName: string;
  customerPhone: string;
  customerId: string;
  
  // Endereço de entrega
  deliveryAddress: string;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryComplement: string;
  deliveryReference: string;
  latitude: number;
  longitude: number;
  
  // Valores
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  
  // Entrega
  estimatedDeliveryTime: number;
  estimatedDeliveryTimestamp: Date;
  isDelayed: boolean;
  delayMinutes: number;
  
  // Entregador
  driverId: string;
  driver: DeliveryDriver;
  
  // Pagamento
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  isPaid: boolean;
  
  // Observações
  notes: string;
  internalNotes: string;
  
  // Timeline
  confirmedAt: Date;
  preparingAt: Date;
  readyAt: Date;
  dispatchedAt: Date;
  deliveredAt: Date;
  cancelledAt: Date;
  cancellationReason: string;
  
  // Rastreamento
  tracking: DeliveryTracking[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

**Campos do Backend:**
```typescript
✅ Todos os campos acima estão disponíveis
```

#### 3. Filtros e Busca

```typescript
interface DeliveryOrderFilters {
  status?: DeliveryStatus;           // Filtrar por status
  startDate?: Date;                  // Data inicial
  endDate?: Date;                    // Data final
  driverId?: string;                 // Filtrar por entregador
  isDelayed?: boolean;               // Apenas atrasadas
  paymentStatus?: PaymentStatus;     // Filtrar por pagamento
  search?: string;                   // Buscar por nome/telefone/número
}
```

**Endpoints Disponíveis:**
```typescript
GET /business/establishments/:id/delivery/orders
  ?status=out_for_delivery
  &startDate=2024-03-20
  &endDate=2024-03-21
  &driverId=driver-123
  &page=1
  &limit=20
```

#### 4. Ações do Dashboard

```typescript
// Atualizar status
PATCH /business/establishments/:id/delivery/orders/:orderId/status
{
  status: "ready_for_delivery"
}

// Atribuir entregador
POST /business/establishments/:id/delivery/orders/:orderId/assign-driver
{
  driverId: "driver-123"
}

// Cancelar pedido
PATCH /business/establishments/:id/delivery/orders/:orderId/cancel
{
  reason: "Cliente solicitou cancelamento"
}
```

---

## 📱 App do Cliente (Fazer Pedido)

### O que o cliente precisa ver

#### 1. Criar Pedido

```typescript
interface CreateDeliveryOrderRequest {
  // Cliente
  customerId?: string;                 // Se já é cliente
  customerName: string;                // Nome do cliente
  customerPhone: string;               // Telefone
  customerEmail?: string;              // Email (opcional)
  
  // Endereço
  deliveryAddress: string;             // Rua, número
  deliveryNeighborhood: string;        // Bairro
  deliveryCity: string;                // Cidade
  deliveryState: string;               // Estado (SP, RJ, etc)
  deliveryZipCode: string;             // CEP
  deliveryComplement?: string;         // Apto, sala, etc
  deliveryReference?: string;          // Ponto de referência
  latitude?: number;                   // Coordenadas (opcional)
  longitude?: number;
  
  // Itens
  items: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
  }>;
  
  // Pagamento
  paymentMethod: PaymentMethod;        // pix, credit_card, etc
  
  // Observações
  notes?: string;                      // Observações do cliente
}
```

**Campos do Backend:**
```typescript
✅ customerId (opcional)
✅ customerName
✅ customerPhone
✅ customerEmail (opcional)
✅ deliveryAddress
✅ deliveryNeighborhood
✅ deliveryCity
✅ deliveryState
✅ deliveryZipCode
✅ deliveryComplement
✅ deliveryReference
✅ latitude
✅ longitude
✅ items (via Sale)
✅ paymentMethod
✅ notes
```

#### 2. Rastreamento em Tempo Real

```typescript
interface DeliveryTracking {
  id: string;
  orderId: string;
  status: DeliveryStatus;              // Status atual
  latitude: number;                    // Localização do entregador
  longitude: number;
  driverName: string;                  // Nome do entregador
  driverPhone: string;                 // Telefone do entregador
  driverPhoto?: string;                // Foto do entregador
  vehicleInfo?: string;                // Informações do veículo
  estimatedDeliveryTime: number;       // Tempo estimado em minutos
  estimatedDeliveryTimestamp: Date;    // Timestamp da entrega
  isDelayed: boolean;                  // Se está atrasada
  delayMinutes: number;                // Quantos minutos de atraso
  timestamp: Date;                     // Quando foi atualizado
}
```

**Campos do Backend:**
```typescript
✅ id
✅ orderId
✅ status
✅ latitude
✅ longitude
✅ driverName (via driver relation)
✅ driverPhone (via driver relation)
✅ driverPhoto (via driver relation)
✅ vehicleInfo (via driver relation)
✅ estimatedDeliveryTime
✅ estimatedDeliveryTimestamp
✅ isDelayed
✅ delayMinutes
✅ timestamp (createdAt)
```

#### 3. Status do Pedido

```typescript
enum DeliveryStatus {
  PENDING = 'pending',                 // Aguardando confirmação
  CONFIRMED = 'confirmed',             // Confirmado
  PREPARING = 'preparing',             // Preparando
  READY_FOR_DELIVERY = 'ready_for_delivery',  // Pronto para entrega
  OUT_FOR_DELIVERY = 'out_for_delivery',      // Saiu para entrega
  DELIVERED = 'delivered',             // Entregue
  CANCELLED = 'cancelled',             // Cancelado
  FAILED = 'failed',                   // Falha na entrega
}
```

**Mapeamento para UI:**
```typescript
pending → "Aguardando confirmação"
confirmed → "Confirmado"
preparing → "Preparando seu pedido"
ready_for_delivery → "Pronto para entrega"
out_for_delivery → "Saiu para entrega"
delivered → "Entregue"
cancelled → "Cancelado"
failed → "Falha na entrega"
```

#### 4. Timeline do Pedido

```typescript
interface DeliveryTimeline {
  createdAt: Date;           // Pedido criado
  confirmedAt?: Date;        // Confirmado
  preparingAt?: Date;        // Começou a preparar
  readyAt?: Date;            // Ficou pronto
  dispatchedAt?: Date;       // Saiu para entrega
  deliveredAt?: Date;        // Entregue
  cancelledAt?: Date;        // Cancelado
}
```

**Campos do Backend:**
```typescript
✅ createdAt
✅ confirmedAt
✅ preparingAt
✅ readyAt
✅ dispatchedAt
✅ deliveredAt
✅ cancelledAt
```

#### 5. Notificações em Tempo Real

```typescript
// WebSocket Events
socket.on('status:update', (data) => {
  // Status mudou
  // data: { orderId, status, timestamp }
});

socket.on('location:update', (data) => {
  // Localização do entregador mudou
  // data: { orderId, latitude, longitude, timestamp }
});

socket.on('delay:alert', (data) => {
  // Entrega está atrasada
  // data: { orderId, delayMinutes, estimatedTime }
});
```

**Eventos Disponíveis:**
```typescript
✅ ORDER_STATUS_CHANGED
✅ DELIVERY_DELAYED
✅ DELIVERY_CRITICAL
```

#### 6. Endpoints para Cliente

```typescript
// Criar pedido
POST /public/delivery/establishments/:id/orders
{
  customerName: "João Silva",
  customerPhone: "11987654321",
  deliveryAddress: "Rua ABC, 123",
  deliveryNeighborhood: "Centro",
  deliveryCity: "São Paulo",
  deliveryState: "SP",
  deliveryZipCode: "01234-567",
  items: [...],
  paymentMethod: "pix"
}

// Buscar pedido
GET /public/delivery/orders/:orderId

// Listar meus pedidos
GET /public/delivery/orders?userId=user-123

// Rastrear pedido
GET /public/delivery/orders/:orderId/tracking

// Calcular taxa de entrega
POST /public/delivery/establishments/:id/calculate-fee
{
  neighborhood: "Centro",
  latitude: -23.5505,
  longitude: -46.6333
}

// Verificar disponibilidade
POST /public/delivery/establishments/:id/check-availability
{
  neighborhood: "Centro"
}
```

---

## 🔄 Fluxo Completo de Integração

### Dashboard do Estabelecimento

```
1. Listar Pedidos
   GET /business/establishments/:id/delivery/orders
   ├─ Mostrar lista com status, cliente, valor, atraso
   └─ Filtrar por status, data, entregador

2. Ver Detalhes
   GET /business/establishments/:id/delivery/orders/:orderId
   ├─ Mostrar timeline completa
   ├─ Mostrar localização no mapa
   └─ Mostrar rastreamento

3. Atualizar Status
   PATCH /business/establishments/:id/delivery/orders/:orderId/status
   ├─ Confirmar pedido
   ├─ Marcar como preparando
   ├─ Marcar como pronto
   └─ Confirmar entrega

4. Atribuir Entregador
   POST /business/establishments/:id/delivery/orders/:orderId/assign-driver
   └─ Selecionar entregador disponível

5. Monitorar Atrasos
   ├─ Ver entregas atrasadas em tempo real
   ├─ Receber alertas de atrasos críticos
   └─ Escalar para suporte se necessário
```

### App do Cliente

```
1. Fazer Pedido
   POST /public/delivery/establishments/:id/orders
   ├─ Preencher dados de entrega
   ├─ Selecionar itens
   ├─ Escolher forma de pagamento
   └─ Confirmar pedido

2. Rastrear Pedido
   GET /public/delivery/orders/:orderId
   ├─ Ver status atual
   ├─ Ver timeline
   ├─ Ver localização do entregador
   └─ Ver tempo estimado

3. Receber Notificações
   WebSocket Events
   ├─ Pedido confirmado
   ├─ Começou a preparar
   ├─ Ficou pronto
   ├─ Saiu para entrega
   ├─ Entregador chegando
   └─ Entregue

4. Alertas de Atraso
   ├─ Notificação quando atrasa
   ├─ Atualização de tempo estimado
   └─ Opção de contato com suporte
```

---

## 📋 Checklist de Integração

### Dashboard do Estabelecimento

- [ ] Listar pedidos com filtros
- [ ] Ver detalhes do pedido
- [ ] Atualizar status
- [ ] Atribuir entregador
- [ ] Ver timeline
- [ ] Ver localização no mapa
- [ ] Monitorar atrasos
- [ ] Receber alertas
- [ ] Cancelar pedido
- [ ] Gerar relatórios

### App do Cliente

- [ ] Criar pedido
- [ ] Calcular taxa de entrega
- [ ] Verificar disponibilidade
- [ ] Rastrear pedido em tempo real
- [ ] Ver status atual
- [ ] Ver timeline
- [ ] Ver localização do entregador
- [ ] Receber notificações
- [ ] Alertas de atraso
- [ ] Contato com suporte

---

## 🚀 Próximas Melhorias

1. **Avaliação de Entregador**
   - Cliente avaliar entregador após entrega
   - Estabelecimento avaliar performance

2. **Histórico de Entregas**
   - Cliente ver histórico de pedidos
   - Estabelecimento ver estatísticas

3. **Agendamento**
   - Cliente agendar entrega para horário específico
   - Estabelecimento gerenciar agenda

4. **Múltiplos Endereços**
   - Cliente salvar endereços favoritos
   - Autocompletar endereço

5. **Integração com Mapa**
   - Mostrar rota do entregador
   - Mostrar tempo real de chegada
   - Mostrar raio de cobertura

---

## 📚 Referências

- [DeliveryOrder Entity](../src/modules/business/delivery/entities/delivery-order.entity.ts)
- [DeliveryTracking Entity](../src/modules/business/delivery/entities/delivery-tracking.entity.ts)
- [Delivery Controller](../src/modules/business/delivery/delivery.controller.ts)
- [Delivery Public Controller](../src/modules/business/delivery/delivery-public.controller.ts)
