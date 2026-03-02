'use client';

import { useState } from 'react';
import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { deliveryService } from '@/lib/api/delivery';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '../ui/toast';

interface UpdateStatusModalProps {
  order: DeliveryOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions = [
  { value: DeliveryStatus.PENDING, label: 'Pendente' },
  { value: DeliveryStatus.CONFIRMED, label: 'Confirmado' },
  { value: DeliveryStatus.PREPARING, label: 'Preparando' },
  { value: DeliveryStatus.READY_FOR_DELIVERY, label: 'Pronto para Entrega' },
  { value: DeliveryStatus.OUT_FOR_DELIVERY, label: 'Saiu para Entrega' },
  { value: DeliveryStatus.DELIVERED, label: 'Entregue' },
  { value: DeliveryStatus.CANCELLED, label: 'Cancelado' },
];

export function UpdateStatusModal({ order, onClose, onSuccess }: UpdateStatusModalProps) {
  const [status, setStatus] = useState<DeliveryStatus>(order?.status || DeliveryStatus.PENDING);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentEstablishment } = useEstablishmentStore();

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEstablishment?.id) {
      showToast('Erro: Estabelecimento não selecionado', 'error');
      return;
    }

    setLoading(true);
    try {
      await deliveryService.updateStatus(
        currentEstablishment.id,
        order.id,
        status,
        description
      );
      showToast('Status atualizado com sucesso!', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao atualizar status', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Atualizar Status</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pedido
            </label>
            <p className="text-gray-900">#{order.orderNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Novo Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Ex: Pedido confirmado e em preparação"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
