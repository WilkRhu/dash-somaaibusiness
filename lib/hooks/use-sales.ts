import { useEffect } from 'react';
import { useSalesStore } from '@/lib/stores/sales-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { salesApi } from '@/lib/api/sales';

export function useSales() {
  const { sales, isLoading, error, setSales, setLoading, setError, updateStats } = useSalesStore();
  const { currentEstablishment } = useEstablishmentStore();

  const fetchSales = async () => {
    if (!currentEstablishment) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.list(currentEstablishment.id);
      setSales(data);
      
      // Calculate today's stats
      const today = new Date().toISOString().split('T')[0];
      const todaySales = data.filter(sale => 
        sale.createdAt.startsWith(today) && sale.status === 'completed'
      );
      const total = todaySales.reduce((sum, sale) => sum + sale.total, 0);
      updateStats(total, todaySales.length);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentEstablishment?.id]);

  return {
    sales,
    isLoading,
    error,
    refetch: fetchSales,
  };
}
