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
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: zone.name,
    neighborhoods: zone.neighborhoods?.join(', ') || '',
    deliveryFee: zone.deliveryFee,
    freeDeliveryMinimum: zone.freeDeliveryMinimum || 0,
    estimatedTime: zone.estimatedTime,
    radiusKm: zone.radiusKm || 0,
    centerLatitude: zone.centerLatitude || 0,
    centerLongitude: zone.centerLongitude || 0,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalização não suportada pelo navegador', 'error');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          centerLatitude: parseFloat(position.coords.latitude.toFixed(6)),
          centerLongitude: parseFloat(position.coords.longitude.toFixed(6)),
        });
        showToast('Localização obtida com sucesso!', 'success');
        setGettingLocation(false);
      },
      (error) => {
        let message = 'Erro ao obter localização';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Permissão de localização negada';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Localização indisponível';
        } else if (error.code === error.TIMEOUT) {
          message = 'Tempo esgotado ao obter localização';
        }
        showToast(message, 'error');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

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
        radiusKm: formData.radiusKm || undefined,
        centerLatitude: formData.centerLatitude || undefined,
        centerLongitude: formData.centerLongitude || undefined,
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

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Configuração de Raio (Opcional)
                </h3>
                <p className="text-xs text-gray-500">
                  Configure o raio de entrega baseado em coordenadas geográficas
                </p>
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {gettingLocation ? 'Obtendo...' : 'Usar Minha Localização'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Raio (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.radiusKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      radiusKm: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="5.0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.centerLatitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centerLatitude: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="-23.550520"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.centerLongitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centerLongitude: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="-46.633308"
                />
              </div>
            </div>
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
