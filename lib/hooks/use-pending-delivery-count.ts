'use client';

import { useEffect, useState } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { deliveryApi } from '@/lib/api/delivery';
import { smartInterval } from '@/lib/utils/smart-interval';

export function usePendingDeliveryCount() {
  const { currentEstablishment } = useEstablishmentStore();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentEstablishment?.id) {
      setLoading(false);
      return;
    }

    // Não carregar dados de delivery para funcionários de cozinha
    const roles = currentEstablishment?.roles || [];
    const isKitchenEmployee = roles.some((role: any) =>
      role === 'kitchen_cook' ||
      role === 'kitchen_manager' ||
      role === 'kitchen_chef' ||
      role === 'kitchen_assistant'
    );

    if (isKitchenEmployee) {
      setLoading(false);
      setCount(0);
      return;
    }

    const fetchPendingCount = async () => {
      try {
        setLoading(true);
        const response = await deliveryApi.listOrders(currentEstablishment.id, {
          status: 'pending',
          limit: 1,
        });
        setCount(response.total || 0);
      } catch (error) {
        console.error('Error fetching pending delivery count:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCount();

    // Refetch a cada 60 segundos, pausando quando aba oculta
    return smartInterval(fetchPendingCount, 60000);
  }, [currentEstablishment?.id, currentEstablishment?.roles]);

  return { count, loading };
}
