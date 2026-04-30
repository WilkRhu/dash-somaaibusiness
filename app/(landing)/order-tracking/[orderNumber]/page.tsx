'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { kitchenOrdersApi } from '@/lib/api/kitchen-orders';
import { KitchenOrder, KitchenOrderStatus } from '@/lib/types/kitchen-order';

const statusConfig = {
  [KitchenOrderStatus.PENDING]: {
    label: 'Recebido',
    message: 'Seu pedido foi recebido',
    icon: '📋',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    step: 0,
  },
  [KitchenOrderStatus.CONFIRMED]: {
    label: 'Confirmado',
    message: 'Seu pedido foi confirmado',
    icon: '✓',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    step: 1,
  },
  [KitchenOrderStatus.PREPARING]: {
    label: 'Preparando',
    message: 'Estamos preparando seu pedido',
    icon: '👨‍🍳',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    step: 2,
  },
  [KitchenOrderStatus.READY]: {
    label: 'Pronto',
    message: 'Seu pedido está pronto para retirada',
    icon: '🎉',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    step: 3,
  },
};

const steps = [
  { label: 'Recebido', status: KitchenOrderStatus.PENDING },
  { label: 'Confirmado', status: KitchenOrderStatus.CONFIRMED },
  { label: 'Preparando', status: KitchenOrderStatus.PREPARING },
  { label: 'Pronto', status: KitchenOrderStatus.READY },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<KitchenOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Buscar pedido
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        // Tenta buscar de todos os estabelecimentos (sem estabelecimento específico)
        // Você pode ajustar isso conforme necessário
        const response = await fetch(`/api/kitchen-orders/search?orderNumber=${orderNumber}`);
        if (!response.ok) throw new Error('Pedido não encontrado');
        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  // Atualizar a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      if (order) {
        const fetchOrder = async () => {
          try {
            const response = await fetch(`/api/kitchen-orders/search?orderNumber=${orderNumber}`);
            if (response.ok) {
              const data = await response.json();
              setOrder(data);
            }
          } catch (err) {
            console.error('Erro ao atualizar pedido:', err);
          }
        };
        fetchOrder();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderNumber, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-2xl font-bold">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white text-2xl font-bold mb-4">Pedido não encontrado</p>
          <p className="text-gray-300 text-lg">{error || 'Verifique o número do pedido'}</p>
        </div>
      </div>
    );
  }

  const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig[KitchenOrderStatus.PENDING];
  const currentStep = config.step;
  const elapsedMinutes = Math.floor((now - new Date(order.createdAt).getTime()) / 60000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-8">
        {/* Número do Pedido Grande */}
        <div className="text-center">
          <p className="text-gray-400 text-2xl md:text-3xl font-semibold mb-2">SEU PEDIDO</p>
          <div className="text-9xl md:text-[150px] font-black text-white tracking-wider drop-shadow-lg">
            {order.orderNumber}
          </div>
        </div>

        {/* Status Atual - Card Grande */}
        <div className={`rounded-3xl bg-gradient-to-br ${config.color} p-8 md:p-12 text-white shadow-2xl`}>
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <p className="text-xl md:text-2xl font-semibold opacity-90 mb-2">STATUS ATUAL</p>
              <h1 className="text-6xl md:text-8xl font-black mb-4">{config.label}</h1>
              <p className="text-xl md:text-2xl opacity-90">{config.message}</p>
              <p className="text-lg md:text-xl opacity-75 mt-4">Tempo decorrido: {elapsedMinutes} minuto{elapsedMinutes !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-9xl md:text-[120px] flex-shrink-0">{config.icon}</div>
          </div>
        </div>

        {/* Timeline de Progresso */}
        <div className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <p className="text-gray-400 text-lg font-semibold mb-8">PROGRESSO DO PEDIDO</p>
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.status} className="flex flex-col items-center">
                  {/* Círculo */}
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 ring-4 ring-yellow-300 scale-110'
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-4 text-center font-bold text-lg md:text-xl ${
                      isCompleted ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>

                  {/* Linha conectora */}
                  {index < steps.length - 1 && (
                    <div
                      className={`w-1 h-12 md:h-16 mt-4 ${
                        isCompleted && index < currentStep
                          ? 'bg-gradient-to-b from-green-400 to-green-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes do Pedido */}
        <div className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <p className="text-gray-400 text-lg font-semibold mb-6">DETALHES DO PEDIDO</p>

          {/* Itens */}
          <div className="space-y-4 mb-8">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-700 rounded-2xl p-4 md:p-6">
                <div className="flex-1">
                  <p className="text-white text-xl md:text-2xl font-bold">{item.productName}</p>
                  {item.notes && <p className="text-gray-300 text-sm md:text-base mt-2">{item.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-3xl md:text-4xl font-bold">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Valores */}
          <div className="border-t border-gray-600 pt-6 space-y-3">
            <div className="flex justify-between text-gray-300 text-lg md:text-xl">
              <span>Subtotal</span>
              <span>R$ {order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-400 text-lg md:text-xl">
                <span>Desconto</span>
                <span>-R$ {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-white text-2xl md:text-3xl font-bold border-t border-gray-600 pt-4">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Mensagem Final */}
        {order.status === KitchenOrderStatus.READY && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            <p className="text-white text-4xl md:text-6xl font-black mb-4">🎉 PRONTO!</p>
            <p className="text-white text-2xl md:text-3xl font-bold">Seu pedido está esperando no balcão</p>
          </div>
        )}

        {order.status === KitchenOrderStatus.PREPARING && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            <p className="text-white text-3xl md:text-5xl font-black mb-4">⏳ PREPARANDO</p>
            <p className="text-white text-xl md:text-2xl font-bold">Tempo estimado: {order.estimatedPrepTime} minutos</p>
          </div>
        )}
      </div>
    </div>
  );
}
