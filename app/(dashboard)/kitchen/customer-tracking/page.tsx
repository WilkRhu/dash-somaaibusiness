'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useKitchenOrdersStore } from '@/lib/stores/kitchen-orders-store';
import { useKitchenSocket } from '@/lib/hooks/use-kitchen-socket';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';
import { KitchenOrderStatus, KitchenOrder } from '@/lib/types/kitchen-order';

const CheckIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
const ClockIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const UserIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const TrendingUpIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
const RefreshIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>);
const TableIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);

function getStatusColor(s: KitchenOrderStatus): string {
  if (s === KitchenOrderStatus.READY) return 'bg-green-100 text-green-800';
  if (s === KitchenOrderStatus.PREPARING) return 'bg-blue-100 text-blue-800';
  if (s === KitchenOrderStatus.CONFIRMED) return 'bg-yellow-100 text-yellow-800';
  if (s === KitchenOrderStatus.PENDING) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

function getStatusLabel(s: KitchenOrderStatus): string {
  if (s === KitchenOrderStatus.READY) return 'PRONTO';
  if (s === KitchenOrderStatus.PREPARING) return 'PREPARANDO';
  if (s === KitchenOrderStatus.CONFIRMED) return 'CONFIRMADO';
  if (s === KitchenOrderStatus.PENDING) return 'RECEBIDO';
  if (s === KitchenOrderStatus.PICKED_UP) return 'RETIRADO';
  return 'CANCELADO';
}

function getOrderType(o: KitchenOrder): string {
  if (o.orderType === 'dine_in') return `Mesa${o.tableNumber ? ` #${o.tableNumber}` : ''}`;
  if (o.orderType === 'delivery') return 'Entrega';
  return 'Balcao';
}


export default function CustomerTrackingPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();
  const { todayOrders, fetchOrders } = useKitchenOrdersStore();
  useKitchenSocket(currentEstablishment?.id);

  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [alertOrder, setAlertOrder] = useState<KitchenOrder | null>(null);
  const previousReadyRef = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);
  const fullscreenControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canAccess =
    isKitchenEstablishment(currentEstablishment?.type) ||
    currentEstablishment?.roles?.some((r: any) =>
      ['kitchen_cook', 'kitchen_manager', 'business_owner', 'business_admin'].includes(r)
    );

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
      if (!canAccess && currentEstablishment) router.push('/home');
    }, 500);
    return () => clearTimeout(t);
  }, [canAccess, currentEstablishment, router]);

  useEffect(() => {
    if (currentEstablishment?.id) fetchOrders(currentEstablishment.id);
  }, [currentEstablishment?.id]);

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isNowFullscreen);
      setShowFullscreenControls(true);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setShowFullscreenControls(true);
      if (fullscreenControlsTimerRef.current) {
        clearTimeout(fullscreenControlsTimerRef.current);
        fullscreenControlsTimerRef.current = null;
      }
      return;
    }

    const startHideTimer = () => {
      setShowFullscreenControls(true);
      if (fullscreenControlsTimerRef.current) clearTimeout(fullscreenControlsTimerRef.current);
      fullscreenControlsTimerRef.current = setTimeout(() => {
        setShowFullscreenControls(false);
      }, 5000);
    };

    startHideTimer();
    window.addEventListener('mousemove', startHideTimer);
    window.addEventListener('keydown', startHideTimer);
    window.addEventListener('touchstart', startHideTimer);

    return () => {
      window.removeEventListener('mousemove', startHideTimer);
      window.removeEventListener('keydown', startHideTimer);
      window.removeEventListener('touchstart', startHideTimer);
      if (fullscreenControlsTimerRef.current) {
        clearTimeout(fullscreenControlsTimerRef.current);
        fullscreenControlsTimerRef.current = null;
      }
    };
  }, [isFullscreen]);

  useEffect(() => {
    const readyIds = todayOrders.filter((o) => o.status === KitchenOrderStatus.READY).map((o) => o.id);
    const newReady = readyIds.filter((id) => !previousReadyRef.current.includes(id));
    if (newReady.length > 0) {
      const order = todayOrders.find((o) => o.id === newReady[0]);
      if (order) {
        setAlertOrder(order);
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
        } catch {}
        setTimeout(() => setAlertOrder(null), 5000);
      }
    }
    previousReadyRef.current = readyIds;
  }, [todayOrders]);

  const toggleFullscreen = async () => {
    if (typeof document === 'undefined') return;

    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const activeOrders = todayOrders
    .filter(
      (o) =>
        o.status !== KitchenOrderStatus.PICKED_UP &&
        o.status !== KitchenOrderStatus.CANCELLED &&
        o.status !== ('cancelled' as any) &&
        o.status !== ('completed' as any) &&
        !o.isPaid
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const readyOrders = todayOrders
    .filter(
      (o) =>
        o.status === KitchenOrderStatus.READY &&
        !o.isPaid &&
        o.status !== ('completed' as any) &&
        o.status !== KitchenOrderStatus.CANCELLED &&
        o.status !== ('cancelled' as any)
    )
    .sort((a, b) =>
      new Date(b.readyAt || b.updatedAt || b.createdAt).getTime() -
      new Date(a.readyAt || a.updatedAt || a.createdAt).getTime()
    )
    .slice(0, 5);

  const elapsed = (createdAt: string) => {    const ms = now - new Date(createdAt).getTime();
    return isNaN(ms) ? 0 : Math.max(0, Math.floor(ms / 60000));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      ref={fullscreenRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50 h-screen overflow-y-auto bg-white p-6 md:p-8' : 'p-6'}`}
    >
      {alertOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-bounce text-center">
            <div className="text-7xl mb-4">✅</div>
            <h2 className="text-3xl font-black text-green-600 mb-2">PEDIDO PRONTO!</h2>
            <p className="text-5xl font-black text-gray-900 mb-4">{alertOrder.orderNumber}</p>
            <div className="flex items-center justify-center gap-2 text-xl text-gray-700 mb-2">
              <UserIcon /><span>{alertOrder.customerName || 'Nao informado'}</span>
            </div>
            <p className="text-lg text-gray-600">Pode retirar no balcao</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <TableIcon />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Painel de Pedidos</h1>
            <p className="text-gray-600 text-sm mt-1">Acompanhamento em tempo real</p>
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-700 ${
            isFullscreen && !showFullscreenControls ? 'pointer-events-none opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:col-span-8">
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nº Comanda</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tempo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum pedido em andamento</td></tr>
                ) : activeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-3xl font-black tracking-tight text-blue-600">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><UserIcon /><span className="text-sm">{order.customerName || '-'}</span></div></td>
                    <td className="px-4 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status as KitchenOrderStatus)}`}>{getStatusLabel(order.status as KitchenOrderStatus)}</span></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-1 text-sm font-semibold"><ClockIcon />{elapsed(order.createdAt)}m</div></td>
                    <td className="px-4 py-4"><span className="text-sm text-gray-600">{getOrderType(order)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:col-span-4">
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nº Comanda</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tempo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {readyOrders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhum pedido pronto</td></tr>
                ) : readyOrders.map((order) => (
                  <tr key={order.id} className="bg-green-50 hover:bg-green-100 transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-3xl font-black tracking-tight text-green-600">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><UserIcon /><span className="text-sm">{order.customerName || '-'}</span></div></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-1 text-sm font-semibold"><ClockIcon />{elapsed(order.createdAt)}m</div></td>
                    <td className="px-4 py-4"><span className="text-sm text-gray-600">{getOrderType(order)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={`mt-8 flex justify-center transition-all duration-300 ${
          isFullscreen && !showFullscreenControls ? 'pointer-events-none opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          onClick={() => currentEstablishment?.id && fetchOrders(currentEstablishment.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
        >
          <RefreshIcon />
          Atualizar agora
        </button>
      </div>
    </div>
  );
}
