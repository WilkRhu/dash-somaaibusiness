'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { io, Socket } from 'socket.io-client';

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  driverId: string;
  timestamp: Date;
}

export interface DeliveryETA {
  minutes: number;
  estimatedArrivalTime: Date;
  driverId: string;
}

export interface GeofenceAlert {
  orderId: string;
  driverId: string;
  message: string;
  distance: number;
  timestamp: Date;
}

export function useDeliveryRealtime() {
  const { currentEstablishment } = useEstablishmentStore();
  const { user, token } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deliveryLocations, setDeliveryLocations] = useState<Record<string, DeliveryLocation>>({});
  const [etas, setEtas] = useState<Record<string, DeliveryETA>>({});
  const [geofenceAlerts, setGeofenceAlerts] = useState<GeofenceAlert[]>([]);

  // Conectar ao WebSocket
  useEffect(() => {
    if (!currentEstablishment?.id || !token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Dashboard conectado ao servidor');
      setIsConnected(true);
      newSocket.emit('subscribe:establishment', { establishmentId: currentEstablishment.id });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Dashboard desconectado');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
    });

    // Receber localização
    newSocket.on('driver:location', (data) => {
      setDeliveryLocations((prev) => ({
        ...prev,
        [data.orderId]: {
          latitude: data.latitude,
          longitude: data.longitude,
          driverId: data.driverId,
          timestamp: new Date(data.timestamp),
        },
      }));
    });

    // Receber ETA
    newSocket.on('driver:eta', (data) => {
      setEtas((prev) => ({
        ...prev,
        [data.orderId]: {
          minutes: data.etaMinutes,
          estimatedArrivalTime: new Date(data.estimatedArrivalTime),
          driverId: data.driverId,
        },
      }));
    });

    // Receber alerta de geofencing
    newSocket.on('driver:geofence', (data) => {
      const alert: GeofenceAlert = {
        orderId: data.orderId,
        driverId: data.driverId,
        message: data.message,
        distance: data.distance,
        timestamp: new Date(data.timestamp),
      };

      setGeofenceAlerts((prev) => [alert, ...prev]);

      // Remover alerta após 10 segundos
      setTimeout(() => {
        setGeofenceAlerts((prev) => prev.filter((a) => a.orderId !== data.orderId));
      }, 10000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentEstablishment?.id, token]);

  const clearGeofenceAlert = useCallback((orderId: string) => {
    setGeofenceAlerts((prev) => prev.filter((a) => a.orderId !== orderId));
  }, []);

  return {
    socket,
    isConnected,
    deliveryLocations,
    etas,
    geofenceAlerts,
    clearGeofenceAlert,
  };
}
