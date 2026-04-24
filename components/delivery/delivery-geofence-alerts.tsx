'use client';

import { GeofenceAlert } from '@/lib/hooks/use-delivery-realtime';

interface DeliveryGeofenceAlertsProps {
  alerts: GeofenceAlert[];
  onClear?: (orderId: string) => void;
}

export function DeliveryGeofenceAlerts({ alerts, onClear }: DeliveryGeofenceAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🚨</span>
        <h3 className="font-semibold text-yellow-900">Alertas de Proximidade</h3>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={`${alert.orderId}-${alert.timestamp.getTime()}`}
            className="bg-white rounded p-3 flex items-start justify-between gap-3"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Pedido {alert.orderId}
              </p>
              <p className="text-sm text-gray-600">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                Distância: {alert.distance.toFixed(2)} km
              </p>
            </div>
            <button
              onClick={() => onClear?.(alert.orderId)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
