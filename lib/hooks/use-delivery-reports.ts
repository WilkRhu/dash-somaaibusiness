import { useState, useCallback } from 'react';

export interface GeneralReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    failedOrders: number;
    pendingOrders: number;
    successRate: number;
    totalRevenue: number;
    totalDeliveryFees: number;
    totalDiscount: number;
    averageDeliveryTime: number;
    delayedOrders: number;
    averageDelay: number;
  };
  byStatus: {
    delivered: number;
    cancelled: number;
    failed: number;
    pending: number;
  };
}

export interface DriverReport {
  driverId: string;
  driverName: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  successRate: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  delayedOrders: number;
  averageDelay: number;
}

export interface DriversReport {
  period: {
    startDate: string;
    endDate: string;
  };
  drivers: DriverReport[];
}

export interface DailyReportData {
  date: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  totalRevenue: number;
  totalDeliveryFees: number;
  delayedOrders: number;
  successRate: number;
}

export interface DailyReport {
  period: {
    startDate: string;
    endDate: string;
  };
  daily: DailyReportData[];
}

export interface DelayedOrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  driverName: string;
  delayMinutes: number;
  estimatedTime: string;
  actualTime: string;
  status: string;
}

export interface DelaysReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalDelayed: number;
    averageDelay: number;
    delayRanges: {
      '0-5min': number;
      '5-15min': number;
      '15-30min': number;
      '30-60min': number;
      '60+min': number;
    };
  };
  delayedOrders: DelayedOrderData[];
}

export interface PaymentMethodData {
  method: string;
  count: number;
  total: number;
}

export interface RevenueReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalOrders: number;
    totalSubtotal: number;
    totalDeliveryFees: number;
    totalDiscount: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  byPaymentMethod: PaymentMethodData[];
}

interface UseDeliveryReportsReturn {
  generalReport: GeneralReport | null;
  driversReport: DriversReport | null;
  dailyReport: DailyReport | null;
  delaysReport: DelaysReport | null;
  revenueReport: RevenueReport | null;
  loading: boolean;
  error: string | null;
  fetchGeneralReport: (establishmentId: string, startDate: string, endDate: string) => Promise<void>;
  fetchDriversReport: (establishmentId: string, startDate: string, endDate: string) => Promise<void>;
  fetchDailyReport: (establishmentId: string, startDate: string, endDate: string) => Promise<void>;
  fetchDelaysReport: (establishmentId: string, startDate: string, endDate: string) => Promise<void>;
  fetchRevenueReport: (establishmentId: string, startDate: string, endDate: string) => Promise<void>;
}

export function useDeliveryReports(): UseDeliveryReportsReturn {
  const [generalReport, setGeneralReport] = useState<GeneralReport | null>(null);
  const [driversReport, setDriversReport] = useState<DriversReport | null>(null);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [delaysReport, setDelaysReport] = useState<DelaysReport | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeneralReport = useCallback(
    async (establishmentId: string, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/business/establishments/${establishmentId}/delivery/reports/general?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) throw new Error('Erro ao buscar relatório geral');
        const data = await response.json();
        setGeneralReport(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDriversReport = useCallback(
    async (establishmentId: string, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/business/establishments/${establishmentId}/delivery/reports/drivers?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) throw new Error('Erro ao buscar relatório de entregadores');
        const data = await response.json();
        setDriversReport(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDailyReport = useCallback(
    async (establishmentId: string, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/business/establishments/${establishmentId}/delivery/reports/daily?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) throw new Error('Erro ao buscar relatório diário');
        const data = await response.json();
        setDailyReport(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDelaysReport = useCallback(
    async (establishmentId: string, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/business/establishments/${establishmentId}/delivery/reports/delays?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) throw new Error('Erro ao buscar relatório de atrasos');
        const data = await response.json();
        setDelaysReport(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchRevenueReport = useCallback(
    async (establishmentId: string, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/business/establishments/${establishmentId}/delivery/reports/revenue?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) throw new Error('Erro ao buscar relatório de receita');
        const data = await response.json();
        setRevenueReport(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    generalReport,
    driversReport,
    dailyReport,
    delaysReport,
    revenueReport,
    loading,
    error,
    fetchGeneralReport,
    fetchDriversReport,
    fetchDailyReport,
    fetchDelaysReport,
    fetchRevenueReport,
  };
}
