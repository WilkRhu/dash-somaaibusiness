# Reports API Contract

## Overview

Contrato da API para o módulo de Relatórios de Vendas. Este endpoint fornece análises agregadas e métricas financeiras.

## Base URL

```
/business/establishments/:establishmentId/reports
```

## Authentication

Todos os endpoints requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Sales Report (Relatório de Vendas)

Retorna análises agregadas de vendas para um período específico.

**Endpoint:** `GET /business/establishments/:establishmentId/reports/sales`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento

**Query Parameters:**
- `startDate` (string, required): Data inicial no formato ISO 8601 (YYYY-MM-DD)
- `endDate` (string, required): Data final no formato ISO 8601 (YYYY-MM-DD)
- `status` (string, optional): Filtrar por status (`completed`, `cancelled`, `pending`)
- `paymentMethod` (string, optional): Filtrar por forma de pagamento

**Example Request:**
```bash
GET /business/establishments/123e4567-e89b-12d3-a456-426614174000/reports/sales?startDate=2026-02-01&endDate=2026-02-28&status=completed
Authorization: Bearer <token>
```

**Response:** `200 OK`
```typescript
{
  period: {
    startDate: string;        // "2026-02-01"
    endDate: string;          // "2026-02-28"
  };
  summary: {
    totalSales: number;       // Soma de todas as vendas (incluindo canceladas se não filtrado)
    totalRevenue: number;     // Receita total (apenas completed)
    totalProfit: number;      // Lucro estimado (revenue - cost)
    averageTicket: number;    // Ticket médio (revenue / salesCount)
    salesCount: number;       // Quantidade de vendas
    cancelledCount: number;   // Quantidade de vendas canceladas
  };
  byPaymentMethod: Array<{
    method: string;           // 'cash', 'pix', 'credit_card', etc.
    count: number;            // Quantidade de vendas
    total: number;            // Valor total
    percentage: number;       // Percentual do total (0-100)
  }>;
  byDay: Array<{
    date: string;             // "2026-02-01"
    count: number;            // Quantidade de vendas no dia
    total: number;            // Valor total do dia
    averageTicket: number;    // Ticket médio do dia
  }>;
  topProducts: Array<{
    productId: string;        // UUID do produto
    productName: string;      // Nome do produto
    quantity: number;         // Quantidade total vendida
    revenue: number;          // Receita gerada
    salesCount: number;       // Número de vendas que incluíram o produto
  }>;
  topSellers?: Array<{       // Opcional: se houver múltiplos vendedores
    sellerId: string;
    sellerName: string;
    salesCount: number;
    totalRevenue: number;
  }>;
}
```

**Example Response:**
```json
{
  "period": {
    "startDate": "2026-02-01",
    "endDate": "2026-02-28"
  },
  "summary": {
    "totalSales": 15000.00,
    "totalRevenue": 14500.00,
    "totalProfit": 5800.00,
    "averageTicket": 72.50,
    "salesCount": 200,
    "cancelledCount": 5
  },
  "byPaymentMethod": [
    {
      "method": "pix",
      "count": 85,
      "total": 6162.50,
      "percentage": 42.5
    },
    {
      "method": "cash",
      "count": 70,
      "total": 5075.00,
      "percentage": 35.0
    },
    {
      "method": "credit_card",
      "count": 30,
      "total": 2175.00,
      "percentage": 15.0
    },
    {
      "method": "debit_card",
      "count": 15,
      "total": 1087.50,
      "percentage": 7.5
    }
  ],
  "byDay": [
    {
      "date": "2026-02-01",
      "count": 8,
      "total": 580.00,
      "averageTicket": 72.50
    },
    {
      "date": "2026-02-02",
      "count": 12,
      "total": 870.00,
      "averageTicket": 72.50
    }
  ],
  "topProducts": [
    {
      "productId": "prod-uuid-1",
      "productName": "Coca-Cola 2L",
      "quantity": 150,
      "revenue": 1125.00,
      "salesCount": 75
    },
    {
      "productId": "prod-uuid-2",
      "productName": "Pão Francês",
      "quantity": 500,
      "revenue": 1000.00,
      "salesCount": 100
    }
  ]
}
```

**Error Responses:**

`400 Bad Request` - Parâmetros inválidos:
```json
{
  "statusCode": 400,
  "message": "startDate and endDate are required",
  "error": "Bad Request"
}
```

