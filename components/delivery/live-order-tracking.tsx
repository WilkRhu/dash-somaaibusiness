'use client';

import { useState, useEffect } from 'react';
import { useOrderTracking } from '@/lib/hooks/use-delivery-websocket';
import { deliveryService } from '@/lib/api/delivery';
import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';

interface LiveOrderTrackingProps {
  establishmentId: string;
  orderId: string;
  onClose: () => void;
}

const statusLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'Pendente',
  [DeliveryStatus.CONFIRMED]: 'Confirmado',
  [DeliveryStatus.PREPARING]: 'Preparando',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'Pronto para Entrega',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
  [DeliveryStatus.DELIVERED]: 'Entregue',
  [DeliveryStatus.CANCELLED]: 'Cancelado',
  [DeliveryStatus.FAILED]: 'Falhou',
};

function getProgressPercentage(status: DeliveryStatus): number {
  const statusMap: Record<DeliveryStatus, number> = {
    [DeliveryStatus.PENDING]: 10,
    [DeliveryStatus.CONFIRMED]: 25,
    [DeliveryStatus.PREPARING]: 50,
    [DeliveryStatus.READY_FOR_DELIVERY]: 65,
    [DeliveryStatus.OUT_FOR_DELIVERY]: 85,
    [DeliveryStatus.DELIVERED]: 100,
    [DeliveryStatus.CANCELLED]: 0,
    [DeliveryStatus.FAILED]: 0,
  };
  return statusMap[status] || 0;
}

export function LiveOrderTracking({ establishmentId, orderId, onClose }: LiveOrderTrackingProps) {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const { status, location } = useOrderTracking(orderId);

  useEffect(() => {
    // Carregar dados iniciais
    deliveryService.getOrder(establishmentId, orderId).then(setOrder);
  }, [establishmentId, orderId]);

  // Atualizar status em tempo real
  useEffect(() => {
    if (status && order) {
      console.log('📦 Status atualizado:', status);
      setOrder({ ...order, status: status.status });
    }
  }, [status]);

  // Atualizar localização em tempo real
  useEffect(() => {
    if (location) {
      console.log('📍 Localização atualizada:', location);
    }
  }, [location]);

  if (!order) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Rastreamento em Tempo Real</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold mb-4">Pedido {order.orderNumber}</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Status Atual</p>
                <p className="text-lg font-semibold">{statusLabels[order.status]}</p>
              </div>
              
              {status && (
                <div className="text-sm text-gray-500">
                  Atualizado há {Math.floor((Date.now() - new Date(status.timestamp).getTime()) / 1000)}s
                </div>
              )}
            </div>

            {/* Barra de Progresso */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {order.status === DeliveryStatus.DELIVERED ? 'Concluído' : 'Em andamento'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {getProgressPercentage(order.status)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${getProgressPercentage(order.status)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Cliente</h4>
            <p className="text-gray-700">{order.customerName}</p>
            <p className="text-gray-600 text-sm">{order.customerPhone}</p>
            <p className="text-gray-600 text-sm mt-2">{order.deliveryAddress}</p>
            <p className="text-gray-600 text-sm">{order.deliveryNeighborhood}, {order.deliveryCity}</p>
          </div>

          {/* Valores */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Valores</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de Entrega:</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Localização do Entregador */}
          {location && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Localização do Entregador
              </h4>
              <p className="text-sm text-gray-600">
                Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Atualizado: {new Date(location.timestamp).toLocaleTimeString('pt-BR')}
              </p>
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Para visualizar no mapa, instale react-leaflet
              </p>
            </div>
          )}

          {/* Motorista */}
          {order.driver && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Motorista</h4>
              <p className="text-gray-700">{order.driver.name}</p>
              <p className="text-gray-600 text-sm">{order.driver.phone}</p>
              <p className="text-gray-600 text-sm">Veículo: {order.driver.vehicleType}</p>
            </div>
          )}

          {/* Timeline */}
          {order.tracking && order.tracking.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold mb-4">Histórico</h4>
              <div className="space-y-4">
                {order.tracking.map((track, index) => (
                  <div key={track.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                        }`}
                      />
                      {index < order.tracking!.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{track.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(track.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
