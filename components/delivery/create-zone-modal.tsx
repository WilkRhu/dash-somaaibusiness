'use client';

import { useState } from 'react';
import { deliveryService } from '@/lib/api/delivery';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '../ui/toast';

interface CreateZoneModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateZoneModal({ onClose, onSuccess }: CreateZoneModalProps) {
  const [name, setName] = useState('');
  const [neighborhoods, setNeighborhoods] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [freeDeliveryMinimum, setFreeDeliveryMinimum] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentEstablishment } = useEstablishmentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEstablishment?.id) {
      showToast('Erro: Estabelecimento não selecionado', 'error');
      return;
    }

    setLoading(true);
    try {
      await deliveryService.createZone(currentEstablishment.id, {
        name,
        neighborhoods: neighborhoods.split(',').map(n => n.trim()).filter(Boolean),
        deliveryFee: parseFloat(deliveryFee),
        freeDeliveryMinimum: freeDeliveryMinimum ? parseFloat(freeDeliveryMinimum) : null,
        estimatedTime: parseInt(estimatedTime),
      });
      showToast('Zona criada com sucesso!', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao criar zona', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Nova Zona de Entrega</h2>
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
              Nome da Zona *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Centro"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bairros (separados por vírgula) *
            </label>
            <textarea
              value={neighborhoods}
              onChange={(e) => setNeighborhoods(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Ex: Centro, Jardim América, Vila Nova"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taxa de Entrega (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mínimo para Entrega Grátis (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={freeDeliveryMinimum}
              onChange={(e) => setFreeDeliveryMinimum(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00 (opcional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco se não houver entrega grátis
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo Estimado (minutos) *
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
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
              {loading ? 'Criando...' : 'Criar Zona'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
