'use client';

import { useEffect, useState } from 'react';
import { KitchenOrder, OrderType } from '@/lib/types/kitchen-order';
import { playNotificationSound } from '@/lib/utils/notification-sound';

interface NewKitchenOrderToastProps {
  orders: KitchenOrder[];
  onDismiss: () => void;
  onViewOrder: (order: KitchenOrder) => void;
}

export default function NewKitchenOrderToast({
  orders,
  onDismiss,
  onViewOrder,
}: NewKitchenOrderToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (orders.length > 0) {
      setIsVisible(true);
      setPulse(true);

      // Tocar som imediatamente
      playNotificationSound();

      // Repetir som a cada 5 segundos enquanto visível
      const soundInterval = setInterval(() => {
        playNotificationSound();
      }, 5000);

      const pulseTimer = setTimeout(() => setPulse(false), 5000);
      return () => {
        clearInterval(soundInterval);
        clearTimeout(pulseTimer);
      };
    } else {
      setIsVisible(false);
    }
  }, [orders]);

  if (!isVisible || orders.length === 0) return null;

  const latestOrder = orders[0];
  const count = orders.length;

  const getOrderTypeLabel = (type: OrderType) => {
    const labels: Record<OrderType, string> = {
      [OrderType.COUNTER]: '🏪 Balcão',
      [OrderType.DINE_IN]: '🍽️ Mesa',
      [OrderType.DELIVERY]: '🚚 Entrega',
    };
    return labels[type] || type;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-2xl overflow-hidden border border-orange-500 transition-all duration-300 ${
          pulse ? 'ring-2 ring-orange-400 ring-opacity-50' : ''
        }`}
      >
        {/* Barra animada no topo */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-400 animate-pulse" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Ícone com animação */}
            <div className={`flex-shrink-0 ${pulse ? 'animate-bounce' : ''}`}>
              <div className="relative">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg">
                {count === 1 ? '🔔 Novo Pedido!' : `🔔 ${count} Novos Pedidos!`}
              </h3>
              <p className="text-orange-100 text-sm mt-1">
                Pedido #{latestOrder.orderNumber} • {getOrderTypeLabel(latestOrder.orderType)}
              </p>
              {latestOrder.tableNumber && (
                <p className="text-orange-100 text-sm">Mesa {latestOrder.tableNumber}</p>
              )}
              <div className="text-white text-sm mt-2 space-y-0.5">
                {latestOrder.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="font-medium">
                    {item.quantity}x {item.productName}
                  </div>
                ))}
                {latestOrder.items.length > 3 && (
                  <div className="text-orange-200 text-xs">
                    +{latestOrder.items.length - 3} itens
                  </div>
                )}
              </div>
              {latestOrder.customerName && (
                <p className="text-orange-200 text-xs mt-2">
                  👤 {latestOrder.customerName}
                </p>
              )}
            </div>

            {/* Botão fechar */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-orange-200 hover:text-white transition-colors"
              aria-label="Fechar notificação"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Botão de ação */}
          <button
            onClick={() => onViewOrder(latestOrder)}
            className="w-full mt-4 bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 group"
          >
            {count === 1 ? 'Ver Pedido' : 'Ver Pedidos'}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Barra inferior */}
        <div className="h-1 bg-red-800">
          <div className="h-full bg-orange-400 animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
