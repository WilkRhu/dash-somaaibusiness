'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';
import { KitchenOrder } from '@/lib/types/kitchen-order';
import { playNotificationSound } from '@/lib/utils/notification-sound';

interface ReadyOrdersSelectProps {
  onSelectOrder: (order: KitchenOrder) => void;
  refreshTrigger?: number;
}

export default function ReadyOrdersSelect({ onSelectOrder, refreshTrigger }: ReadyOrdersSelectProps) {
  const { currentEstablishment } = useEstablishmentStore();
  const [readyOrders, setReadyOrders] = useState<KitchenOrder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [previousIds, setPreviousIds] = useState<string[]>([]);

  const fetchReadyOrders = useCallback(async () => {
    if (!currentEstablishment?.id) return;
    try {
      const result = await kitchenOrdersApi.listByStatus(
        currentEstablishment.id,
        'ready'
      );
      const orders = (result.data || []).filter((o) => !o.isPaid);

      // Detectar novos pedidos prontos
      const newIds = orders.map((o) => o.id);
      if (previousIds.length > 0) {
        const hasNew = newIds.some((id) => !previousIds.includes(id));
        if (hasNew) playNotificationSound();
      }
      setPreviousIds(newIds);
      setReadyOrders(orders);
    } catch {
      // silencioso
    }
  }, [currentEstablishment?.id, previousIds]);

  useEffect(() => {
    fetchReadyOrders();
  }, [currentEstablishment?.id, refreshTrigger]);

  if (readyOrders.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium relative"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Pedidos Prontos
        <span className="bg-white text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
          {readyOrders.length}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-green-50 border-b border-green-100">
              <h3 className="text-sm font-bold text-green-900">Pedidos prontos para cobrar</h3>
              <p className="text-xs text-green-700 mt-0.5">Selecione para efetuar o pagamento</p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {readyOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => {
                    onSelectOrder(order);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-gray-900">
                        Pedido #{order.orderNumber}
                      </span>
                      {order.customerName && (
                        <span className="text-xs text-gray-500 ml-2">
                          {order.customerName}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-green-700">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {order.items.map((item) => `${item.quantity}x ${item.productName}`).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
