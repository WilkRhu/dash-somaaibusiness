'use client';

import { useState, useEffect, useRef, DragEvent } from 'react';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { showToast } from '@/components/ui/toast';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { BusinessRole } from '@/lib/types/establishment';
import KitchenOrderCard from '@/components/kitchen/kitchen-order-card';
import UpdateKitchenOrderStatusModal from '@/components/kitchen/update-kitchen-order-status-modal';
import NewKitchenOrderToast from '@/components/kitchen/new-order-toast';
import { playNotificationSound } from '@/lib/utils/notification-sound';

// Transições de status permitidas (mesma lógica do modal)
const statusTransitions: Record<KitchenOrderStatus, KitchenOrderStatus[]> = {
  [KitchenOrderStatus.PENDING]: [KitchenOrderStatus.CONFIRMED, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.CONFIRMED]: [KitchenOrderStatus.PREPARING, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.PREPARING]: [KitchenOrderStatus.READY, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.READY]: [KitchenOrderStatus.PICKED_UP, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.PICKED_UP]: [],
  [KitchenOrderStatus.CANCELLED]: [],
};

// Colunas visíveis no display
const DISPLAY_COLUMNS = [
  {
    status: KitchenOrderStatus.PENDING,
    label: 'Novo',
    subtitle: 'Aguardando confirmação',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50',
    badgeColor: 'bg-red-600',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
    subtitleColor: 'text-red-700',
    emptyColor: 'text-red-300',
    emptyTextColor: 'text-red-600',
    dropHighlight: 'border-red-500 bg-red-100 ring-4 ring-red-300',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    status: KitchenOrderStatus.CONFIRMED,
    label: 'Confirmado',
    subtitle: 'Pronto para preparar',
    borderColor: 'border-yellow-200',
    bgColor: 'bg-yellow-50',
    badgeColor: 'bg-yellow-600',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900',
    subtitleColor: 'text-yellow-700',
    emptyColor: 'text-yellow-300',
    emptyTextColor: 'text-yellow-600',
    dropHighlight: 'border-yellow-500 bg-yellow-100 ring-4 ring-yellow-300',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    status: KitchenOrderStatus.PREPARING,
    label: 'Preparando',
    subtitle: 'Em andamento',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    badgeColor: 'bg-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
    subtitleColor: 'text-blue-700',
    emptyColor: 'text-blue-300',
    emptyTextColor: 'text-blue-600',
    dropHighlight: 'border-blue-500 bg-blue-100 ring-4 ring-blue-300',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    status: KitchenOrderStatus.READY,
    label: 'Pronto',
    subtitle: 'Aguardando retirada',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    badgeColor: 'bg-green-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
    subtitleColor: 'text-green-700',
    emptyColor: 'text-green-300',
    emptyTextColor: 'text-green-600',
    dropHighlight: 'border-green-500 bg-green-100 ring-4 ring-green-300',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
  },
] as const;

