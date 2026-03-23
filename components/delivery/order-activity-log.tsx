'use client';

import { DeliveryOrder } from '@/lib/types/delivery';

interface OrderActivityLogProps {
  order: DeliveryOrder;
}

export function OrderActivityLog({ order }: OrderActivityLogProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready_for_delivery: 'Pronto para entrega',
      out_for_delivery: 'Saiu para entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      failed: 'Falhou',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready_for_delivery: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      confirmed: '✓',
      preparing: '👨‍🍳',
      ready_for_delivery: '📦',
      out_for_delivery: '🚚',
      delivered: '✓✓',
      cancelled: '✕',
      failed: '⚠️',
    };
    return icons[status] || '•';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico do Pedido</h2>
      
      <div className="space-y-4">
        {/* Status Atual */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
              <span className="text-sm text-gray-500">Status Atual</span>
            </div>
            {order.updatedAt && (
              <p className="text-sm text-gray-600 mt-1">
                {new Date(order.updatedAt).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        {/* Criação do Pedido */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 text-lg">
              📝
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Pedido Criado</p>
            {order.createdAt && (
              <p className="text-sm text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        {order.notes && (
          <div className="flex items-start gap-4 pt-4 border-t">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 text-lg">
                💬
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Observações</p>
              <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Visual */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm font-medium text-gray-900 mb-3">Fluxo do Pedido</p>
        <div className="flex items-center justify-between text-xs">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-1">
              ✓
            </div>
            <p className="text-gray-600">Criado</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className={`text-center ${order.status !== 'pending' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
              order.status !== 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              ✓
            </div>
            <p className="text-gray-600">Confirmado</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className={`text-center ${['preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered'].includes(order.status) ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
              ['preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered'].includes(order.status) ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
            }`}>
              ✓
            </div>
            <p className="text-gray-600">Preparando</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className={`text-center ${['out_for_delivery', 'delivered'].includes(order.status) ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
              ['out_for_delivery', 'delivered'].includes(order.status) ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
            }`}>
              ✓
            </div>
            <p className="text-gray-600">Em Trânsito</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className={`text-center ${order.status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
              order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              ✓
            </div>
            <p className="text-gray-600">Entregue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
