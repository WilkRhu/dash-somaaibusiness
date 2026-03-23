'use client';

import { useEffect, useState } from 'react';
import { DeliveryOrder } from '@/lib/types/delivery';

interface PersistentOrderToastProps {
  order: DeliveryOrder | null;
  onDismiss: () => void;
  onViewOrder: (orderId: string) => void;
  isViewed?: boolean;
}

export function PersistentOrderToast({
  order,
  onDismiss,
  onViewOrder,
  isViewed = false,
}: PersistentOrderToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (order && !isViewed) {
      setIsVisible(true);
      setPulse(true);

      // Parar de pulsar após 5 segundos
      const pulseTimer = setTimeout(() => {
        setPulse(false);
      }, 5000);

      return () => clearTimeout(pulseTimer);
    } else if (isViewed) {
      setIsVisible(false);
    }
  }, [order, isViewed]);

  if (!order || !isVisible) {
    return null;
  }

  const handleViewOrder = () => {
    onViewOrder(order.id);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-2xl overflow-hidden border border-blue-500 transition-all duration-300 ${
          pulse ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        }`}
      >
        {/* Animated top border */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 animate-pulse" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon with animation */}
            <div className={`flex-shrink-0 ${pulse ? 'animate-bounce' : ''}`}>
              <div className="relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg">Novo Pedido!</h3>
              <p className="text-blue-100 text-sm mt-1">
                Pedido #{order.orderNumber}
              </p>
              <p className="text-white font-semibold text-sm mt-2">
                {order.customerName}
              </p>
              <p className="text-blue-100 text-sm mt-1">
                {order.total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-blue-100 hover:text-white transition-colors"
              aria-label="Fechar notificação"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action button */}
          <button
            onClick={handleViewOrder}
            className="w-full mt-4 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group"
          >
            Ver Pedido
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-blue-800">
          <div className="h-full bg-blue-400 animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
