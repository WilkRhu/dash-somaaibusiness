export interface SalesReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalSales: number;
    totalRevenue: number;
    totalProfit: number;
    averageTicket: number;
    salesCount: number;
    cancelledCount: number;
  };
  byPaymentMethod: Array<{
    method: string;
    count: number;
    total: number;
    percentage: number;
  }>;
  byDay: Array<{
    date: string;
    count: number;
    total: number;
    averageTicket: number;
  }>;
  topProducts: Array<{
    productId?: string;
    productName: string;
    quantity: number;
    revenue: number;
    salesCount?: number;
  }>;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  status?: 'completed' | 'cancelled' | 'pending';
}
