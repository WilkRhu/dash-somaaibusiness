'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { KitchenOrderStatus, KitchenOrder } from '@/lib/types/kitchen-order';

const statusConfig = {
  [KitchenOrderStatus.PENDING]: {
    label: 'RECEBIDO',
    color: 'bg-red-600',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-600',
  },
  [KitchenOrderStatus.CONFIRMED]: {
    label: 'CONFIRMADO',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
  },
  [KitchenOrderStatus.PREPARING]: {
    label: 'PREPARANDO',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-600',
  },
  [KitchenOrderStatus.READY]: {
    label: 'PRONTO',
    color: 'bg-green-600',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-600',
  },
};

export default function KitchenDisplayPage() {
  const searchParams = useSearchParams();
  const establishmentId = searchParams.get('establishmentId');
  const [now, setNow] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { orders, refetch } = useKitchenOrders({ limit: 100 });

  // Atualizar a cada 2 segundos
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setNow(Date.now());
      refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  const activeOrders = orders
    .filter((o) => o.status !== KitchenOrderStatus.PICKED_UP && o.status !== KitchenOrderStatus.CANCELLED)
    .sort((a, b) => {
      // Ordenar por status (READY primeiro, depois PREPARING, etc)
      const statusOrder = {
        [KitchenOrderStatus.READY]: 0,
        [KitchenOrderStatus.PREPARING]: 1,
        [KitchenOrderStatus.CONFIRMED]: 2,
        [KitchenOrderStatus.PENDING]: 3,
      };
      return (statusOrder[a.status as keyof typeof statusOrder] || 999) - (statusOrder[b.status as keyof typeof statusOrder] || 999);
    });

  const getElapsedTime = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    return Math.floor((now - created) / 60000);
  };

  const getStatusConfig = (status: KitchenOrderStatus) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig[KitchenOrderStatus.PENDING];
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white">PAINEL DE PEDIDOS</h1>
            <p className="text-gray-400 text-lg mt-2">Acompanhamento em tempo real</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total de pedidos</p>
            <p className="text-5xl font-black text-white">{activeOrders.length}</p>
          </div>
        </div>

        {/* Grid de Pedidos */}
        {activeOrders.length === 0 ? (
          <div className="h-96 flex items-center justify-center bg-gray-900 rounded-3xl border-4 border-gray-800">
            <div className="text-center">
              <p className="text-6xl mb-4">✨</p>
              <p className="text-white text-3xl font-bold">Nenhum pedido no momento</p>
              <p className="text-gray-400 text-xl mt-2">Aguardando novos pedidos...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeOrders.map((order) => {
              const config = getStatusConfig(order.status as KitchenOrderStatus);
              const elapsed = getElapsedTime(order.createdAt);
              const isOvertime = order.estimatedPrepTime > 0 && elapsed > order.estimatedPrepTime;

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border-4 p-6 transition-all ${config.color} ${
                    order.status === KitchenOrderStatus.READY ? 'ring-4 ring-green-300 scale-105' : ''
                  }`}
                >
                  {/* Status Badge */}
                  <div className={`${config.bgLight} ${config.textColor} rounded-xl px-4 py-2 text-center font-black text-sm mb-4 uppercase tracking-wider`}>
                    {config.label}
                  </div>

                  {/* Número do Pedido - GRANDE */}
                  <div className="text-center mb-4">
                    <p className="text-white text-sm opacity-75 uppercase tracking-widest">Pedido</p>
                    <p className="text-7xl md:text-8xl font-black text-white leading-none">{order.orderNumber}</p>
                  </div>

                  {/* Tipo de Pedido */}
                  <div className="text-center mb-4">
                    <p className="text-white text-lg font-bold">
                      {order.orderType === 'dine_in' ? '🍽️ Mesa' : order.orderType === 'delivery' ? '🚗 Entrega' : '🛍️ Balcão'}
                    </p>
                    {order.orderType === 'dine_in' && order.tableNumber && (
                      <p className="text-white text-2xl font-black mt-1">#{order.tableNumber}</p>
                    )}
                  </div>

                  {/* Cliente */}
                  {order.customerName && (
                    <div className="text-center mb-4 bg-white/10 rounded-lg p-2">
                      <p className="text-white text-sm opacity-75">Cliente</p>
                      <p className="text-white font-bold text-lg truncate">{order.customerName}</p>
                    </div>
                  )}

                  {/* Tempo */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <p className="text-white text-xs opacity-75">Tempo</p>
                      <p className={`text-2xl font-black ${isOvertime ? 'text-red-300' : 'text-white'}`}>{elapsed}m</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <p className="text-white text-xs opacity-75">Estimado</p>
                      <p className="text-2xl font-black text-white">{order.estimatedPrepTime}m</p>
                    </div>
                  </div>

                  {/* Itens */}
                  <div className="bg-white/10 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                    <p className="text-white text-xs opacity-75 mb-2 uppercase font-bold">Itens</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-white text-sm">
                          <span className="font-bold">{item.quantity}x</span> {item.productName}
                          {item.notes && <p className="text-xs opacity-75 ml-4">{item.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prioridade */}
                  {order.priority === 'high' && (
                    <div className="bg-red-500 text-white rounded-lg p-2 text-center font-black text-lg mb-4">
                      ⚠️ ALTA PRIORIDADE
                    </div>
                  )}

                  {/* Status Ready */}
                  {order.status === KitchenOrderStatus.READY && (
                    <div className="bg-green-500 text-white rounded-lg p-3 text-center font-black text-2xl animate-pulse">
                      ✓ PRONTO PARA RETIRADA
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Controles */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
              autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {autoRefresh ? '⏸ Pausar' : '▶ Retomar'}
          </button>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 rounded-xl font-bold text-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>
    </div>
  );
}
