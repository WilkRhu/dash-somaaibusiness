import { useEffect, useRef, useState } from 'react';
import { deliveryWebSocket } from '../services/delivery-websocket';

export function useDeliveryWebSocket(token: string) {
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current && token) {
      deliveryWebSocket.connect(token);
      isConnected.current = true;
    }

    return () => {
      if (isConnected.current) {
        deliveryWebSocket.disconnect();
        isConnected.current = false;
      }
    };
  }, [token]);

  return deliveryWebSocket;
}

// Hook específico para rastreamento de pedido
export function useOrderTracking(orderId: string) {
  const [status, setStatus] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    // Inscrever no pedido
    deliveryWebSocket.subscribeToOrder(orderId);

    // Ouvir atualizações de status
    const unsubStatus = deliveryWebSocket.on('status:update', (data) => {
      if (data.orderId === orderId) {
        setStatus(data);
      }
    });

    // Ouvir atualizações de localização
    const unsubLocation = deliveryWebSocket.on('location:update', (data) => {
      if (data.orderId === orderId) {
        setLocation(data);
      }
    });

    return () => {
      deliveryWebSocket.unsubscribeFromOrder(orderId);
      unsubStatus();
      unsubLocation();
    };
  }, [orderId]);

  return { status, location };
}

// Hook para estabelecimento receber novos pedidos
export function useNewOrders(establishmentId: string, onNewOrder: (order: any) => void) {
  useEffect(() => {
    deliveryWebSocket.subscribeToEstablishment(establishmentId);

    const unsubscribe = deliveryWebSocket.on('order:new', (data) => {
      onNewOrder(data);
      // Tocar som de notificação (opcional)
      if (typeof Audio !== 'undefined') {
        try {
          new Audio('/notification.mp3').play().catch(() => {
            // Ignorar erro se o áudio não puder ser reproduzido
          });
        } catch (e) {
          // Ignorar erro
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [establishmentId, onNewOrder]);
}
