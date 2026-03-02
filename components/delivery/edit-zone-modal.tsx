'use client';

import { useState } from 'react';
import { DeliveryZone } from '@/lib/types/delivery';
import { deliveryService } from '@/lib/api/delivery';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '@/components/ui/toast';

interface EditZoneModalProps {
  zone: DeliveryZone;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditZoneModal({ zone, onClose, onSuccess }: EditZoneModalProps) {
  const { currentEstablishment } = useEstablishmentStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: zone.name,
    neighborhoods: zone.neighborhoods?.join(', ') || '',
    deliveryFee: zone.deliveryFee,
    freeDeliveryMinimum: zone.freeDeliveryMinimum || 0,
    estimatedTime: zone.estimatedTime,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentEstablishment) {
      showToast('Nenhum estabelecimento selecionado', 'error');
      return;
    }

    try {
      setLoading(true);

      const neighborhoods = formData.neighborhoods
        .split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0);

      await deliveryService.updateZone(currentEstablishment.id, zone.id, {
        name: formData.name,
        neighborhoods,
        deliveryFee: formData.deliveryFee,
        freeDeliveryMinimum: formData.freeDeliveryMinimum || undefined,
        estimatedTime: formData.estimatedTime,
      });

      showToast('Zona atualizada com sucesso!', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao atualizar zona', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Zona de Entrega</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Zona *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Centro, Zona Sul"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairros (separados por vírgula) *
            </label>
            <textarea
              value={formData.neighborhoods}
              onChange={(e) => setFormData({ ...formData, neighborhoods: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Centro, Jardim América, Vila Nova"
              rows={3}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Digite os bairros separados por vírgula
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de Entrega (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo Estimado (min) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Mínimo para Frete Grátis (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.freeDeliveryMinimum}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  freeDeliveryMinimum: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0 = sem frete grátis"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe 0 se não houver frete grátis
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
