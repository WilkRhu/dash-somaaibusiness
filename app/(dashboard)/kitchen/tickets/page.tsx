'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { useKitchenSocket } from '@/lib/hooks/use-kitchen-socket';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';
import { KitchenOrderStatus } from '@/lib/types/kitchen-order';

export default function KitchenTicketsPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const isKitchenTypeEstablishment = isKitchenEstablishment(currentEstablishment?.type);

  useEffect(() => {
    if (!isKitchenTypeEstablishment) {
      router.push('/home');
    }
  }, [isKitchenTypeEstablishment, router]);

  const { orders, refetch } = useKitchenOrders({ limit: 100 });
  useKitchenSocket(currentEstablishment?.id);

  // WebSocket mantém atualizado — polling removido
  useEffect(() => {
    if (!autoRefresh) return;
    const clock = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(clock);
  }, [autoRefresh]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== KitchenOrderStatus.PICKED_UP && o.status !== KitchenOrderStatus.CANCELLED
  );

  const dashboardStats = useMemo(() => {
    const total = activeOrders.length;
    const pending = activeOrders.filter((o) => o.status === KitchenOrderStatus.PENDING).length;
    const preparing = activeOrders.filter((o) => o.status === KitchenOrderStatus.PREPARING).length;
    const ready = activeOrders.filter((o) => o.status === KitchenOrderStatus.READY).length;
    const urgent = activeOrders.filter((o) => o.priority === 'high').length;
    const oldestMinutes =
      activeOrders.length > 0
        ? Math.max(...activeOrders.map((order) => Math.floor((now - new Date(order.createdAt).getTime()) / 60000)))
        : 0;

    return { total, pending, preparing, ready, urgent, oldestMinutes };
  }, [activeOrders, now]);

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

  const getStatusMessage = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.READY:
        return 'Seu pedido está pronto para retirada.';
      case KitchenOrderStatus.PREPARING:
        return 'Estamos preparando seu pedido.';
      case KitchenOrderStatus.CONFIRMED:
        return 'Pedido confirmado, aguardando preparo.';
      case KitchenOrderStatus.PENDING:
        return 'Pedido recebido, em breve entra na fila.';
      default:
        return 'Pedido ativo.';
    }
  };

  const getStatusIcon = (status: KitchenOrderStatus) => {
    const iconClass = 'w-8 h-8';
    switch (status) {
      case KitchenOrderStatus.PENDING:
        return (
          <svg className={`${iconClass} text-red-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case KitchenOrderStatus.CONFIRMED:
        return (
          <svg className={`${iconClass} text-yellow-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case KitchenOrderStatus.PREPARING:
        return (
          <svg className={`${iconClass} text-sky-300 animate-pulse`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case KitchenOrderStatus.READY:
        return (
          <svg className={`${iconClass} text-emerald-300 animate-bounce`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-white/60`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: KitchenOrderStatus) => {
    const colors: Record<KitchenOrderStatus, string> = {
      [KitchenOrderStatus.PENDING]: 'bg-gradient-to-br from-red-600 to-red-700 border-red-500/40',
      [KitchenOrderStatus.CONFIRMED]: 'bg-gradient-to-br from-yellow-600 to-amber-700 border-yellow-500/40',
      [KitchenOrderStatus.PREPARING]: 'bg-gradient-to-br from-blue-600 to-cyan-700 border-blue-500/40',
      [KitchenOrderStatus.READY]: 'bg-gradient-to-br from-green-600 to-emerald-700 border-green-500/40',
      [KitchenOrderStatus.PICKED_UP]: 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500/40',
      [KitchenOrderStatus.CANCELLED]: 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500/40',
    };
    return colors[status] || 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500/40';
  };

  const getTypeLabel = (orderType: string) => {
    const labels: Record<string, string> = { counter: 'Balcão', dine_in: 'Mesa', delivery: 'Entrega' };
    return labels[orderType] || orderType;
  };

  const getPriorityLabel = (priority: 'low' | 'normal' | 'high') => {
    const labels = { low: 'Baixa', normal: 'Normal', high: 'Alta' };
    return labels[priority];
  };

  const formatTime = (isoDate: string) =>
    new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const toggleFullscreen = async () => {
    if (typeof document === 'undefined') return;

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const getProgressIndex = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.PENDING:
        return 0;
      case KitchenOrderStatus.CONFIRMED:
        return 1;
      case KitchenOrderStatus.PREPARING:
        return 2;
      case KitchenOrderStatus.READY:
        return 3;
      default:
        return 0;
    }
  };

  const getProgressLabel = (status: KitchenOrderStatus) => {
    switch (status) {
      case KitchenOrderStatus.PENDING:
        return 'Recebido';
      case KitchenOrderStatus.CONFIRMED:
        return 'Confirmado';
      case KitchenOrderStatus.PREPARING:
        return 'Preparando';
      case KitchenOrderStatus.READY:
        return 'Pronto';
      default:
        return 'Ativo';
    }
  };

  const selectedOrder = activeOrders.find((o) => o.orderNumber === selectedOrderNumber) || activeOrders[0] || null;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 h-screen overflow-hidden' : 'min-h-screen'} bg-white p-4 md:p-6 text-slate-900`}>
      <div className={`mx-auto max-w-[1800px] space-y-6 ${isFullscreen ? 'h-full' : ''}`}>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-stone-600 p-4 shadow-xl shadow-black/30">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">Acompanhamento</h1>
                  <p className="text-slate-600 text-sm md:text-base mt-1">Painel público para o cliente acompanhar o pedido em tempo real</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Atualiza a cada 2 segundos</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Formato ideal para TV e balcão</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Mostra status, mesa, horário e itens</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4H4m0 0v5m0-5l6 6M15 15v5h5m0 0v-5m0 5l-6-6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M4 4l6 6m10 6v4h-4m4 0l-6-6" />
                  )}
                </svg>
                {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              </button>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-semibold transition-all ${
                  autoRefresh
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <svg className={`w-5 h-5 transition-transform ${autoRefresh ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {autoRefresh ? 'Atualização ativa' : 'Atualização pausada'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            { label: 'Ativos', value: dashboardStats.total, accent: 'from-stone-500 to-stone-700' },
            { label: 'Novos', value: dashboardStats.pending, accent: 'from-red-500 to-rose-600' },
            { label: 'Preparando', value: dashboardStats.preparing, accent: 'from-amber-500 to-orange-600' },
            { label: 'Prontos', value: dashboardStats.ready, accent: 'from-emerald-500 to-green-600' },
            { label: 'Urgentes', value: dashboardStats.urgent, accent: 'from-fuchsia-500 to-pink-600' },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className={`inline-flex rounded-full bg-gradient-to-r ${card.accent} px-3 py-1 text-xs font-bold uppercase tracking-wider text-white`}>
                {card.label}
              </div>
              <div className="mt-3 text-4xl font-black text-slate-900">{card.value}</div>
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr] ${isFullscreen ? 'h-[calc(100vh-18rem)]' : ''}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Fila de pedidos</h2>
                <p className="text-sm text-slate-600">Clique em um pedido para destacar o andamento dele.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {activeOrders.length} ativos
              </div>
            </div>

            <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${isFullscreen ? 'xl:grid-cols-3 overflow-y-auto pr-1' : ''}`}>
              {activeOrders.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center shadow-sm">
                  <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-900 text-2xl font-semibold">Nenhum pedido em andamento</p>
                  <p className="text-slate-500 mt-2">Assim que um pedido entrar na fila, ele aparece aqui.</p>
                </div>
              ) : (
                activeOrders.map((order) => {
                  const isSelected = selectedOrder?.orderNumber === order.orderNumber;
                  const progressIndex = getProgressIndex(order.status);

                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderNumber(order.orderNumber)}
                      className={`relative overflow-hidden rounded-3xl border-2 p-5 text-left transition-all hover:-translate-y-1 cursor-pointer ${
                        isSelected ? 'ring-4 ring-slate-300 shadow-2xl shadow-slate-200' : 'shadow-lg shadow-slate-200'
                      } ${getStatusColor(order.status)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
                            {getTypeLabel(order.orderType)}
                          </div>
                          <div className="mt-2 text-6xl font-black leading-none text-white">{order.orderNumber}</div>
                          <div className="mt-3 text-sm font-semibold text-white/85">
                            {order.customerName || 'Cliente não informado'}
                            {order.orderType === 'dine_in' && order.tableNumber ? ` • Mesa ${order.tableNumber}` : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                            {getPriorityLabel(order.priority)}
                          </div>
                          <div className="mt-3 flex justify-end">{getStatusIcon(order.status)}</div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-lg font-black text-white">{getProgressLabel(order.status)}</div>
                          <div className="text-sm font-medium text-white/85">{getStatusMessage(order.status)}</div>
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-2">
                          {['Recebido', 'Confirmado', 'Preparando', 'Pronto'].map((step, index) => {
                            const done = index <= progressIndex;
                            const current = index === progressIndex;

                            return (
                              <div key={step} className="flex flex-col items-center gap-2">
                                <div
                                  className={`h-3 w-full rounded-full transition-all ${
                                    done ? 'bg-white' : 'bg-white/25'
                                  } ${current ? 'ring-4 ring-white/30' : ''}`}
                                />
                                <div className={`text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${done ? 'text-white' : 'text-white/60'}`}>
                                  {step}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-white">
                        <div className="rounded-2xl bg-black/15 p-3">
                          <div className="text-white/75">Itens</div>
                          <div className="mt-1 font-semibold">{order.items.length}</div>
                        </div>
                        <div className="rounded-2xl bg-black/15 p-3">
                          <div className="text-white/75">Criado</div>
                          <div className="mt-1 font-semibold">{formatTime(order.createdAt)}</div>
                        </div>
                        <div className="rounded-2xl bg-black/15 p-3">
                          <div className="text-white/75">Tempo</div>
                          <div className="mt-1 font-semibold">{order.estimatedPrepTime} min</div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Pedido em destaque</h2>
                  <p className="text-sm text-slate-600">Aqui o cliente vê com clareza se está pronto ou não.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {selectedOrder ? `#${selectedOrder.orderNumber}` : 'Sem seleção'}
                </div>
              </div>
            </div>

            {selectedOrder ? (
              <div className="space-y-4">
                <div className={`rounded-3xl border-2 p-6 ${getStatusColor(selectedOrder.status)}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.35em] text-white/80">Status atual</div>
                      <div className="mt-2 text-4xl md:text-5xl font-black text-white">{getStatusLabel(selectedOrder.status)}</div>
                      <div className="mt-2 text-white/90">{getStatusMessage(selectedOrder.status)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm uppercase tracking-[0.35em] text-white/80">Pedido</div>
                      <div className="mt-2 text-[5rem] leading-none font-black text-white">{selectedOrder.orderNumber}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Cliente</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{selectedOrder.customerName || 'Não informado'}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Tipo</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{getTypeLabel(selectedOrder.orderType)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Criado às</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{formatTime(selectedOrder.createdAt)}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimativa</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{selectedOrder.estimatedPrepTime} min</div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Etapas do pedido</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {getProgressLabel(selectedOrder.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {['Recebido', 'Confirmado', 'Preparando', 'Pronto'].map((step, index) => {
                      const activeIndex = getProgressIndex(selectedOrder.status);
                      const done = index <= activeIndex;
                      const current = index === activeIndex;

                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div
                            className={`h-14 w-full rounded-2xl border ${
                              done ? 'border-slate-300 bg-slate-900' : 'border-slate-200 bg-slate-100'
                            } ${current ? 'ring-4 ring-slate-200' : ''}`}
                          />
                          <div className={`text-center text-xs font-semibold uppercase tracking-[0.18em] ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">Itens</h3>
                  <div className="mt-4 space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-semibold text-slate-900">{item.quantity}x {item.productName}</div>
                            {item.notes && <div className="mt-2 text-sm text-slate-600">{item.notes}</div>}
                          </div>
                          <div className="text-right text-sm text-slate-500">
                            {item.preparationTime ? `${item.preparationTime} min` : '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center shadow-sm">
                <p className="text-slate-900 text-2xl font-semibold">Selecione um pedido para acompanhar</p>
                <p className="text-slate-500 mt-2">O painel desta área mostra a etapa atual com mais clareza.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
