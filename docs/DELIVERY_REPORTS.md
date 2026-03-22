# Relatórios de Delivery

## 📊 Visão Geral

Sistema completo de relatórios para análise de entregas do estabelecimento.

---

## 🔗 Endpoints Disponíveis

### 1. Relatório Geral

```
GET /business/establishments/:establishmentId/delivery/reports/general
  ?startDate=2024-03-01
  &endDate=2024-03-31
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-03-01",
      "endDate": "2024-03-31"
    },
    "summary": {
      "totalOrders": 150,
      "completedOrders": 145,
      "cancelledOrders": 3,
      "failedOrders": 2,
      "pendingOrders": 0,
      "successRate": 96.67,
      "totalRevenue": 7500.00,
      "totalDeliveryFees": 1200.00,
      "totalDiscount": 150.00,
      "averageDeliveryTime": 28,
      "delayedOrders": 12,
      "averageDelay": 8
    },
    "byStatus": {
      "delivered": 145,
      "cancelled": 3,
      "failed": 2,
      "pending": 0
    }
  }
}
```

**Campos:**
- `totalOrders` - Total de pedidos no período
- `completedOrders` - Pedidos entregues
- `cancelledOrders` - Pedidos cancelados
- `failedOrders` - Pedidos com falha
- `pendingOrders` - Pedidos pendentes
- `successRate` - Taxa de sucesso (%)
- `totalRevenue` - Receita total
- `totalDeliveryFees` - Total de taxas de entrega
- `totalDiscount` - Total de descontos
- `averageDeliveryTime` - Tempo médio de entrega (minutos)
- `delayedOrders` - Quantidade de entregas atrasadas
- `averageDelay` - Atraso médio (minutos)

---

### 2. Relatório por Entregador

```
GET /business/establishments/:establishmentId/delivery/reports/drivers
  ?startDate=2024-03-01
  &endDate=2024-03-31
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-03-01",
      "endDate": "2024-03-31"
    },
    "drivers": [
      {
        "driverId": "driver-1",
        "driverName": "Carlos Silva",
        "totalOrders": 50,
        "completedOrders": 48,
        "cancelledOrders": 1,
        "failedOrders": 1,
        "successRate": 96.0,
        "totalRevenue": 2500.00,
        "averageDeliveryTime": 25,
        "delayedOrders": 3,
        "averageDelay": 5
      },
      {
        "driverId": "driver-2",
        "driverName": "Ana Santos",
        "totalOrders": 45,
        "completedOrders": 44,
        "cancelledOrders": 1,
        "failedOrders": 0,
        "successRate": 97.78,
        "totalRevenue": 2250.00,
        "averageDeliveryTime": 26,
        "delayedOrders": 2,
        "averageDelay": 6
      }
    ]
  }
}
```

**Campos por Entregador:**
- `driverId` - ID do entregador
- `driverName` - Nome do entregador
- `totalOrders` - Total de pedidos
- `completedOrders` - Pedidos entregues
- `cancelledOrders` - Pedidos cancelados
- `failedOrders` - Pedidos com falha
- `successRate` - Taxa de sucesso (%)
- `totalRevenue` - Receita gerada
- `averageDeliveryTime` - Tempo médio de entrega
- `delayedOrders` - Entregas atrasadas
- `averageDelay` - Atraso médio

---

### 3. Relatório Diário

```
GET /business/establishments/:establishmentId/delivery/reports/daily
  ?startDate=2024-03-01
  &endDate=2024-03-31
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-03-01",
      "endDate": "2024-03-31"
    },
    "daily": [
      {
        "date": "2024-03-01",
        "totalOrders": 5,
        "completedOrders": 5,
        "cancelledOrders": 0,
        "failedOrders": 0,
        "totalRevenue": 250.00,
        "totalDeliveryFees": 40.00,
        "delayedOrders": 0,
        "successRate": 100.0
      },
      {
        "date": "2024-03-02",
        "totalOrders": 8,
        "completedOrders": 7,
        "cancelledOrders": 1,
        "failedOrders": 0,
        "totalRevenue": 400.00,
        "totalDeliveryFees": 64.00,
        "delayedOrders": 1,
        "successRate": 87.5
      }
    ]
  }
}
```

**Campos por Dia:**
- `date` - Data (YYYY-MM-DD)
- `totalOrders` - Total de pedidos
- `completedOrders` - Pedidos entregues
- `cancelledOrders` - Pedidos cancelados
- `failedOrders` - Pedidos com falha
- `totalRevenue` - Receita do dia
- `totalDeliveryFees` - Taxas de entrega
- `delayedOrders` - Entregas atrasadas
- `successRate` - Taxa de sucesso (%)

---

### 4. Relatório de Atrasos

```
GET /business/establishments/:establishmentId/delivery/reports/delays
  ?startDate=2024-03-01
  &endDate=2024-03-31
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-03-01",
      "endDate": "2024-03-31"
    },
    "summary": {
      "totalDelayed": 12,
      "averageDelay": 8,
      "delayRanges": {
        "0-5min": 5,
        "5-15min": 4,
        "15-30min": 2,
        "30-60min": 1,
        "60+min": 0
      }
    },
    "delayedOrders": [
      {
        "id": "order-1",
        "orderNumber": "PED-001",
        "customerName": "João Silva",
        "driverName": "Carlos",
        "delayMinutes": 5,
        "estimatedTime": "2024-03-01T14:30:00Z",
        "actualTime": "2024-03-01T14:35:00Z",
        "status": "delivered"
      }
    ]
  }
}
```

