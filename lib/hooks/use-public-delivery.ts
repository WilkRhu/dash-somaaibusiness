import { useState, useCallback } from 'react';
import { publicDeliveryService } from '../api/delivery';
import { DeliveryOrder, DeliveryZone } from '../types/delivery';

export function usePublicDeliveryOrder(establishmentId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (data: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      deliveryAddress: string;
      deliveryNeighborhood: string;
      deliveryCity: string;
      deliveryState: string;
      deliveryZipCode: string;
      deliveryComplement?: string;
      deliveryReference?: string;
      latitude?: number;
      longitude?: number;
      items: Array<{
        productName: string;
        unitPrice: number;
        quantity: number;
      }>;
      paymentMethod: string;
      notes?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const order = await publicDeliveryService.createPublicOrder(establishmentId, data);
        return order;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao criar pedido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [establishmentId]
  );

  return { createOrder, loading, error };
}

export function usePublicOrderTracking(orderId: string) {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicDeliveryService.getPublicOrderTracking(orderId);
      setOrder(data.order);
      setTracking(data.tracking);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar rastreamento');
      console.error('Erro ao carregar rastreamento:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  return { order, tracking, loading, error, refetch: fetchTracking };
}

export function useDeliveryFeeCalculation(establishmentId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateFee = useCallback(
    async (data: {
      neighborhood: string;
      zipCode?: string;
      latitude?: number;
      longitude?: number;
      subtotal: number;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const result = await publicDeliveryService.calculatePublicFee(establishmentId, data);
        return result;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao calcular taxa';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [establishmentId]
  );

  return { calculateFee, loading, error };
}

export function useDeliveryAvailability(establishmentId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(
    async (data: {
      neighborhood: string;
      zipCode?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const result = await publicDeliveryService.checkAvailability(establishmentId, data);
        return result;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao verificar disponibilidade';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [establishmentId]
  );

  return { checkAvailability, loading, error };
}
