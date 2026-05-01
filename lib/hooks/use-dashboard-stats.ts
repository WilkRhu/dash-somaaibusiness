import { useState, useEffect } from 'react';
import { reportsApi, DashboardStats } from '@/lib/api/reports';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { smartInterval } from '@/lib/utils/smart-interval';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentEstablishment } = useEstablishmentStore();

  useEffect(() => {
    if (!currentEstablishment) return;

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await reportsApi.getDashboardStats(currentEstablishment.id);
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar estatísticas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Atualizar a cada 60 segundos, pausando quando aba oculta
    return smartInterval(fetchStats, 60000);
  }, [currentEstablishment]);

  return { stats, isLoading, error };
}