**Campos:**
- `totalDelayed` - Total de entregas atrasadas
- `averageDelay` - Atraso médio (minutos)
- `delayRanges` - Distribuição por faixa de atraso
- `delayedOrders` - Lista de entregas atrasadas

---

### 5. Relatório de Receita

```
GET /business/establishments/:establishmentId/delivery/reports/revenue
  ?startDate=2024-03-01
  &endDate=2024-03-31
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-03-01",
      "endDate": "2024-03-31"
    },
    "summary": {
      "totalOrders": 150,
      "totalSubtotal": 6000.00,
      "totalDeliveryFees": 1200.00,
      "totalDiscount": 150.00,
      "totalRevenue": 7050.00,
      "averageOrderValue": 47.00
    },
    "byPaymentMethod": [
      {
        "method": "pix",
        "count": 80,
        "total": 3800.00
      },
      {
        "method": "credit_card",
        "count": 50,
        "total": 2350.00
      },
      {
        "method": "debit_card",
        "count": 20,
        "total": 900.00
      }
    ]
  }
}
```

**Campos:**
- `totalOrders` - Total de pedidos
- `totalSubtotal` - Subtotal dos itens
- `totalDeliveryFees` - Total de taxas
- `totalDiscount` - Total de descontos
- `totalRevenue` - Receita total
- `averageOrderValue` - Valor médio por pedido
- `byPaymentMethod` - Receita por forma de pagamento

---

## 📈 Casos de Uso

### 1. Análise de Performance Diária

```bash
# Obter relatório do dia
curl -X GET "http://localhost:3000/business/establishments/est-123/delivery/reports/daily?startDate=2024-03-20&endDate=2024-03-20"
```

**Usar para:**
- Verificar quantos pedidos foram entregues
- Identificar picos de demanda
- Monitorar taxa de sucesso

### 2. Avaliação de Entregadores

```bash
# Obter relatório de entregadores
curl -X GET "http://localhost:3000/business/establishments/est-123/delivery/reports/drivers?startDate=2024-03-01&endDate=2024-03-31"
```

**Usar para:**
- Comparar performance entre entregadores
- Identificar entregadores com mais atrasos
- Calcular bônus/incentivos

### 3. Análise de Atrasos

```bash
# Obter relatório de atrasos
curl -X GET "http://localhost:3000/business/establishments/est-123/delivery/reports/delays?startDate=2024-03-01&endDate=2024-03-31"
```

**Usar para:**
- Identificar padrões de atraso
- Melhorar tempo de entrega
- Planejar recursos

### 4. Análise Financeira

```bash
# Obter relatório de receita
curl -X GET "http://localhost:3000/business/establishments/est-123/delivery/reports/revenue?startDate=2024-03-01&endDate=2024-03-31"
```

**Usar para:**
- Calcular receita de delivery
- Analisar formas de pagamento
- Projetar faturamento

---

## 🎨 Visualizações Recomendadas

### Dashboard com Widgets

```
┌─────────────────────────────────────────────────────────┐
│ Relatório de Delivery - Março 2024                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ Total        │ │ Entregues    │ │ Taxa Sucesso │     │
│ │ 150 pedidos  │ │ 145 (96.7%)  │ │ 96.7%        │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ Receita      │ │ Taxa Média   │ │ Atrasos      │     │
│ │ R$ 7.050,00  │ │ R$ 8,00      │ │ 12 pedidos   │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                           │
│ Gráfico: Entregas por Dia                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ▁ ▂ ▃ ▄ ▅ ▆ ▇ █ ▇ ▆ ▅ ▄ ▃ ▂ ▁                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Tabela: Top Entregadores                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Nome    │ Pedidos │ Taxa Sucesso │ Atraso Médio   │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Carlos  │ 50      │ 96%          │ 5 min          │ │
│ │ Ana     │ 45      │ 97.8%        │ 6 min          │ │
│ │ Pedro   │ 40      │ 95%          │ 10 min         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Permissões

**Quem pode acessar:**
- ✅ Proprietário do estabelecimento
- ✅ Gerente do estabelecimento

**Quem NÃO pode acessar:**
- ❌ Cliente
- ❌ Entregador
- ❌ Usuário sem permissão

---

## 📋 Filtros Disponíveis

Todos os endpoints aceitam:
- `startDate` (obrigatório) - Data inicial (YYYY-MM-DD)
- `endDate` (obrigatório) - Data final (YYYY-MM-DD)

---

## 🚀 Próximas Melhorias

1. **Exportar Relatórios**
   - Exportar para PDF
   - Exportar para Excel
   - Enviar por email

2. **Relatórios Customizados**
   - Filtrar por entregador
   - Filtrar por zona
   - Filtrar por forma de pagamento

3. **Comparação de Períodos**
   - Comparar mês com mês
   - Comparar ano com ano
   - Tendências

4. **Alertas Automáticos**
   - Alerta se taxa de sucesso cair
   - Alerta se atrasos aumentarem
   - Alerta se receita cair

5. **Integração com BI**
   - Google Data Studio
   - Tableau
   - Power BI

---

## 📚 Referências

- [DeliveryReportService](../src/modules/business/delivery/services/delivery-report.service.ts)
- [Delivery Controller](../src/modules/business/delivery/delivery.controller.ts)
- [Delivery Entity](../src/modules/business/delivery/entities/delivery-order.entity.ts)
