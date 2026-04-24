'use client';

import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';

interface DeliveryOrderDetailsModalProps {
  order: DeliveryOrder | null;
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

const paymentMethodLabels: Record<string, string> = {
  cash: 'Dinheiro',
  debit_card: 'Cartão de Débito',
  credit_card: 'Cartão de Crédito',
  pix: 'PIX',
  bank_transfer: 'Transferência Bancária',
};

export function DeliveryOrderDetailsModal({ order, onClose }: DeliveryOrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Pedido #{order.orderNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <p className="text-gray-700">{statusLabels[order.status]}</p>
          </div>

          {/* Cliente */}
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p className="text-gray-700">{order.customerName}</p>
            <p className="text-gray-600 text-sm">{order.customerPhone}</p>
          </div>

          {/* Endereço de Entrega */}
          <div>
            <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
            <p className="text-gray-700">{order.deliveryAddress}</p>
            <p className="text-gray-600 text-sm">
              {order.deliveryNeighborhood}, {order.deliveryCity} - {order.deliveryState}
            </p>
            <p className="text-gray-600 text-sm">CEP: {order.deliveryZipCode}</p>
            {order.deliveryComplement && (
              <p className="text-gray-600 text-sm">Complemento: {order.deliveryComplement}</p>
            )}
            {order.deliveryReference && (
              <p className="text-gray-600 text-sm">Referência: {order.deliveryReference}</p>
            )}
          </div>

          {/* Valores */}
          <div>
            <h3 className="font-semibold mb-2">Valores</h3>
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

          {/* Pagamento */}
          <div>
            <h3 className="font-semibold mb-2">Pagamento</h3>
            <p className="text-gray-700">{paymentMethodLabels[order.paymentMethod]}</p>
            {order.isPaid ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pago
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-yellow-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pendente
              </span>
            )}
          </div>

          {/* Tempo Estimado */}
          <div>
            <h3 className="font-semibold mb-2">Tempo Estimado</h3>
            <p className="text-gray-700">{order.estimatedDeliveryTime} minutos</p>
          </div>

          {/* Observações */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Observações</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Itens da Compra */}
          {order.sale && order.sale.items && order.sale.items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Itens da Compra</h3>
              <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
                {order.sale.items.map((item: any, index: number) => (
                  <div key={item.id || index} className="flex justify-between items-start py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {typeof item.quantity === 'string' ? parseFloat(item.quantity).toFixed(0) : item.quantity} × {formatCurrency(typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice)}
                      </p>
                      {item.discount && parseFloat(item.discount) > 0 && (
                        <p className="text-sm text-green-600">
                          Desconto: -{formatCurrency(typeof item.discount === 'string' ? parseFloat(item.discount) : item.discount)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Motorista */}
          {order.driver && (
            <div>
              <h3 className="font-semibold mb-2">Motorista</h3>
              <p className="text-gray-700">{order.driver.name}</p>
              <p className="text-gray-600 text-sm">{order.driver.phone}</p>
              <p className="text-gray-600 text-sm">Veículo: {order.driver.vehicleType}</p>
            </div>
          )}

          {/* Rastreamento */}
          {order.tracking && order.tracking.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Rastreamento</h3>
              <div className="space-y-2">
                {order.tracking.map((track) => (
                  <div key={track.id} className="border-l-2 border-blue-500 pl-4 py-2">
                    <p className="font-medium">{track.status}</p>
                    <p className="text-sm text-gray-600">{track.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(track.createdAt).toLocaleString('pt-BR')}
                    </p>
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
