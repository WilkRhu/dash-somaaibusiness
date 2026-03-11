// Hook para obter métricas fiscais

'use client';

import { useState, useCallback, useEffect } from 'react';
import { fiscalApi } from '@/lib/api/fiscal';
import { FiscalMetrics } from '@/lib/types/fiscal';

export function useFiscalMetrics() {
  const [metrics, setMetrics] = useState<FiscalMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar métricas
  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getMetrics();
      setMetrics(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao buscar métricas';
      setError(message);
      console.error('Erro ao buscar métricas:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch
  const refetch = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Auto-fetch ao montar
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    fetchMetrics,
    refetch,
  };
}
