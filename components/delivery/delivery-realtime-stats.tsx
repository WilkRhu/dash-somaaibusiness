'use client';

import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';

interface DeliveryRealtimeStatsProps {
  orders: DeliveryOrder[];
  isConnected: boolean;
}

export function DeliveryRealtimeStats({ orders, isConnected }: DeliveryRealtimeStatsProps) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === DeliveryStatus.PENDING).length,
    inDelivery: orders.filter((o) => o.status === DeliveryStatus.OUT_FOR_DELIVERY).length,
    delivered: orders.filter((o) => o.status === DeliveryStatus.DELIVERED).length,
    failed: orders.filter((o) => o.status === DeliveryStatus.FAILED).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Connection Status */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-2xl font-bold">
              {isConnected ? '🟢' : '🔴'}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Total</p>
        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Pendentes</p>
        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
      </div>

      {/* In Delivery */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Em Entrega</p>
        <p className="text-2xl font-bold text-blue-600">{stats.inDelivery}</p>
      </div>

      {/* Delivered */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Entregues</p>
        <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
      </div>

      {/* Failed */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Falhas</p>
        <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
      </div>
    </div>
  );
}
