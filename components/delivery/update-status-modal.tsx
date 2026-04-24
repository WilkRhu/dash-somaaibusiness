'use client';

import { useState, useEffect } from 'react';
import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { deliveryService } from '@/lib/api/delivery';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '../ui/toast';
import apiClient from '@/lib/api/client';
import { Driver } from '@/lib/hooks/use-delivery-drivers';

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
  const [driverId, setDriverId] = useState<string>('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentEstablishment } = useEstablishmentStore();

  const isOutForDelivery = status === DeliveryStatus.OUT_FOR_DELIVERY;

  // Busca entregadores quando status muda para "saiu para entrega"
  useEffect(() => {
    if (!isOutForDelivery || !currentEstablishment?.id) return;

    const fetchDrivers = async () => {
      setLoadingDrivers(true);
      try {
        const response = await apiClient.get(
          `/business/establishments/${currentEstablishment.id}/delivery/drivers?isActive=true`
        );
        setDrivers(response.data.data || []);
      } catch {
        showToast('Erro ao carregar entregadores', 'error');
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, [isOutForDelivery, currentEstablishment?.id]);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentEstablishment?.id) {
      showToast('Erro: Estabelecimento não selecionado', 'error');
      return;
    }

    if (isOutForDelivery && !driverId) {
      showToast('Selecione um entregador', 'error');
      return;
    }

    setLoading(true);
    try {
      await deliveryService.updateStatus(
        currentEstablishment.id,
        order.id,
        status,
        description,
        isOutForDelivery ? driverId : undefined
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

  const vehicleTypeLabel: Record<string, string> = {
    motorcycle: '🏍️ Moto',
    bicycle: '🚲 Bicicleta',
    car: '🚗 Carro',
    van: '🚐 Van',
    truck: '🚚 Caminhão',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Atualizar Status</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pedido</label>
            <p className="text-gray-900 font-medium">#{order.orderNumber}</p>
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

          {/* Seleção de entregador — só aparece quando "Saiu para Entrega" */}
          {isOutForDelivery && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entregador *
              </label>
              {loadingDrivers ? (
                <p className="text-sm text-gray-500">Carregando entregadores...</p>
              ) : drivers.length === 0 ? (
                <p className="text-sm text-red-500">Nenhum entregador ativo cadastrado.</p>
              ) : (
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione um entregador</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} — {vehicleTypeLabel[driver.vehicleType] || driver.vehicleType}
                      {driver.isAvailable ? '' : ' (ocupado)'}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Ex: Saiu para entrega com João"
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
              disabled={loading || (isOutForDelivery && loadingDrivers)}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
