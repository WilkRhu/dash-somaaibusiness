'use client';

import { useState, DragEvent, useRef } from 'react';
import { KitchenOrder, KitchenOrderStatus, OrderType } from '@/lib/types/kitchen-order';
import KitchenOrderCard from './kitchen-order-card';
import OrderStatusHistoryModal from './order-status-history-modal';

interface KitchenOrderCardWithHistoryProps {
  order: KitchenOrder;
  onSelect: () => void;
  isDraggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  isUpdating?: boolean;
  showHistoryButton?: boolean;
}

export default function KitchenOrderCardWithHistory({
  order,
  onSelect,
  isDraggable = false,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isUpdating = false,
  showHistoryButton = true,
}: KitchenOrderCardWithHistoryProps) {
  const [showHistory, setShowHistory] = useState(false);

  const handleHistoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHistory(true);
  };

  return (
    <>
      <div className="relative group">
        <KitchenOrderCard
          order={order}
          onSelect={onSelect}
          isDraggable={isDraggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDragging={isDragging}
          isUpdating={isUpdating}
        />
        
        {showHistoryButton && (
          <button
            onClick={handleHistoryClick}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
            title="Ver histórico de mudanças"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>

      <OrderStatusHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        orderId={order.id}
        orderNumber={order.orderNumber}
      />
    </>
  );
}
