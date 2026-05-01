'use client';

import { useEffect, useRef } from 'react';
import { useOrderToast } from '@/lib/context/order-toast-context';
import { useAuthStore } from '@/lib/stores/auth-store';
import { io, Socket } from 'socket.io-client';
import { DeliveryStatus } from '@/lib/types/delivery';

export function useOrderNotifications(establishmentId: string) {
  const { showNewOrder } = useOrderToast();
  const { token } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!establishmentId || !token) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: { token: `Bearer ${token}` },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe:establishment', { establishmentId });
    });

    socket.on('order:new', (order: any) => {
      if (
        order.status !== DeliveryStatus.DELIVERED &&
        order.status !== DeliveryStatus.CANCELLED
      ) {
        showNewOrder(order);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [establishmentId, token, showNewOrder]);
}
