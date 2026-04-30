'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';
import { KitchenOrderStatus, KitchenOrder } from '@/lib/types/kitchen-order';

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TableIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export default function CustomerTrackingPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [alertOrder, setAlertOrder] = useState<KitchenOrder | null>(null);
  const previousReadyOrdersRef = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isKitchenTypeEstablishment = isKitchenEstablishment(currentEstablishment?.type);
  const hasKitchenRole = currentEstablishment?.roles?.some((role: any) =>
    role === 'kitchen_cook' || role === 'kitchen_manager' || role === 'business_owner' || role === 'business_admin'
  );
  const canAccessKitchen = isKitchenTypeEstablishment || hasKitchenRole;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!canAccessKitchen && currentEstablishment) {
        router.push('/home');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [canAccessKitchen, currentEstablishment, router]);

  const { orders, refetch } = useKitchenOrders({ limit: 100 });

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setNow(Date.now());
      refetch();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  useEffect(() => {
    const readyOrderIds = orders
      .filter((o) => o.status === KitchenOrderStatus.READY)
      .map((o) => o.id);
    const newReadyOrders = readyOrderIds.filter((id) => !previousReadyOrdersRef.current.includes(id));
    if (newReadyOrders.length > 0) {
      const newOrder = orders.find((o) => o.id === newReadyOrders[0]);
      if (newOrder) {
        setAlertOrder(newOrder);
        playNotificationSound();
        setTimeout(() => setAlertOrder(null), 5000);
      }
    }
    previousReadyOrdersRef.current = readyOrderIds;
  }, [orders]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Som nao disponivel');
    }
  };

  const todayOrders = orders.filter((o) => isToday(o.createdAt));

  const activeOrders = todayOrders
    .filter((o) => o.status !== KitchenOrderStatus.PICKED_UP && o.status !== KitchenOrderStatus.CANCELLED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const readyOrders = todayOrders
    .filter((o) => o.status === KitchenOrderStatus.READY)
    .sort((a, b) =>
      new Date(b.readyAt || b.updatedAt || b.createdAt).getTime() -
      new Date(a.readyAt || a.updatedAt || a.createdAt).getTime()
    );

  const getStatusColor = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.READY: return 'bg-green-100 text-green-800';
      case KitchenOrderStatus.PREPARING: return 'bg-blue-100 text-blue-800';
      case KitchenOrderStatus.CONFIRMED: return 'bg-yellow-100 text-yellow-800';
      case KitchenOrderStatus.PENDING: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.READY: return 'PRONTO';
      case KitchenOrderStatus.PREPARING: return 'PREPARANDO';
      case KitchenOrderStatus.CONFIRMED: return 'CONFIRMADO';
      case KitchenOrderStatus.PENDING: return 'RECEBIDO';
      default: return 'ATIVO';
    }
  };

  const getElapsedTime = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    if (isNaN(created)) return 0;
    return Math.max(0, Math.floor((now - created) / 60000));
  };

  return (
    <div className="p-6">
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-600">Carregando...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {alertOrder && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-bounce">
                <div className="text-center">
                  <div className="text-7xl mb-4">✅</div>
                  <h2 className="text-3xl font-black text-green-600 mb-2">PEDIDO PRONTO!</h2>
                  <p className="text-5xl font-black text-gray-900 mb-4">{alertOrder.orderNumber}</p>
                  <div className="flex items-center justify-center gap-2 text-xl text-gray-700 mb-2">
                    <UserIcon />
                    <span>{alertOrder.customerName || 'Não informado'}</span>
                  </div>
                  <p className="text-lg text-gray-600">Pode retirar no balcão</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-full">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <TableIcon />
                <h1 className="text-4xl font-bold text-gray-900">Painel de Pedidos</h1>
              </div>
              <p className="text-gray-600 ml-8">Acompanhamento em tempo real — hoje</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
                  <TrendingUpIcon />
                  <div>
                    <h2 className="text-2xl font-bold">Em Andamento</h2>
                    <p className="text-blue-100 text-sm">{activeOrders.length} pedido{activeOrders.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tempo</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <p className="text-lg">Nenhum pedido em andamento</p>
                          </td>
                        </tr>
                      ) : (
                        activeOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-2xl font-bold text-blue-600">{order.orderNumber}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <UserIcon />
                                <span className="text-sm text-gray-900">{order.customerName || '-'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status as KitchenOrderStatus)}`}>
                                {getStatusLabel(order.status as KitchenOrderStatus)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <ClockIcon />
                                <span>{getElapsedTime(order.createdAt)}m</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {order.orderType === 'dine_in' ? '🍽️ Mesa' : order.orderType === 'delivery' ? '🚗 Entrega' : '🛍️ Balcão'}
                                {order.orderType === 'dine_in' && order.tableNumber && ` #${order.tableNumber}`}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-green-600 text-white px-6 py-4 flex items-center gap-3">
                  <CheckIcon />
                  <div>
                    <h2 className="text-2xl font-bold">Prontos</h2>
                    <p className="text-green-100 text-sm">{readyOrders.length} pedido{readyOrders.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tempo Total</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {readyOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            <p className="text-lg">Nenhum pedido pronto</p>
                          </td>
                        </tr>
                      ) : (
                        readyOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-green-50 transition-colors bg-green-50">
                            <td className="px-6 py-4">
                              <span className="text-2xl font-bold text-green-600">{order.orderNumber}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <UserIcon />
                                <span className="text-sm text-gray-900">{order.customerName || '-'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <ClockIcon />
                                <span>{getElapsedTime(order.createdAt)}m</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {order.orderType === 'dine_in' ? '🍽️ Mesa' : order.orderType === 'delivery' ? '🚗 Entrega' : '🛍️ Balcão'}
                                {order.orderType === 'dine_in' && order.tableNumber && ` #${order.tableNumber}`}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => setAutoRefresh(!autoRefresh)}>
                <RefreshIcon />
                {autoRefresh ? 'Pausar' : 'Retomar'} atualização
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
