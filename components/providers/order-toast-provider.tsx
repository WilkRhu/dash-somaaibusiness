'use client';

import { ReactNode, useState, useCallback, useEffect } from 'react';
import { DeliveryOrder } from '@/lib/types/delivery';
import { OrderToastContext } from '@/lib/context/order-toast-context';
import { PersistentOrderToast } from '@/components/delivery/persistent-order-toast';
import { AudioPlayer } from './audio-player';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

interface OrderToastProviderProps {
  children: ReactNode;
  establishmentId?: string;
}

export function OrderToastProvider({ children, establishmentId }: OrderToastProviderProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [isViewed, setIsViewed] = useState(false);

  const showNewOrder = useCallback((newOrder: DeliveryOrder) => {
    setOrder(newOrder);
    setIsViewed(false);
  }, []);

  const markAsViewed = useCallback(() => {
    setIsViewed(true);
  }, []);

  const dismiss = useCallback(() => {
    setOrder(null);
    setIsViewed(false);
  }, []);

  // Auto-dismiss após visualizar
  useEffect(() => {
    if (isViewed) {
      const timer = setTimeout(() => {
        dismiss();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isViewed, dismiss]);

  const handleViewOrder = (orderId: string) => {
    markAsViewed();
    // Super admin no painel admin deve permanecer no fluxo do admin
    if (user?.role === 'super_admin' && establishmentId) {
      router.push(`/admin/business/establishments/${establishmentId}/delivery`);
      return;
    }

    // Navegar para a página de pedidos
    router.push('/delivery/orders');
  };

  const handleDismiss = () => {
    dismiss();
  };

  return (
    <OrderToastContext.Provider
      value={{
        order,
        isViewed,
        showNewOrder,
        markAsViewed,
        dismiss,
      }}
    >
      {children}
      <AudioPlayer isPlaying={order !== null && !isViewed} />
      <PersistentOrderToast
        order={order}
        isViewed={isViewed}
        onViewOrder={handleViewOrder}
        onDismiss={handleDismiss}
      />
    </OrderToastContext.Provider>
  );
}
