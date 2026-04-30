'use client';

import { useEffect, useState } from 'react';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { KitchenOrderStatus, KitchenOrder } from '@/lib/types/kitchen-order';

export default function KitchenDisplayFullscreenPage() {
  const [now, setNow] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'ready' | 'preparing'>('all');

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

  const activeOrders = orders.filter(
    (o) => o.status !== KitchenOrderStatus.PICKED_UP && o.status !== KitchenOrderStatus.CANCELLED
  );

  const readyOrders = activeOrders.filter((o) => o.status === KitchenOrderStatus.READY);
  const preparingOrders = activeOrders.filter((o) => o.status !== KitchenOrderStatus.READY);

  const displayOrders =
    selectedTab === 'ready' ? readyOrders : selectedTab === 'preparing' ? preparingOrders : activeOrders;

  const getElapsedTime = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    return Math.floor((now - created) / 60000);
  };

  const getStatusColor = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.READY:
        return 'bg-gradient-to-br from-green-500 to-green-600';
      case KitchenOrderStatus.PREPARING:
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case KitchenOrderStatus.CONFIRMED:
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      case KitchenOrderStatus.PENDING:
        return 'bg-gradient-to-br from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getStatusLabel = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.READY:
        return 'PRONTO';
      case KitchenOrderStatus.PREPARING:
        return 'PREPARANDO';
      case KitchenOrderStatus.CONFIRMED:
        return 'CONFIRMADO';
      case KitchenOrderStatus.PENDING:
        return 'RECEBIDO';
      default:
        return 'ATIVO';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-7xl font-black mb-2">PAINEL DE PEDIDOS</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-2xl">Acompanhamento em tempo real</p>
          <div className="text-right">
            <p className="text-gray-400 text-lg">Total</p>
            <p className="text-5xl font-black">{activeOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { id: 'all', label: `Todos (${activeOrders.length})` },
          { id: 'ready', label: `Prontos (${readyOrders.length})` },
          { id: 'preparing', label: `Preparando (${preparingOrders.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
              selectedTab === tab.id
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid de Pedidos */}
      {displayOrders.length === 0 ? (
        <div className="h-96 flex items-center justify-center bg-gray-900 rounded-3xl border-4 border-gray-800">
          <div className="text-center">
            <p className="text-7xl mb-4">✨</p>
            <p className="text-white text-4xl font-black">Nenhum pedido</p>
            <p className="text-gray-400 text-2xl mt-2">
              {selectedTab === 'ready' ? 'Sem pedidos prontos' : 'Aguardando novos pedidos...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayOrders.map((order) => {
            const elapsed = getElapsedTime(order.createdAt);
            const isOvertime = order.estimatedPrepTime > 0 && elapsed > order.estimatedPrepTime;
            const isReady = order.status === KitchenOrderStatus.READY;

            return (
              <div
                key={order.id}
                className={`${getStatusColor(order.status as KitchenOrderStatus)} rounded-2xl p-6 text-white transition-all transform ${
                  isReady ? 'ring-4 ring-yellow-300 scale-105 animate-pulse' : ''
                }`}
              >
                {/* Status Label */}
                <div className="bg-black/30 rounded-lg px-3 py-2 text-center font-black text-sm mb-4 uppercase tracking-wider">
                  {getStatusLabel(order.status as KitchenOrderStatus)}
                </div>

                {/* Número do Pedido - GIGANTE */}
                <div className="text-center mb-4">
                  <p className="text-9xl font-black leading-none">{order.orderNumber}</p>
                </div>

                {/* Tipo */}
                <div className="text-center mb-4 text-2xl font-bold">
                  {order.orderType === 'dine_in' ? '🍽️' : order.orderType === 'delivery' ? '🚗' : '🛍️'}
                  {order.orderType === 'dine_in' && order.tableNumber && (
                    <p className="text-3xl font-black mt-1">#{order.tableNumber}</p>
                  )}
                </div>

                {/* Cliente */}
                {order.customerName && (
                  <div className="text-center mb-4 bg-black/30 rounded-lg p-2">
                    <p className="text-xs opacity-75">Cliente</p>
                    <p className="font-bold text-sm truncate">{order.customerName}</p>
                  </div>
                )}

                {/* Tempo */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-black/30 rounded-lg p-2 text-center">
                    <p className="text-xs opacity-75">Tempo</p>
                    <p className={`text-3xl font-black ${isOvertime ? 'text-yellow-300' : ''}`}>{elapsed}m</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2 text-center">
                    <p className="text-xs opacity-75">Est.</p>
                    <p className="text-3xl font-black">{order.estimatedPrepTime}m</p>
                  </div>
                </div>

                {/* Itens */}
                <div className="bg-black/30 rounded-lg p-3 mb-4 max-h-24 overflow-y-auto text-sm">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="mb-1">
                      <span className="font-bold">{item.quantity}x</span> {item.productName}
                    </div>
                  ))}
                </div>

                {/* Prioridade */}
                {order.priority === 'high' && (
                  <div className="bg-red-600 rounded-lg p-2 text-center font-black text-sm mb-4">
                    ⚠️ ALTA PRIORIDADE
                  </div>
                )}

                {/* Ready Badge */}
                {isReady && (
                  <div className="bg-yellow-400 text-black rounded-lg p-3 text-center font-black text-lg">
                    ✓ PRONTO
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
            autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {autoRefresh ? '⏸ Pausar' : '▶ Retomar'}
        </button>
        <button
          onClick={() => refetch()}
          className="px-6 py-3 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-700 transition-all"
        >
          🔄 Atualizar
        </button>
      </div>
    </div>
  );
}
