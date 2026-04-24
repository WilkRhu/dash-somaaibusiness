import { useState, useCallback, useEffect } from 'react';
import { DeliveryOrder } from '@/lib/types/delivery';

interface OrderToastState {
  order: DeliveryOrder | null;
  isViewed: boolean;
  viewedAt?: number;
}

export function usePersistentOrderToast() {
  const [toastState, setToastState] = useState<OrderToastState>({
    order: null,
    isViewed: false,
  });

  // Mostrar novo pedido
  const showNewOrder = useCallback((order: DeliveryOrder) => {
    console.log('usePersistentOrderToast - showNewOrder called with:', order);
    setToastState({
      order,
      isViewed: false,
    });

    // Reproduzir som de notificação
    playNotificationSound();
  }, []);

  // Marcar pedido como visualizado
  const markAsViewed = useCallback((orderId: string) => {
    console.log('usePersistentOrderToast - markAsViewed called with:', orderId);
    setToastState((prev) => {
      if (prev.order?.id === orderId) {
        return {
          ...prev,
          isViewed: true,
          viewedAt: Date.now(),
        };
      }
      return prev;
    });
  }, []);

  // Descartar notificação
  const dismiss = useCallback(() => {
    console.log('usePersistentOrderToast - dismiss called');
    setToastState({
      order: null,
      isViewed: false,
    });
  }, []);

  // Auto-dismiss após visualizar (opcional)
  useEffect(() => {
    if (toastState.isViewed) {
      const timer = setTimeout(() => {
        console.log('usePersistentOrderToast - auto-dismissing after view');
        dismiss();
      }, 3000); // Desaparece 3 segundos após visualizar

      return () => clearTimeout(timer);
    }
  }, [toastState.isViewed, dismiss]);

  return {
    order: toastState.order,
    isViewed: toastState.isViewed,
    showNewOrder,
    markAsViewed,
    dismiss,
  };
}

function playNotificationSound() {
  try {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Ignorar erro se o áudio não puder ser reproduzido
    });
  } catch (e) {
    // Ignorar erro
  }
}
