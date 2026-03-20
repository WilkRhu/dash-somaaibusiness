import { useState, useEffect, useCallback } from 'react';
import { deliveryService } from '../api/delivery';
import { DeliveryOrder, DeliveryZone } from '../types/delivery';
import { useEstablishmentStore } from '../stores/establishment-store';

// Hook para gerenciar pedidos de delivery
export function useDeliveryOrders(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentEstablishment } = useEstablishmentStore();

  const fetchOrders = useCallback(async () => {
    if (!currentEstablishment?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await deliveryService.listOrders(currentEstablishment.id, filters);
      // Suporta resposta com wrapper { data: [] } ou array direto
      setOrders(Array.isArray(result) ? result : (result.data ?? []));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
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
      // Suporta resposta com wrapper { data: [] } ou array direto
      setZones(Array.isArray(data) ? data : (data ?? []));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar zonas');
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
