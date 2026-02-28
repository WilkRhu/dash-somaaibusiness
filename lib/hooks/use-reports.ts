import { useState, useEffect } from 'react';
import { reportsApi } from '@/lib/api/reports';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { SalesReport, ReportFilters } from '@/lib/types/reports';

export function useReports(filters: ReportFilters) {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentEstablishment } = useEstablishmentStore();

  useEffect(() => {
    if (!currentEstablishment) return;

    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await reportsApi.getSalesReport(
          currentEstablishment.id,
          filters
        );
        setReport(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao gerar relatório');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [currentEstablishment, filters.startDate, filters.endDate, filters.status]);

  return { report, isLoading, error };
}
