'use client';

import { useState } from 'react';
import { KitchenOrder, KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '@/components/ui/toast';

interface UpdateKitchenOrderStatusModalProps {
  order: KitchenOrder;
  onClose: () => void;
  onStatusUpdate: (status: KitchenOrderStatus) => void;
}

const statusTransitions: Record<KitchenOrderStatus, KitchenOrderStatus[]> = {
  [KitchenOrderStatus.PENDING]: [KitchenOrderStatus.CONFIRMED, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.CONFIRMED]: [KitchenOrderStatus.PREPARING, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.PREPARING]: [KitchenOrderStatus.READY, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.READY]: [KitchenOrderStatus.PICKED_UP, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.PICKED_UP]: [],
  [KitchenOrderStatus.CANCELLED]: [],
};

const statusLabels: Record<KitchenOrderStatus, string> = {
  [KitchenOrderStatus.PENDING]: 'Novo Pedido',
  [KitchenOrderStatus.CONFIRMED]: 'Confirmado',
  [KitchenOrderStatus.PREPARING]: 'Preparando',
  [KitchenOrderStatus.READY]: 'Pronto',
  [KitchenOrderStatus.PICKED_UP]: 'Retirado',
  [KitchenOrderStatus.CANCELLED]: 'Cancelado',
};

const statusColors: Record<KitchenOrderStatus, string> = {
  [KitchenOrderStatus.PENDING]: 'bg-red-600 hover:bg-red-700',
  [KitchenOrderStatus.CONFIRMED]: 'bg-yellow-600 hover:bg-yellow-700',
  [KitchenOrderStatus.PREPARING]: 'bg-blue-600 hover:bg-blue-700',
  [KitchenOrderStatus.READY]: 'bg-green-600 hover:bg-green-700',
  [KitchenOrderStatus.PICKED_UP]: 'bg-gray-600 hover:bg-gray-700',
  [KitchenOrderStatus.CANCELLED]: 'bg-red-800 hover:bg-red-900',
};

export default function UpdateKitchenOrderStatusModal({
  order,
  onClose,
  onStatusUpdate,
}: UpdateKitchenOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<KitchenOrderStatus | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentEstablishment } = useEstablishmentStore();
  const { updateStatus } = useKitchenOrders();

  const availableTransitions = statusTransitions[order.status] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStatus) {
      showToast('Selecione um novo status', 'error');
      return;
    }

    if (!currentEstablishment?.id) {
      showToast('Estabelecimento não selecionado', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await updateStatus(order.id, {
        status: selectedStatus,
        description,
      });
      showToast(`Status atualizado para ${statusLabels[selectedStatus]}!`, 'success');
      onStatusUpdate(selectedStatus);
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold">Pedido #{order.orderNumber}</h2>
            {order.customerName && (
              <p className="text-gray-800 font-semibold">👤 {order.customerName}</p>
            )}
            <p className="text-gray-600 text-sm">Status atual: {statusLabels[order.status]}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Detalhes do Pedido */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="font-semibold">{item.quantity}x</span> {item.productName}
                    </span>
                  </div>
                  {item.notes && (
                    <div className="mt-1 ml-4 p-2 bg-orange-100 border-l-4 border-orange-500 rounded text-sm font-semibold text-orange-800">
                      ⚠️ {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {order.notes && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <span className="font-semibold">📝 Nota:</span> {order.notes}
              </div>
            )}
          </div>

          {/* Seleção de Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Novo Status *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableTransitions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`p-3 rounded-lg font-semibold text-white transition-all ${
                    selectedStatus === status
                      ? `${statusColors[status]} ring-2 ring-offset-2 ring-gray-400`
                      : `${statusColors[status]} opacity-70`
                  }`}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observação (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Faltava um ingrediente, pedido pronto mais cedo, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Tempo Decorrido */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-1">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">🕐 Criado em:</span>{' '}
              {(() => {
                const raw = order.createdAt;
                if (!raw) return '—';
                let ts = Number(raw);
                if (isNaN(ts) || ts === 0) ts = new Date(raw).getTime();
                if (isNaN(ts) || ts === 0) return '—';
                return new Date(ts).toLocaleString('pt-BR', { 
                  hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' 
                });
              })()}
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">⏱️ Tempo decorrido:</span>{' '}
              {(() => {
                const raw = order.createdAt;
                if (!raw) return '—';
                let created = Number(raw);
                if (isNaN(created) || created === 0) created = new Date(raw).getTime();
                if (isNaN(created) || created === 0) return '—';
                const diffMs = Math.abs(Date.now() - created);
                const totalMin = Math.floor(diffMs / 60000);
                if (totalMin < 1) return 'menos de 1 minuto';
                if (totalMin < 60) return `${totalMin} minutos`;
                const hours = Math.floor(totalMin / 60);
                const mins = totalMin % 60;
                return `${hours}h ${mins}min`;
              })()}
            </div>
            {order.estimatedPrepTime > 0 && (
              <div className="text-sm text-gray-700">
                <span className="font-semibold">⏳ Tempo estimado:</span> {order.estimatedPrepTime} minutos
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              disabled={isLoading || !selectedStatus}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
