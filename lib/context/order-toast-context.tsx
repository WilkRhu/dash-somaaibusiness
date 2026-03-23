'use client';

import { createContext, useContext, ReactNode } from 'react';
import { DeliveryOrder } from '@/lib/types/delivery';

interface OrderToastContextType {
  order: DeliveryOrder | null;
  isViewed: boolean;
  showNewOrder: (order: DeliveryOrder) => void;
  markAsViewed: (orderId: string) => void;
  dismiss: () => void;
}

const OrderToastContext = createContext<OrderToastContextType | undefined>(undefined);

export function useOrderToast() {
  const context = useContext(OrderToastContext);
  if (!context) {
    throw new Error('useOrderToast must be used within OrderToastProvider');
  }
  return context;
}

export { OrderToastContext };
