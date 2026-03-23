'use client';

import { useEffect } from 'react';
import { useNewOrders } from '@/lib/hooks/use-delivery-websocket';
import { usePersistentOrderToast } from '@/lib/hooks/use-persistent-order-toast';
import { PersistentOrderToast } from './persistent-order-toast';
import { useRouter } from 'next/navigation';

interface DeliveryOrderNotificationsContainerProps {
  establishmentId: string;
}

export function DeliveryOrderNotificationsContainer({
  establishmentId,
}: DeliveryOrderNotificationsContainerProps) {
  const router = useRouter();
  const { order, isViewed, showNewOrder, markAsViewed, dismiss } =
    usePersistentOrderToast();

  // Escutar novos pedidos via WebSocket
  const handleNewOrder = (newOrder: any) => {
    console.log('DeliveryOrderNotificationsContainer - handleNewOrder called with:', newOrder);
    showNewOrder(newOrder);
  };

  useNewOrders(establishmentId, handleNewOrder);

  const handleViewOrder = (orderId: string) => {
    console.log('DeliveryOrderNotificationsContainer - handleViewOrder called with:', orderId);
    markAsViewed(orderId);
    // Navegar para o pedido
    router.push(`/admin/business/establishments/${establishmentId}/delivery/${orderId}`);
  };

  console.log('DeliveryOrderNotificationsContainer - rendering with order:', order, 'isViewed:', isViewed);

  return (
    <PersistentOrderToast
      order={order}
      isViewed={isViewed}
      onViewOrder={handleViewOrder}
      onDismiss={dismiss}
    />
  );
}
