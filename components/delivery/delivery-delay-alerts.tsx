'use client';

import { useMemo } from 'react';
import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';

interface DeliveryDelayAlertsProps {
  orders: DeliveryOrder[];
}

interface DelayedOrder extends DeliveryOrder {
  delayMinutes: number;
}

export function DeliveryDelayAlerts({ orders }: DeliveryDelayAlertsProps) {
  const delayedOrders = useMemo(() => {
    return orders
      .filter((order) => order.status === DeliveryStatus.OUT_FOR_DELIVERY)
      .map((order) => {
        const dispatchedTime = order.dispatchedAt ? new Date(order.dispatchedAt).getTime() : Date.now();
        const estimatedDeliveryTime = dispatchedTime + order.estimatedDeliveryTime * 60 * 1000;
        const delayMinutes = Math.max(0, Math.floor((Date.now() - estimatedDeliveryTime) / 60 / 1000));
        return { ...order, delayMinutes };
      })
      .filter((order) => order.delayMinutes > 0);
  }, [orders]);

  if (delayedOrders.length === 0) {
    return null;
  }

  const criticalDelays = delayedOrders.filter((o) => o.delayMinutes > 30);
  const warningDelays = delayedOrders.filter((o) => o.delayMinutes <= 30);

  return (
    <div className="space-y-4 mb-6">
      {/* Critical Delays */}
      {criticalDelays.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M7.08 6.47a9 9 0 1 1 9.84 0" />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-red-900">Atrasos Críticos!</h3>
              <p className="text-sm text-red-800 mt-1">
                {criticalDelays.length} entrega(s) com atraso superior a 30 minutos
              </p>
              <div className="mt-3 space-y-2">
                {criticalDelays.map((order) => (
                  <div key={order.id} className="bg-white rounded p-2 text-sm">
                    <p className="font-semibold text-gray-900">
                      Pedido #{order.orderNumber} - {order.customerName}
                    </p>
                    <p className="text-red-600">
                      ⏱️ {order.delayMinutes} minutos de atraso
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Delays */}
      {warningDelays.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M7.08 6.47a9 9 0 1 1 9.84 0" />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900">Atrasos Detectados</h3>
              <p className="text-sm text-yellow-800 mt-1">
                {warningDelays.length} entrega(s) com atraso
              </p>
              <div className="mt-3 space-y-2">
                {warningDelays.map((order) => (
                  <div key={order.id} className="bg-white rounded p-2 text-sm">
                    <p className="font-semibold text-gray-900">
                      Pedido #{order.orderNumber} - {order.customerName}
                    </p>
                    <p className="text-yellow-600">
                      ⏱️ {order.delayMinutes} minutos de atraso
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
