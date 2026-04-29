'use client';

import { useState, useEffect } from 'react';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { showToast } from '@/components/ui/toast';

export default function KitchenTicketsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);

  const { orders, isLoading, refetch } = useKitchenOrders({
    limit: 100,
  });

  // Auto-refresh a cada 2 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Filtrar apenas pedidos ativos
  const activeOrders = orders.filter(
    (o) => o.status !== KitchenOrderStatus.PICKED_UP && o.status !== KitchenOrderStatus.CANCELLED
  );

  const getStatusLabel = (status: KitchenOrderStatus) => {
    const labels: Record<KitchenOrderStatus, string> = {
      [KitchenOrderStatus.PENDING]: 'Novo',
      [KitchenOrderStatus.CONFIRMED]: 'Confirmado',
      [KitchenOrderStatus.PREPARING]: 'Preparando',
      [KitchenOrderStatus.READY]: 'Pronto',
      [KitchenOrderStatus.PICKED_UP]: 'Retirado',
      [KitchenOrderStatus.CANCELLED]: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: KitchenOrderStatus) => {
    const iconClass = 'w-8 h-8';
    switch (status) {
      case KitchenOrderStatus.PENDING:
        return (
          <svg className={`${iconClass} text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case KitchenOrderStatus.CONFIRMED:
        return (
          <svg className={`${iconClass} text-yellow-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case KitchenOrderStatus.PREPARING:
        return (
          <svg className={`${iconClass} text-blue-400 animate-pulse`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case KitchenOrderStatus.READY:
        return (
          <svg className={`${iconClass} text-green-400 animate-bounce`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case KitchenOrderStatus.PICKED_UP:
        return (
          <svg className={`${iconClass} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: KitchenOrderStatus) => {
    const colors: Record<KitchenOrderStatus, string> = {
      [KitchenOrderStatus.PENDING]: 'bg-gradient-to-br from-red-600 to-red-700 border-red-500',
      [KitchenOrderStatus.CONFIRMED]: 'bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500',
      [KitchenOrderStatus.PREPARING]: 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500',
      [KitchenOrderStatus.READY]: 'bg-gradient-to-br from-green-600 to-green-700 border-green-500',
      [KitchenOrderStatus.PICKED_UP]: 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500',
      [KitchenOrderStatus.CANCELLED]: 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500',
    };
    return colors[status] || 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500';
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Acompanhamento</h1>
              <p className="text-gray-600 text-sm">Verifique o status da sua senha</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`p-3 rounded-lg transition-all ${
            autoRefresh
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={autoRefresh ? 'Auto-atualização ativa' : 'Auto-atualização inativa'}
        >
          <svg className={`w-5 h-5 transition-transform ${autoRefresh ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Grid de Senhas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeOrders.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400 text-xl">Nenhum pedido em andamento</p>
          </div>
        ) : (
          activeOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrderNumber(order.orderNumber)}
              className={`p-6 rounded-xl text-center transition-all transform hover:scale-105 cursor-pointer border-2 ${
                selectedOrderNumber === order.orderNumber
                  ? 'ring-4 ring-white shadow-2xl'
                  : 'shadow-lg'
              } ${getStatusColor(order.status)}`}
            >
              {/* Número da Senha */}
              <div className="text-6xl font-black text-white mb-4">{order.orderNumber}</div>

              {/* Status com ícone */}
              <div className="bg-black/30 rounded-lg p-3 mb-4">
                <div className="flex justify-center mb-2">
                  {getStatusIcon(order.status)}
                </div>
                <div className="text-white font-bold text-lg">{getStatusLabel(order.status)}</div>
              </div>

              {/* Tipo de Pedido */}
              {order.orderType === 'dine_in' && order.tableNumber && (
                <div className="text-white text-sm font-semibold bg-black/20 rounded px-3 py-1 inline-block">
                  Mesa {order.tableNumber}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Detalhes do Pedido Selecionado */}
      {selectedOrderNumber && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          {(() => {
            const selectedOrder = activeOrders.find((o) => o.orderNumber === selectedOrderNumber);
            if (!selectedOrder) return null;

            return (
              <div className="bg-white rounded-2xl max-w-md w-full p-8">
                <button
                  onClick={() => setSelectedOrderNumber(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>

                {/* Número da Senha Grande */}
                <div className="text-center mb-6">
                  <div className={`text-8xl font-black mb-4 ${getStatusColor(selectedOrder.status)} text-white rounded-2xl py-6`}>
                    {selectedOrder.orderNumber}
                  </div>
                </div>

                {/* Status */}
                <div className="text-center mb-6">
                  <div className="mb-4">
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div className={`text-3xl font-bold ${getStatusColor(selectedOrder.status)} text-white rounded-lg py-3`}>
                    {getStatusLabel(selectedOrder.status)}
                  </div>
                </div>

                {/* Itens */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Seu Pedido:</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="text-gray-700">
                        <span className="font-semibold">{item.quantity}x</span> {item.productName}
                        {item.notes && (
                          <div className="text-sm text-gray-600 italic">({item.notes})</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tempo */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Tempo de preparo</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.floor((new Date().getTime() - new Date(selectedOrder.createdAt).getTime()) / 60000)} / {selectedOrder.estimatedPrepTime} min
                  </div>
                </div>

                {/* Mensagem de Status */}
                <div className="text-center">
                  {selectedOrder.status === KitchenOrderStatus.READY && (
                    <div className="text-2xl font-bold text-green-600 animate-pulse">
                      ✅ Seu pedido está pronto!
                    </div>
                  )}
                  {selectedOrder.status === KitchenOrderStatus.PREPARING && (
                    <div className="text-2xl font-bold text-blue-600">
                      👨‍🍳 Preparando seu pedido...
                    </div>
                  )}
                  {selectedOrder.status === KitchenOrderStatus.PENDING && (
                    <div className="text-2xl font-bold text-yellow-600">
                      ⏳ Pedido recebido, aguarde...
                    </div>
                  )}
                  {selectedOrder.status === KitchenOrderStatus.CONFIRMED && (
                    <div className="text-2xl font-bold text-yellow-600">
                      ✓ Pedido confirmado, iniciando preparo...
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedOrderNumber(null)}
                  className="w-full mt-6 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold text-lg"
                >
                  Fechar
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
