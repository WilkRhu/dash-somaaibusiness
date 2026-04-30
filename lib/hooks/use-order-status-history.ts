'use client';

import { useState, useCallback } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';
import { OrderStatusChange } from '@/lib/types/kitchen-order';

export function useOrderStatusHistory(orderId?: string) {
  const { currentEstablishment } = useEstablishmentStore();
  const [history, setHistory] = useState<OrderStatusChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (id?: string) => {
    const targetOrderId = id || orderId;
    if (!currentEstablishment?.id || !targetOrderId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await kitchenOrdersApi.getStatusHistory(
        currentEstablishment.id,
        targetOrderId
      );
      setHistory(data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao carregar histórico';
      setError(message);
      console.error('Erro ao carregar histórico de status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentEstablishment?.id, orderId]);

  return {
    history,
    isLoading,
    error,
    fetchHistory,
  };
}
