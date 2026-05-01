'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useKitchenOrdersStore } from '@/lib/stores/kitchen-orders-store';
import { KitchenOrder } from '@/lib/types/kitchen-order';

function normalize(raw: any): KitchenOrder {
  return {
    id: String(raw.id),
    orderNumber: raw.dailyNumber ? String(raw.dailyNumber) : raw.orderNumber || raw.orderId || String(raw.id),
    establishmentId: raw.establishmentId,
    orderType: raw.orderType,
    customerName: raw.customerName || undefined,
    customerPhone: raw.customerPhone || undefined,
    tableNumber: raw.tableNumber || undefined,
    items: (raw.items || []).map((item: any) => ({
      id: String(item.id),
      inventoryItemId: item.inventoryItemId || item.itemId || undefined,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice) || 0,
      notes: item.notes || undefined,
      preparationTime: item.preparationTime || undefined,
    })),
    subtotal: parseFloat(raw.subtotal) || parseFloat(raw.total) || 0,
    discount: parseFloat(raw.discount) || 0,
    total: parseFloat(raw.total) || 0,
    status: raw.status,
    estimatedPrepTime: raw.estimatedPrepTime || 0,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || undefined,
    confirmedAt: raw.confirmedAt || undefined,
    startedAt: raw.startedAt || undefined,
    readyAt: raw.readyAt || undefined,
    pickedUpAt: raw.pickedUpAt || undefined,
    notes: raw.notes || undefined,
    priority: raw.priority || 'normal',
    history: raw.history || [],
    isPaid: raw.isPaid ?? false,
  };
}

export function useKitchenSocket(establishmentId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const { addOrder, setOrder, removeOrder } = useKitchenOrdersStore();

  useEffect(() => {
    if (!establishmentId) return;

    const socket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}/kitchen`,
      {
        query: { establishmentId },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling'],
      }
    );

    socketRef.current = socket;

    socket.on('order:created', (raw: any) => {
      addOrder(normalize(raw));
    });

    socket.on('order:status-changed', (raw: any) => {
      setOrder(normalize(raw));
    });

    socket.on('order:updated', (raw: any) => {
      setOrder(normalize(raw));
    });

    socket.on('order:paid', (raw: any) => {
      removeOrder(String(raw.id));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [establishmentId]);

  return socketRef;
}
