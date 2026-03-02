'use client';

import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';

interface DeliveryOrderCardProps {
  order: DeliveryOrder;
  onViewDetails: (order: DeliveryOrder) => void;
  onUpdateStatus: (order: DeliveryOrder) => void;
}

const statusLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'Pendente',
  [DeliveryStatus.CONFIRMED]: 'Confirmado',
  [DeliveryStatus.PREPARING]: 'Preparando',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'Pronto',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'Saiu para entrega',
  [DeliveryStatus.DELIVERED]: 'Entregue',
  [DeliveryStatus.CANCELLED]: 'Cancelado',
  [DeliveryStatus.FAILED]: 'Falhou',
};

const statusColors: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [DeliveryStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [DeliveryStatus.PREPARING]: 'bg-purple-100 text-purple-800',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'bg-indigo-100 text-indigo-800',
  [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [DeliveryStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [DeliveryStatus.FAILED]: 'bg-gray-100 text-gray-800',
};

export function DeliveryOrderCard({ order, onViewDetails, onUpdateStatus }: DeliveryOrderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">#{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">{order.customerName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700">{order.deliveryNeighborhood}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-gray-700">{order.customerPhone}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-700">{order.estimatedDeliveryTime} min</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(order)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Ver Detalhes
          </button>
          {order.status !== DeliveryStatus.DELIVERED && order.status !== DeliveryStatus.CANCELLED && (
            <button
              onClick={() => onUpdateStatus(order)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Atualizar Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
