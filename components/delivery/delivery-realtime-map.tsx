'use client';

import { useEffect, useState } from 'react';
import { DeliveryOrder } from '@/lib/types/delivery';
import { DeliveryLocation } from '@/lib/hooks/use-delivery-realtime';

interface DeliveryRealtimeMapProps {
  deliveryLocations: Record<string, DeliveryLocation>;
  orders: DeliveryOrder[];
  selectedOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
}

export function DeliveryRealtimeMap({
  deliveryLocations,
  orders,
  selectedOrderId,
  onSelectOrder,
}: DeliveryRealtimeMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    // Carregar Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;

    // Inicializar mapa
    const mapElement = document.getElementById('delivery-map');
    if (!mapElement) return;

    const locations = Object.values(deliveryLocations);
    const center = calculateMapCenter(locations);

    const newMap = new (window as any).google.maps.Map(mapElement, {
      zoom: 13,
      center,
      mapTypeId: 'roadmap',
    });

    setMap(newMap);

    // Adicionar marcadores
    locations.forEach((location) => {
      const order = orders.find((o) => o.id === Object.keys(deliveryLocations).find((k) => deliveryLocations[k] === location));
      
      const marker = new (window as any).google.maps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
        map: newMap,
        title: order?.orderNumber || 'Entrega',
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: selectedOrderId === order?.id ? '#ef4444' : '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        onSelectOrder?.(order?.id || '');
      });
    });
  }, [mapLoaded, deliveryLocations, orders, selectedOrderId, onSelectOrder]);

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <div id="delivery-map" className="w-full h-full" />
    </div>
  );
}

function calculateMapCenter(locations: DeliveryLocation[]) {
  if (locations.length === 0) {
    return { lat: -23.5505, lng: -46.6333 }; // São Paulo
  }

  const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
  const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

  return { lat: avgLat, lng: avgLng };
}
