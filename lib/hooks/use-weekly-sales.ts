import { useState, useEffect } from 'react';
import { reportsApi } from '@/lib/api/reports';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { SalesReport } from '@/lib/types/reports';

export function useWeeklySales() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentEstablishment } = useEstablishmentStore();

  useEffect(() => {
    if (!currentEstablishment) return;

    const fetchWeeklySales = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Calcular últimos 7 dias
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 6); // 7 dias incluindo hoje

        const startDate = weekAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];

        const data = await reportsApi.getSalesReport(currentEstablishment.id, {
          startDate,
          endDate,
          status: 'completed',
        });

        setReport(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar vendas da semana');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklySales();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchWeeklySales, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentEstablishment]);

  return { report, isLoading, error };
}