export default function KitchenDisplayPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const { user } = useAuthStore();
  const userRoles = currentEstablishment?.roles || [];
  const userRole = currentEstablishment?.role;
  const isOwner = userRole === BusinessRole.OWNER ||
    userRoles.includes(BusinessRole.OWNER) ||
    user?.role === 'super_admin';

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [draggedOrderStatus, setDraggedOrderStatus] = useState<KitchenOrderStatus | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KitchenOrderStatus | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  // Optimistic updates: estado local que sobrescreve o status dos pedidos
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, KitchenOrderStatus>>({});
  const [newOrdersList, setNewOrdersList] = useState<any[]>([]);
  const didDragRef = useRef(false);
  const previousOrdersRef = useRef<string[]>([]);
  const dismissedOrderIdsRef = useRef<Set<string>>(new Set());

  const { orders: rawOrders, isLoading, refetch, updateStatus } = useKitchenOrders({
    status: undefined,
    limit: 100,
  });

  // Aplicar optimistic updates nos pedidos
  const orders = rawOrders.map((order) => {
    if (optimisticUpdates[order.id]) {
      return { ...order, status: optimisticUpdates[order.id] };
    }
    return order;
  });

  // Auto-refresh a cada 3 segundos (pausa durante drag)
  useEffect(() => {
    if (!autoRefresh || draggedOrderId) return;
    const interval = setInterval(() => { refetch(); }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch, draggedOrderId]);

  // Tocar som e mostrar toast quando chegar novo pedido
  const isFirstLoadRef = useRef(true);
  
  useEffect(() => {
    const activeOrders = orders.filter(
      (o) => o.status !== KitchenOrderStatus.PICKED_UP && o.status !== KitchenOrderStatus.CANCELLED
    );
    const currentOrderIds = activeOrders.map((o) => o.id);

    // Limpar pedidos dispensados que já saíram de PENDING (mudaram de status)
    const currentPendingIds = new Set(
      activeOrders.filter((o) => o.status === KitchenOrderStatus.PENDING).map((o) => o.id)
    );
    dismissedOrderIdsRef.current.forEach((id) => {
      if (!currentPendingIds.has(id)) dismissedOrderIdsRef.current.delete(id);
    });
    
    // Filtrar pedidos PENDING que NÃO foram dispensados
    const undismissedPending = activeOrders.filter(
      (o) => o.status === KitchenOrderStatus.PENDING && !dismissedOrderIdsRef.current.has(o.id)
    );

    if (!isOwner) {
      if (isFirstLoadRef.current && activeOrders.length > 0) {
        isFirstLoadRef.current = false;
        if (undismissedPending.length > 0) {
          setNewOrdersList(undismissedPending);
          if (soundEnabled) playNotificationSound();
        }
      } else if (previousOrdersRef.current.length > 0) {
        // Detectar pedidos novos que não existiam antes E não foram dispensados
        const newOrders = undismissedPending.filter(
          (o) => !previousOrdersRef.current.includes(o.id)
        );
        if (newOrders.length > 0) {
          setNewOrdersList(newOrders);
          if (soundEnabled) playNotificationSound();
        }
      }
    } else {
      isFirstLoadRef.current = false;
    }
    
    previousOrdersRef.current = currentOrderIds;
  }, [orders, soundEnabled]);

  // Agrupar pedidos por status
  const ordersByStatus: Record<KitchenOrderStatus, typeof orders> = {
    [KitchenOrderStatus.PENDING]: orders.filter((o) => o.status === KitchenOrderStatus.PENDING),
    [KitchenOrderStatus.CONFIRMED]: orders.filter((o) => o.status === KitchenOrderStatus.CONFIRMED),
    [KitchenOrderStatus.PREPARING]: orders.filter((o) => o.status === KitchenOrderStatus.PREPARING),
    [KitchenOrderStatus.READY]: orders.filter((o) => o.status === KitchenOrderStatus.READY),
    [KitchenOrderStatus.PICKED_UP]: orders.filter((o) => o.status === KitchenOrderStatus.PICKED_UP),
    [KitchenOrderStatus.CANCELLED]: orders.filter((o) => o.status === KitchenOrderStatus.CANCELLED),
  };

  // --- Drag and Drop handlers ---

  const canDropOnColumn = (targetStatus: KitchenOrderStatus): boolean => {
    if (!draggedOrderStatus) return false;
    if (draggedOrderStatus === targetStatus) return false;
    return statusTransitions[draggedOrderStatus].includes(targetStatus);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, orderId: string, orderStatus: KitchenOrderStatus) => {
    didDragRef.current = true;
    setDraggedOrderId(orderId);
    setDraggedOrderStatus(orderStatus);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggedOrderId(null);
    setDraggedOrderStatus(null);
    setDragOverColumn(null);
    // Mantém didDragRef true para bloquear o click que vem logo após o dragEnd
    setTimeout(() => { didDragRef.current = false; }, 0);
  };

  const handleCardClick = (order: any) => {
    // Só abre o modal se NÃO foi um drag
    if (didDragRef.current) return;
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnStatus: KitchenOrderStatus) => {
    e.preventDefault();
    if (canDropOnColumn(columnStatus)) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumn(columnStatus);
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Só limpa se saiu da coluna de verdade (não de um filho)
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetStatus: KitchenOrderStatus) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(null);

    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId || !canDropOnColumn(targetStatus)) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const previousStatus = order.status;
    const statusLabel = DISPLAY_COLUMNS.find((c) => c.status === targetStatus)?.label || targetStatus;

    // 1. Optimistic update: mover o card imediatamente na UI
    setOptimisticUpdates((prev) => ({ ...prev, [orderId]: targetStatus }));
    setUpdatingOrderId(orderId);

    try {
      // 2. Chamar a API
      await updateStatus(orderId, { status: targetStatus });
      showToast(`Pedido #${order.orderNumber} → ${statusLabel}`, 'success');

      // 3. Limpar optimistic update (o hook já atualizou o state)
      setOptimisticUpdates((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    } catch (error: any) {
      // 4. Reverter optimistic update em caso de erro
      setOptimisticUpdates((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      showToast(error.message || 'Erro ao atualizar status', 'error');
      console.error('Erro no drag-drop:', error);
    } finally {
      setUpdatingOrderId(null);
      setDraggedOrderId(null);
      setDraggedOrderStatus(null);
    }
  };

  const handleStatusUpdate = async (newStatus: KitchenOrderStatus) => {
    // O modal já faz o updateStatus internamente, só precisamos fechar e atualizar
    setShowUpdateModal(false);
    setSelectedOrder(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-white p-6">

      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Kitchen Display</h1>
              <p className="text-gray-600 text-sm">Arraste os pedidos entre colunas para mudar o status</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-lg transition-all ${
              soundEnabled
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={soundEnabled ? 'Som ativado' : 'Som desativado'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {soundEnabled ? (
                <path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.72l-5.24 3.102A1 1 0 005 7.25v9.5a1 1 0 00.53.882l5.24 3.102c1.114.536 2.73-.384 2.73-1.72V4.06zM15.5 12a3.5 3.5 0 015.905 2.75H15.5V12z" />
              ) : (
                <path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.72l-5.24 3.102A1 1 0 005 7.25v9.5a1 1 0 00.53.882l5.24 3.102c1.114.536 2.73-.384 2.73-1.72V4.06z" />
              )}
            </svg>
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-3 rounded-lg transition-all ${
              autoRefresh
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={autoRefresh ? 'Auto-atualização ativa' : 'Auto-atualização inativa'}
          >
            <svg className={`w-5 h-5 transition-transform ${autoRefresh ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={() => refetch()}
            className="p-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all"
            title="Atualizar agora"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid de Status com Drag and Drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DISPLAY_COLUMNS.map((column) => {
          const columnOrders = ordersByStatus[column.status];
          const isValidDrop = draggedOrderId !== null && canDropOnColumn(column.status);
          const isDragOver = dragOverColumn === column.status;

          return (
            <div
              key={column.status}
              onDragOver={(e) => handleDragOver(e, column.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.status)}
              className={`rounded-xl border-2 p-6 shadow-md transition-all duration-200 ${
                isDragOver && isValidDrop
                  ? column.dropHighlight
                  : isValidDrop
                    ? `${column.borderColor} ${column.bgColor} border-dashed opacity-90 scale-[1.02]`
                    : draggedOrderId && !isValidDrop && draggedOrderStatus !== column.status
                      ? `${column.borderColor} bg-gray-100 opacity-50`
                      : `${column.borderColor} ${column.bgColor}`
              }`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${column.iconBg} rounded-lg`}>
                    <svg className={`w-6 h-6 ${column.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {column.icon}
                    </svg>
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${column.textColor}`}>{column.label}</h2>
                    <p className={`text-xs ${column.subtitleColor}`}>{column.subtitle}</p>
                  </div>
                </div>
                <span className={`${column.badgeColor} text-white px-4 py-2 rounded-full font-bold text-2xl shadow-lg`}>
                  {columnOrders.length}
                </span>
              </div>

              {/* Drop zone indicator */}
              {isDragOver && isValidDrop && (
                <div className="mb-3 p-3 border-2 border-dashed border-current rounded-lg text-center text-sm font-semibold animate-pulse">
                  Solte aqui para mover
                </div>
              )}

              {/* Orders */}
              <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                {columnOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className={`w-12 h-12 ${column.emptyColor} mx-auto mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`${column.emptyTextColor} text-sm`}>Nenhum pedido</p>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onSelect={() => handleCardClick(order)}
                      isDraggable
                      onDragStart={(e) => handleDragStart(e, order.id, order.status)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedOrderId === order.id}
                      isUpdating={updatingOrderId === order.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast de Novo Pedido */}
      <NewKitchenOrderToast
        orders={newOrdersList}
        onDismiss={() => {
          newOrdersList.forEach((o) => dismissedOrderIdsRef.current.add(o.id));
          setNewOrdersList([]);
        }}
        onViewOrder={(order) => {
          newOrdersList.forEach((o) => dismissedOrderIdsRef.current.add(o.id));
          setSelectedOrder(order);
          setShowUpdateModal(true);
          setNewOrdersList([]);
        }}
      />

      {/* Modal de Atualização (clique no card) */}
      {showUpdateModal && selectedOrder && (
        <UpdateKitchenOrderStatusModal
          order={selectedOrder}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