`400 Bad Request` - Período muito longo:
```json
{
  "statusCode": 400,
  "message": "Date range cannot exceed 365 days",
  "error": "Bad Request"
}
```

`403 Forbidden` - Sem permissão:
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions to view reports",
  "error": "Forbidden"
}
```

---

### 2. Get Dashboard Stats (Estatísticas do Dashboard)

Retorna métricas rápidas para o dashboard principal.

**Endpoint:** `GET /business/establishments/:establishmentId/reports/dashboard`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento**Response:** `200 OK`
```typescript
{
  today: {
    revenue: number;          // Receita de hoje
    salesCount: number;       // Vendas de hoje
    averageTicket: number;    // Ticket médio de hoje
    comparisonYesterday: {
      revenue: number;        // Diferença % vs ontem
      salesCount: number;     // Diferença % vs ontem
    };
  };
  thisMonth: {
    revenue: number;
    salesCount: number;
    averageTicket: number;
    comparisonLastMonth: {
      revenue: number;        // Diferença % vs mês passado
      salesCount: number;
    };
  };
  alerts: {
    lowStockCount: number;    // Produtos com estoque baixo
    expiringCount: number;    // Produtos vencendo
    pendingSalesCount: number; // Vendas pendentes
  };
  recentSales: Array<{
    id: string;
    saleNumber: string;
    total: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    customer?: {
      name: string;
    };
  }>;
  topProductsToday: Array<{
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}
```

**Example Response:**
```json
{
  "today": {
    "revenue": 3450.00,
    "salesCount": 45,
    "averageTicket": 76.67,
    "comparisonYesterday": {
      "revenue": 12.5,
      "salesCount": 8.3
    }
  },
  "thisMonth": {
    "revenue": 45600.00,
    "salesCount": 620,
    "averageTicket": 73.55,
    "comparisonLastMonth": {
      "revenue": 15.2,
      "salesCount": 10.5
    }
  },
  "alerts": {
    "lowStockCount": 5,
    "expiringCount": 3,
    "pendingSalesCount": 2
  },
  "recentSales": [
    {
      "id": "sale-uuid-1",
      "saleNumber": "20260228-0045",
      "total": 150.00,
      "paymentMethod": "pix",
      "status": "completed",
      "createdAt": "2026-02-28T14:30:00.000Z",
      "customer": {
        "name": "João Silva"
      }
    }
  ],
  "topProductsToday": [
    {
      "productName": "Coca-Cola 2L",
      "quantity": 15,
      "revenue": 112.50
    }
  ]
}
```

---

### 3. Export Report (Exportar Relatório)

Exporta relatório em formato CSV ou PDF.

**Endpoint:** `GET /business/establishments/:establishmentId/reports/sales/export`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento

**Query Parameters:**
- `startDate` (string, required): Data inicial
- `endDate` (string, required): Data final
- `format` (string, optional): Formato de exportação (`csv` ou `pdf`, default: `csv`)
- `status` (string, optional): Filtrar por status

**Response:** `200 OK`

**Headers:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="relatorio-vendas-2026-02-01-2026-02-28.csv"
```

**CSV Format:**
```csv
Relatório de Vendas - SomaAI Business
Estabelecimento,Nome do Estabelecimento
CNPJ,12.345.678/0001-90
Período,01/02/2026 a 28/02/2026

RESUMO FINANCEIRO
Receita Total,R$ 14.500,00
Lucro Estimado,R$ 5.800,00
Ticket Médio,R$ 72,50
Total de Vendas,200
Vendas Canceladas,5

VENDAS POR FORMA DE PAGAMENTO
Forma de Pagamento,Quantidade,Valor Total,Percentual
PIX,85,"R$ 6.162,50",42.5%
Dinheiro,70,"R$ 5.075,00",35.0%
Cartão de Crédito,30,"R$ 2.175,00",15.0%
Cartão de Débito,15,"R$ 1.087,50",7.5%

PRODUTOS MAIS VENDIDOS
Produto,Quantidade,Receita
Coca-Cola 2L,150,"R$ 1.125,00"
Pão Francês,500,"R$ 1.000,00"

VENDAS DIÁRIAS
Data,Quantidade,Valor Total,Ticket Médio
01/02/2026,8,"R$ 580,00","R$ 72,50"
02/02/2026,12,"R$ 870,00","R$ 72,50"
```

---

### 4. Get Sales Details (Detalhes das Vendas)

Retorna lista detalhada de vendas individuais com paginação.

**Endpoint:** `GET /business/establishments/:establishmentId/reports/sales/details`

**Path Parameters:**
- `establishmentId` (string, required): UUID do estabelecimento

**Query Parameters:**
- `startDate` (string, required): Data inicial (YYYY-MM-DD)
- `endDate` (string, required): Data final (YYYY-MM-DD)
- `status` (string, optional): Filtrar por status (`completed`, `cancelled`, `pending`)
- `paymentMethod` (string, optional): Filtrar por forma de pagamento
- `page` (number, optional): Número da página (default: 1)
- `limit` (number, optional): Itens por página (default: 20)

**Example Request:**
```bash
GET /business/establishments/123e4567-e89b-12d3-a456-426614174000/reports/sales/details?startDate=2026-02-01&endDate=2026-02-28&page=1&limit=20
Authorization: Bearer <token>
```

**Response:** `200 OK`
```typescript
{
  data: Array<Sale>;  // Array de vendas completas
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalRevenue: number;
    totalDiscount: number;
    salesCount: number;
  };
}
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "sale-uuid-1",
      "saleNumber": "20260228-0001",
      "items": [
        {
          "id": "item-uuid-1",
          "productName": "Coca-Cola 2L",
          "unitPrice": 7.50,
          "quantity": 2,
          "discount": 0,
          "subtotal": 15.00
        }
      ],
      "subtotal": 15.00,
      "discount": 0,
      "total": 15.00,
      "paymentMethod": "pix",
      "status": "completed",
      "seller": {
        "id": "user-uuid-1",
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "createdAt": "2026-02-28T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  },
  "summary": {
    "totalRevenue": 3450.00,
    "totalDiscount": 125.50,
    "salesCount": 45
  }
}
```

---

## Implementation Notes

### Backend Implementation (NestJS)

#### 1. Create DTO

```typescript
// dto/sales-report-filters.dto.ts
import { IsDateString, IsOptional, IsEnum } from 'class-validator';

export class SalesReportFiltersDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(['completed', 'cancelled', 'pending'])
  status?: string;

  @IsOptional()
  @IsEnum(['cash', 'pix', 'credit_card', 'debit_card', 'bank_transfer'])
  paymentMethod?: string;
}
```

#### 2. Create Service Method

```typescript
// reports.service.ts
async getSalesReport(
  establishmentId: string,
  filters: SalesReportFiltersDto
): Promise<SalesReport> {
  // 1. Buscar vendas do período
  const sales = await this.salesRepository.find({
    where: {
      establishmentId,
      createdAt: Between(
        new Date(filters.startDate),
        new Date(filters.endDate)
      ),
      ...(filters.status && { status: filters.status }),
      ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
    },
    relations: ['items', 'items.item'],
  });

  // 2. Calcular métricas
  const summary = this.calculateSummary(sales);
  const byPaymentMethod = this.groupByPaymentMethod(sales);
  const byDay = this.groupByDay(sales);
  const topProducts = this.getTopProducts(sales);

  return {
    period: {
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
    summary,
    byPaymentMethod,
    byDay,
    topProducts,
  };
}

private calculateSummary(sales: Sale[]) {
  const completed = sales.filter(s => s.status === 'completed');
  const cancelled = sales.filter(s => s.status === 'cancelled');

  const totalRevenue = completed.reduce((sum, s) => sum + s.total, 0);
  
  // Calcular lucro baseado no costPrice dos produtos
  const totalProfit = completed.reduce((sum, sale) => {
    const cost = sale.items.reduce((itemSum, item) => {
      return itemSum + (item.quantity * item.item.costPrice);
    }, 0);
    return sum + (sale.total - cost);
  }, 0);

  return {
    totalSales: completed.reduce((sum, s) => sum + s.total, 0),
    totalRevenue,
    totalProfit,
    averageTicket: completed.length > 0 ? totalRevenue / completed.length : 0,
    salesCount: completed.length,
    cancelledCount: cancelled.length,
  };
}

private groupByPaymentMethod(sales: Sale[]) {
  const completed = sales.filter(s => s.status === 'completed');
  const totalRevenue = completed.reduce((sum, s) => sum + s.total, 0);

  const grouped = completed.reduce((acc, sale) => {
    if (!acc[sale.paymentMethod]) {
      acc[sale.paymentMethod] = { count: 0, total: 0 };
    }
    acc[sale.paymentMethod].count++;
    acc[sale.paymentMethod].total += sale.total;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  return Object.entries(grouped).map(([method, data]) => ({
    method,
    count: data.count,
    total: data.total,
    percentage: (data.total / totalRevenue) * 100,
  }));
}

private groupByDay(sales: Sale[]) {
  const completed = sales.filter(s => s.status === 'completed');

  const grouped = completed.reduce((acc, sale) => {
    const date = sale.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { count: 0, total: 0 };
    }
    acc[date].count++;
    acc[date].total += sale.total;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      count: data.count,
      total: data.total,
      averageTicket: data.total / data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

private getTopProducts(sales: Sale[]) {
  const completed = sales.filter(s => s.status === 'completed');

  const productStats = completed.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.productName]) {
        acc[item.productName] = {
          productId: item.itemId,
          quantity: 0,
          revenue: 0,
          salesCount: 0,
        };
      }
      acc[item.productName].quantity += item.quantity;
      acc[item.productName].revenue += item.subtotal;
      acc[item.productName].salesCount++;
    });
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(productStats)
    .map(([productName, data]) => ({ productName, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}
```

#### 3. Create Controller

```typescript
// reports.controller.ts
@Get('establishments/:establishmentId/reports/sales')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
async getSalesReport(
  @Param('establishmentId') establishmentId: string,
  @Query() filters: SalesReportFiltersDto,
) {
  return this.reportsService.getSalesReport(establishmentId, filters);
}

@Get('establishments/:establishmentId/reports/dashboard')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
async getDashboardStats(
  @Param('establishmentId') establishmentId: string,
) {
  return this.reportsService.getDashboardStats(establishmentId);
}

@Get('establishments/:establishmentId/reports/sales/export')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
async exportReport(
  @Param('establishmentId') establishmentId: string,
  @Query() filters: SalesReportFiltersDto,
  @Query('format') format: string = 'csv',
  @Res() res: Response,
) {
  const report = await this.reportsService.getSalesReport(establishmentId, filters);
  
  if (format === 'csv') {
    const csv = this.reportsService.generateCSV(report);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-vendas-${filters.startDate}-${filters.endDate}.csv"`
    );
    res.send(csv);
  }
}
```

---

## Permissions

### View Reports
- `business_owner`: ✅ Full access
- `business_admin`: ✅ Full access
- `business_sales`: ✅ Only their own sales
- `business_stock`: ❌ No access
- `business_marketing`: ✅ Read-only access

### Export Reports
- `business_owner`: ✅
- `business_admin`: ✅
- Others: ❌

---

## Performance Considerations

1. **Indexing**: Criar índices em:
   - `sales.establishmentId`
   - `sales.createdAt`
   - `sales.status`
   - `sales.paymentMethod`

2. **Caching**: Para períodos fechados (mês anterior), considere cache
   ```typescript
   @CacheTTL(3600) // 1 hora
   async getSalesReport() { ... }
   ```

3. **Pagination**: Para grandes volumes, considere paginação nos detalhes

4. **Aggregation**: Use queries agregadas do banco quando possível
   ```sql
   SELECT 
     DATE(created_at) as date,
     COUNT(*) as count,
     SUM(total) as total
   FROM sales
   WHERE establishment_id = ? 
     AND created_at BETWEEN ? AND ?
   GROUP BY DATE(created_at)
   ```

---

## Testing

### Unit Test Example

```typescript
describe('ReportsService', () => {
  it('should calculate summary correctly', async () => {
    const filters = {
      startDate: '2026-02-01',
      endDate: '2026-02-28',
      status: 'completed',
    };

    const report = await service.getSalesReport(establishmentId, filters);

    expect(report.summary.totalRevenue).toBeGreaterThan(0);
    expect(report.summary.averageTicket).toBe(
      report.summary.totalRevenue / report.summary.salesCount
    );
  });
});
```

---

## Notes

- Todas as datas devem estar em UTC
- Valores monetários em centavos ou com 2 casas decimais
- Lucro é estimado baseado em `costPrice` - para lucro real, considere custos operacionais
- Relatórios são gerados em tempo real - considere cache para otimização
