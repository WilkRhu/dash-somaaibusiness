'use client';

import { useState } from 'react';
import { KitchenOrder, KitchenOrderStatus } from '@/lib/types/kitchen-order';
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useInventory } from '@/lib/hooks/use-inventory';
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
  const { items: inventoryItems } = useInventory({}, { fetchAll: true });

  const availableTransitions = statusTransitions[order.status] || [];
  const resolveProductImage = (item: KitchenOrder['items'][number]) => {
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const inventoryItem =
      (item.inventoryItemId && inventoryItems.find((product) => String(product.id) === String(item.inventoryItemId))) ||
      inventoryItems.find((product) => normalize(product.name) === normalize(item.productName));

    return inventoryItem?.images?.[0] || inventoryItem?.image || '';
  };

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
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Itens do Pedido</h3>
              <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex gap-3 p-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                    {resolveProductImage(item) ? (
                      <img
                        src={resolveProductImage(item)}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Item {idx + 1}
                      </div>
                      <div className="mt-0.5 truncate text-sm font-bold text-gray-900">
                        {item.productName}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Quantidade</span>
                        <span className="shrink-0 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-bold text-white">
                          {item.quantity}x
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 bg-gray-50 px-3 py-2">
                    {item.notes ? (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800">
                        <span className="mr-1">⚠️</span>
                        {item.notes}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Sem observações</div>
                    )}
                  </div>
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
