import apiClient from './client';
import { SalesReport, ReportFilters } from '@/lib/types/reports';
import { Sale } from '@/lib/types/sale';

export interface DashboardStats {
  today: {
    revenue: number;
    salesCount: number;
    averageTicket: number;
    comparisonYesterday: {
      revenue: number;
      salesCount: number;
    };
  };
  thisMonth: {
    revenue: number;
    salesCount: number;
    averageTicket: number;
    comparisonLastMonth: {
      revenue: number;
      salesCount: number;
    };
  };
  alerts: {
    lowStockCount: number;
    expiringCount: number;
    pendingSalesCount: number;
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

export interface SalesDetailsResponse {
  data: Sale[];
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

export const reportsApi = {
  getSalesReport: async (
    establishmentId: string,
    filters: ReportFilters
  ): Promise<SalesReport> => {
    const { data } = await apiClient.get<SalesReport>(
      `/business/establishments/${establishmentId}/reports/sales`,
      { params: filters }
    );
    return data;
  },

  getDashboardStats: async (establishmentId: string): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>(
      `/business/establishments/${establishmentId}/reports/dashboard`
    );
    return data;
  },

  getSalesDetails: async (
    establishmentId: string,
    filters: ReportFilters & { page?: number; limit?: number }
  ): Promise<SalesDetailsResponse> => {
    const { data } = await apiClient.get<SalesDetailsResponse>(
      `/business/establishments/${establishmentId}/reports/sales/details`,
      { params: filters }
    );
    return data;
  },

  exportSalesReport: async (
    establishmentId: string,
    filters: ReportFilters,
    format: 'csv' | 'pdf' = 'csv'
  ): Promise<Blob> => {
    const { data } = await apiClient.get(
      `/business/establishments/${establishmentId}/reports/sales/export`,
      {
        params: { ...filters, format },
        responseType: 'blob',
      }
    );
    return data;
  },
};
