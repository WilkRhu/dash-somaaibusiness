'use client';

import { DragEvent, useRef } from 'react';
import { KitchenOrder, KitchenOrderStatus, OrderType } from '@/lib/types/kitchen-order';

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onSelect: () => void;
  isDraggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  isUpdating?: boolean;
}

const OrderTypeIcon = ({ type }: { type: OrderType }) => {
  if (type === OrderType.DINE_IN) return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
  if (type === OrderType.DELIVERY) return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
};

const orderTypeLabels: Record<OrderType, string> = {
  [OrderType.COUNTER]: 'Balcão',
  [OrderType.DINE_IN]: 'Mesa',
  [OrderType.DELIVERY]: 'Entrega',
};

const orderTypeColors: Record<OrderType, string> = {
  [OrderType.COUNTER]: 'bg-blue-50 text-blue-700 border-blue-200',
  [OrderType.DINE_IN]: 'bg-purple-50 text-purple-700 border-purple-200',
  [OrderType.DELIVERY]: 'bg-orange-50 text-orange-700 border-orange-200',
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: 'Alta', color: 'bg-red-50 text-red-700 border-red-200' },
  normal: { label: 'Normal', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  low: { label: 'Baixa', color: 'bg-green-50 text-green-700 border-green-200' },
};

export default function KitchenOrderCard({
  order,
  onSelect,
  isDraggable = false,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isUpdating = false,
}: KitchenOrderCardProps) {
  const wasDragged = useRef(false);

  const getElapsedTime = () => {
    const raw = order.createdAt;
    if (!raw) return 0;
    let created = Number(raw);
    if (isNaN(created) || created === 0) created = new Date(raw).getTime();
    if (isNaN(created) || created === 0) return 0;
    return Math.floor(Math.abs(Date.now() - created) / 60000);
  };

  const elapsedTime = getElapsedTime();
  const estimatedTime = order.estimatedPrepTime || 0;
  const isOvertime = estimatedTime > 0 && elapsedTime > estimatedTime;
  const priority = priorityConfig[order.priority] || priorityConfig.normal;
  const visibleItems = order.items.slice(0, 3);
  const hiddenItemsCount = Math.max(order.items.length - visibleItems.length, 0);

  const handleMouseDown = () => { wasDragged.current = false; };
  const handleDragStartInternal = (e: DragEvent<HTMLDivElement>) => {
    wasDragged.current = true;
    onDragStart?.(e);
  };
  const handleClick = (e: React.MouseEvent) => {
    if (wasDragged.current) { wasDragged.current = false; e.preventDefault(); e.stopPropagation(); return; }
    onSelect();
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStartInternal : undefined}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      onMouseDown={isDraggable ? handleMouseDown : undefined}
      onClick={handleClick}
      className={`w-full rounded-xl border text-left transition-all overflow-hidden ${
        isDragging ? 'opacity-40 scale-95 rotate-1' : ''
      } ${isUpdating ? 'opacity-50 pointer-events-none' : ''} ${
        isDraggable ? 'cursor-default' : 'cursor-pointer'
      } ${
        isOvertime ? 'bg-red-50 border-red-300 shadow-sm shadow-red-100' : 'bg-white border-gray-200 shadow-sm'
      } hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-gray-900 truncate">#{order.orderNumber}</span>
          {order.tableNumber && (
            <span className="text-xs text-gray-500 shrink-0">Mesa {order.tableNumber}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${orderTypeColors[order.orderType]}`}>
            <OrderTypeIcon type={order.orderType} />
            {orderTypeLabels[order.orderType]}
          </span>
          {order.priority === 'high' && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${priority.color}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {priority.label}
            </span>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className={`mx-3 mb-2 px-2 py-1 rounded flex items-center justify-center gap-1.5 text-xs font-semibold ${
        isOvertime ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-600'
      }`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {elapsedTime}min{estimatedTime > 0 ? ` / ${estimatedTime}min` : ''}
        {isOvertime && (
          <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
      </div>

      {/* Items */}
      <div className="px-3 pb-2 space-y-1">
        {visibleItems.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-start justify-between text-xs">
              <span className="font-medium text-gray-800">
                <span className="text-gray-500">{item.quantity}x</span> {item.productName}
              </span>
            </div>
            {item.notes && (
              <div className="mt-0.5 ml-3 px-2 py-1 bg-amber-50 border-l-2 border-amber-400 rounded-r text-[11px] font-medium text-amber-800 flex items-start gap-1">
                <svg className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {item.notes}
              </div>
            )}
          </div>
        ))}
        {hiddenItemsCount > 0 && (
          <div className="text-[11px] font-semibold text-gray-500 px-1 pt-0.5">
            +{hiddenItemsCount} item{hiddenItemsCount > 1 ? 's' : ''} oculto{hiddenItemsCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mx-3 mb-2 px-2 py-1.5 bg-yellow-50 border border-yellow-200 rounded text-[11px] text-gray-700 flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {order.notes}
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-2 flex items-center justify-between">
        {order.customerName ? (
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate max-w-[120px]">{order.customerName}</span>
          </div>
        ) : <div />}
        {isDraggable && (
          <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            arraste
          </div>
        )}
      </div>
    </div>
  );
}
