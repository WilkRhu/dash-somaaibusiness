'use client';

import { useEffect, useState } from 'react';
import { usePublicOrderTracking } from '@/lib/hooks/use-public-delivery';
import { DeliveryStatus } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';

const statusLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'Aguardando confirmação',
  [DeliveryStatus.CONFIRMED]: 'Confirmado',
  [DeliveryStatus.PREPARING]: 'Preparando seu pedido',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'Pronto para entrega',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'Saiu para entrega',
  [DeliveryStatus.DELIVERED]: 'Entregue',
  [DeliveryStatus.CANCELLED]: 'Cancelado',
  [DeliveryStatus.FAILED]: 'Falha na entrega',
};

const statusColors: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [DeliveryStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [DeliveryStatus.PREPARING]: 'bg-purple-100 text-purple-800',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'bg-indigo-100 text-indigo-800',
  [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [DeliveryStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [DeliveryStatus.FAILED]: 'bg-gray-100 text-gray-800',
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

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const { order, tracking, loading, error, refetch } = usePublicOrderTracking(params.orderId);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!autoRefresh || !order || [DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED].includes(order.status)) {
      return;
    }

    const interval = setInterval(() => {
      refetch();
    }, 10000); // Atualizar a cada 10 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, order, refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rastreamento...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pedido não encontrado</h2>
          <p className="text-gray-600 mb-4">{error || 'Não conseguimos encontrar este pedido.'}</p>
          <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Rastreamento do Pedido</h1>
          <p className="text-gray-600 mt-2">Pedido #{order.orderNumber}</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status Atual</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Tempo Estimado</p>
              <p className="text-2xl font-bold text-gray-900">{order.estimatedDeliveryTime} min</p>
            </div>
          </div>

          {/* Progress Bar */}
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
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${getProgressPercentage(order.status)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              />
            </div>
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="autoRefresh" className="text-gray-600">
              Atualizar automaticamente a cada 10 segundos
            </label>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Pedido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="font-semibold text-gray-900">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.customerPhone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Forma de Pagamento</p>
              <p className="font-semibold text-gray-900">
                {order.paymentMethod === 'pix' ? 'PIX' : 
                 order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                 order.paymentMethod === 'debit_card' ? 'Cartão de Débito' :
                 order.paymentMethod === 'cash' ? 'Dinheiro' : 'Transferência'}
              </p>
              <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.isPaid ? '✓ Pago' : '⏳ Pendente'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-1">Endereço de Entrega</p>
            <p className="font-semibold text-gray-900">{order.deliveryAddress}</p>
            <p className="text-sm text-gray-600">
              {order.deliveryNeighborhood}, {order.deliveryCity} - {order.deliveryState}
            </p>
            <p className="text-sm text-gray-600">CEP: {order.deliveryZipCode}</p>
            {order.deliveryComplement && (
              <p className="text-sm text-gray-600">Complemento: {order.deliveryComplement}</p>
            )}
            {order.deliveryReference && (
              <p className="text-sm text-gray-600">Referência: {order.deliveryReference}</p>
            )}
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Valores</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de Entrega:</span>
              <span className="font-semibold">{formatCurrency(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total:</span>
              <span className="text-blue-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Motorista */}
        {order.driver && order.status !== DeliveryStatus.PENDING && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Entregador</h2>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {order.driver.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{order.driver.name}</p>
                <p className="text-sm text-gray-600">{order.driver.phone}</p>
                <p className="text-sm text-gray-600">Veículo: {order.driver.vehicleType}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {tracking.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Histórico</h2>
            
            <div className="space-y-6">
              {tracking.map((track, index) => (
                <div key={track.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                      }`}
                    />
                    {index < tracking.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-300 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-gray-900">{track.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(track.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observações */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Observações</h2>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
