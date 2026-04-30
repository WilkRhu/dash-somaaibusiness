'use client';

import { useEffect } from 'react';
import { useOrderStatusHistory } from '@/lib/hooks/use-order-status-history';
import { OrderStatusChange, KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderStatusHistoryProps {
  orderId: string;
}

const statusLabels: Record<KitchenOrderStatus, string> = {
  [KitchenOrderStatus.PENDING]: 'Pendente',
  [KitchenOrderStatus.CONFIRMED]: 'Confirmado',
  [KitchenOrderStatus.PREPARING]: 'Preparando',
  [KitchenOrderStatus.READY]: 'Pronto',
  [KitchenOrderStatus.PICKED_UP]: 'Retirado',
  [KitchenOrderStatus.CANCELLED]: 'Cancelado',
};

const statusColors: Record<KitchenOrderStatus, string> = {
  [KitchenOrderStatus.PENDING]: 'bg-gray-100 text-gray-700',
  [KitchenOrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-700',
  [KitchenOrderStatus.PREPARING]: 'bg-yellow-100 text-yellow-700',
  [KitchenOrderStatus.READY]: 'bg-green-100 text-green-700',
  [KitchenOrderStatus.PICKED_UP]: 'bg-purple-100 text-purple-700',
  [KitchenOrderStatus.CANCELLED]: 'bg-red-100 text-red-700',
};

export default function OrderStatusHistory({ orderId }: OrderStatusHistoryProps) {
  const { history, isLoading, error, fetchHistory } = useOrderStatusHistory(orderId);

  useEffect(() => {
    fetchHistory(orderId);
  }, [orderId, fetchHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-700">Erro ao carregar histórico: {error}</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-center">
        <p className="text-sm text-gray-600">Nenhuma mudança de status registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline */}
        <div className="space-y-4">
          {history.map((change: OrderStatusChange, index: number) => (
            <div key={change.id} className="flex gap-4">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 border-white ${statusColors[change.newStatus]} shadow-md`} />
                {index < history.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  {/* Status transition */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[change.previousStatus]}`}>
                      {statusLabels[change.previousStatus]}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[change.newStatus]}`}>
                      {statusLabels[change.newStatus]}
                    </span>
                  </div>

                  {/* Changed by and time */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{change.changedBy.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(change.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
