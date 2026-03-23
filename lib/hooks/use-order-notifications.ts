'use client';

import { useEffect, useRef } from 'react';
import { useOrderToast } from '@/lib/context/order-toast-context';
import { useDeliveryOrders } from './use-delivery';
import { DeliveryStatus } from '@/lib/types/delivery';

export function useOrderNotifications(establishmentId: string) {
  const { showNewOrder } = useOrderToast();
  const { orders, refetch } = useDeliveryOrders();
  const previousOrdersRef = useRef<string[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar novos pedidos quando a lista muda
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Pegar IDs dos pedidos atuais (apenas ativos)
    const currentOrderIds = orders
      .filter(o => o.status !== DeliveryStatus.DELIVERED && o.status !== DeliveryStatus.CANCELLED)
      .map(o => o.id);

    // Encontrar novos pedidos (que não estavam antes)
    const newOrders = orders.filter(
      order => 
        !previousOrdersRef.current.includes(order.id) &&
        order.status !== DeliveryStatus.DELIVERED &&
        order.status !== DeliveryStatus.CANCELLED
    );

    // Se houver novos pedidos, mostrar notificação
    if (newOrders.length > 0) {
      newOrders.forEach(order => {
        showNewOrder(order);
      });
    }

    // Atualizar referência
    previousOrdersRef.current = currentOrderIds;
  }, [orders, showNewOrder]);

  // Polling automático a cada 5 segundos
  useEffect(() => {
    pollingIntervalRef.current = setInterval(() => {
      refetch();
    }, 5000); // 5 segundos

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [refetch]);
}

