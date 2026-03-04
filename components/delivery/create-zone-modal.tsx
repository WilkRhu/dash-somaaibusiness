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
  const [radiusKm, setRadiusKm] = useState('');
  const [centerLatitude, setCenterLatitude] = useState('');
  const [centerLongitude, setCenterLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const { currentEstablishment } = useEstablishmentStore();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalização não suportada pelo navegador', 'error');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenterLatitude(position.coords.latitude.toFixed(6));
        setCenterLongitude(position.coords.longitude.toFixed(6));
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
        radiusKm: radiusKm ? parseFloat(radiusKm) : undefined,
        centerLatitude: centerLatitude ? parseFloat(centerLatitude) : undefined,
        centerLongitude: centerLongitude ? parseFloat(centerLongitude) : undefined,
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
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  value={centerLatitude}
                  onChange={(e) => setCenterLatitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  value={centerLongitude}
                  onChange={(e) => setCenterLongitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="-46.633308"
                />
              </div>
            </div>
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
