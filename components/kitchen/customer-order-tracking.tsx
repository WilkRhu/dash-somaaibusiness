'use client';

import { KitchenOrder, KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { useEffect, useState } from 'react';

interface CustomerOrderTrackingProps {
  order: KitchenOrder;
  now: number;
}

const statusSteps = [
  {
    status: KitchenOrderStatus.PENDING,
    label: 'Recebido',
    description: 'Seu pedido foi recebido',
    icon: '📋',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  {
    status: KitchenOrderStatus.CONFIRMED,
    label: 'Confirmado',
    description: 'Pedido confirmado',
    icon: '✓',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  {
    status: KitchenOrderStatus.PREPARING,
    label: 'Preparando',
    description: 'Estamos preparando',
    icon: '👨‍🍳',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    status: KitchenOrderStatus.READY,
    label: 'Pronto',
    description: 'Seu pedido está pronto',
    icon: '🎉',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
];

export function CustomerOrderTracking({ order, now }: CustomerOrderTrackingProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const created = new Date(order.createdAt).getTime();
    const elapsed = Math.floor((now - created) / 60000);
    setElapsedTime(elapsed);
  }, [now, order.createdAt]);

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);
  const currentStep = statusSteps[currentStepIndex];

  return (
    <div className="space-y-8">
      {/* Header com número do pedido */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-white shadow-lg">
          <span className="text-sm font-semibold">Pedido #</span>
          <span className="text-2xl font-bold">{order.orderNumber}</span>
        </div>
      </div>

      {/* Status Atual */}
      <div className={`rounded-2xl ${currentStep.bgColor} p-8 text-center`}>
        <div className="text-6xl mb-4">{currentStep.icon}</div>
        <h2 className={`text-3xl font-bold ${currentStep.textColor} mb-2`}>{currentStep.label}</h2>
        <p className={`${currentStep.textColor} text-lg opacity-80`}>{currentStep.description}</p>
        <p className={`${currentStep.textColor} text-sm mt-4 opacity-60`}>
          Tempo decorrido: {elapsedTime} minuto{elapsedTime !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Timeline Visual */}
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex gap-4">
              {/* Círculo do status */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    isCompleted
                      ? `bg-gradient-to-br ${step.color} text-white shadow-lg ${isCurrent ? 'ring-4 ring-offset-2 ring-current' : ''}`
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`w-1 h-12 mt-2 ${isCompleted ? 'bg-gradient-to-b from-current to-gray-200' : 'bg-gray-200'}`}
                  />
                )}
              </div>

              {/* Conteúdo do status */}
              <div className="flex-1 pt-2">
                <h3 className={`font-semibold text-lg ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </h3>
                <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-300'}`}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalhes do Pedido */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Detalhes do Pedido</h3>

        {/* Itens */}
        <div className="space-y-3 border-t pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">x{item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Valores */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto</span>
              <span>-R$ {order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2">
            <span>Total</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notas */}
        {order.notes && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Observações</p>
            <p className="text-gray-700 bg-gray-50 rounded p-3">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Mensagem de Status */}
      {order.status === KitchenOrderStatus.READY && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <p className="text-2xl font-bold text-green-700 mb-2">🎉 Seu pedido está pronto!</p>
          <p className="text-green-600">Pode retirar agora no balcão</p>
        </div>
      )}

      {order.status === KitchenOrderStatus.PREPARING && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-lg font-semibold text-blue-700 mb-2">⏳ Estamos preparando seu pedido</p>
          <p className="text-blue-600 text-sm">Tempo estimado: {order.estimatedPrepTime} minutos</p>
        </div>
      )}
    </div>
  );
}
