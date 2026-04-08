import { useState, useEffect, useCallback, useMemo } from 'react';
import { deliveryService } from '../api/delivery';
import { DeliveryOrder, DeliveryZone } from '../types/delivery';
import { useEstablishmentStore } from '../stores/establishment-store';

type DeliveryOrderFilters = {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

// Hook para gerenciar pedidos de delivery
export function useDeliveryOrders(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });
  const { currentEstablishment } = useEstablishmentStore();
  const filtersKey = JSON.stringify(filters ?? {});
  const requestFilters = useMemo<DeliveryOrderFilters | undefined>(() => {
    if (filtersKey === '{}') {
      return undefined;
    }

    return JSON.parse(filtersKey) as DeliveryOrderFilters;
  }, [filtersKey]);

  const fetchOrders = useCallback(async () => {
    if (!currentEstablishment?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await deliveryService.listOrders(currentEstablishment.id, requestFilters);
      setOrders(result.data);
      setPagination({
        total: result.total || 0,
        page: result.page || 1,
        limit: result.limit || requestFilters?.limit || 50,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar pedidos'));
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, requestFilters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, pagination, refetch: fetchOrders };
}

export function useDeliveryZones() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentEstablishment } = useEstablishmentStore();

  const fetchZones = useCallback(async () => {
    if (!currentEstablishment?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryService.listZones(currentEstablishment.id);
      setZones(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar zonas'));
      console.error('Erro ao carregar zonas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return { zones, loading, error, refetch: fetchZones };
}
