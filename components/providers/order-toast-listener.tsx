'use client';

import { useOrderNotifications } from '@/lib/hooks/use-order-notifications';

interface OrderToastListenerProps {
  establishmentId: string;
}

export function OrderToastListener({ establishmentId }: OrderToastListenerProps) {
  // Usar o novo hook que detecta novos pedidos via polling
  useOrderNotifications(establishmentId);

  return null;
}
