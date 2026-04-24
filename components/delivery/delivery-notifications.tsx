'use client';

import { useEffect, useState } from 'react';
import { useNewOrders } from '@/lib/hooks/use-delivery-websocket';
import { DeliveryOrder } from '@/lib/types/delivery';

interface DeliveryNotificationsProps {
  establishmentId: string;
  onNewOrder?: (order: DeliveryOrder) => void;
}

export function DeliveryNotifications({ establishmentId, onNewOrder }: DeliveryNotificationsProps) {
  const [notifications, setNotifications] = useState<Array<{ id: string; order: DeliveryOrder; timestamp: number }>>([]);

  const handleNewOrder = (order: DeliveryOrder) => {
    const notification = {
      id: order.id,
      order,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [notification, ...prev]);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== order.id));
    }, 10000);

    onNewOrder?.(order);

    // Play notification sound
    playNotificationSound();
  };

  useNewOrders(establishmentId, handleNewOrder);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {
        // Ignorar erro se o áudio não puder ser reproduzido
      });
    } catch (e) {
      // Ignorar erro
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Novo Pedido!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Pedido #{notification.order.orderNumber} de {notification.order.customerName}
              </p>
              <p className="text-sm font-semibold text-green-600 mt-1">
                {notification.order.total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
