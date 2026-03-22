'use client';

import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { DeliveryETA } from '@/lib/hooks/use-delivery-realtime';

interface DeliveryRealtimeTableProps {
  orders: DeliveryOrder[];
  etas: Record<string, DeliveryETA>;
  selectedOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
}

export function DeliveryRealtimeTable({
  orders,
  etas,
  selectedOrderId,
  onSelectOrder,
}: DeliveryRealtimeTableProps) {
  const inDeliveryOrders = orders.filter(
    (o) => o.status === DeliveryStatus.OUT_FOR_DELIVERY
  );

  const getStatusBadgeColor = (status: DeliveryStatus) => {
    const colors: Record<DeliveryStatus, string> = {
      [DeliveryStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [DeliveryStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [DeliveryStatus.PREPARING]: 'bg-orange-100 text-orange-800',
      [DeliveryStatus.READY_FOR_DELIVERY]: 'bg-purple-100 text-purple-800',
      [DeliveryStatus.OUT_FOR_DELIVERY]: 'bg-blue-100 text-blue-800',
      [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [DeliveryStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [DeliveryStatus.FAILED]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    const labels: Record<DeliveryStatus, string> = {
      [DeliveryStatus.PENDING]: 'Pendente',
      [DeliveryStatus.CONFIRMED]: 'Confirmado',
      [DeliveryStatus.PREPARING]: 'Preparando',
      [DeliveryStatus.READY_FOR_DELIVERY]: 'Pronto',
      [DeliveryStatus.OUT_FOR_DELIVERY]: 'Em Entrega',
      [DeliveryStatus.DELIVERED]: 'Entregue',
      [DeliveryStatus.CANCELLED]: 'Cancelado',
      [DeliveryStatus.FAILED]: 'Falha',
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          Pedidos em Entrega ({inDeliveryOrders.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Entregador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ETA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inDeliveryOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhum pedido em entrega no momento
                </td>
              </tr>
            ) : (
              inDeliveryOrders.map((order) => {
                const eta = etas[order.id];
                const isSelected = selectedOrderId === order.id;

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder?.(order.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.driver?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {eta ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          ⏱️ {eta.minutes} min
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-sm font-medium ${getStatusBadgeColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
