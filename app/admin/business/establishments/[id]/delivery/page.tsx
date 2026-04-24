'use client';

import { use, useState, useEffect } from 'react';
import { deliveryApi, DeliveryOrder } from '@/lib/api/delivery';

export default function DeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: establishmentId } = use(params);
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, [establishmentId]);

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await deliveryApi.listOrders(establishmentId, {
        status: statusFilter || undefined,
      });
      setDeliveries(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar entregas:', err);
      setError(err.message || 'Erro ao carregar entregas');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready_for_delivery: 'Pronto para entrega',
      out_for_delivery: 'Em trânsito',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      failed: 'Falhou',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready_for_delivery: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredDeliveries = statusFilter
    ? deliveries.filter(d => d.status === statusFilter)
    : deliveries;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <a
          href="/admin/business/establishments"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Estabelecimentos
        </a>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Entregas</h1>
        <span className="text-sm text-gray-500">{filteredDeliveries.length} entregas</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-900">
            {deliveries.filter(d => d.status === 'pending').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600">Em Trânsito</p>
          <p className="text-2xl font-bold text-purple-900">
            {deliveries.filter(d => d.status === 'out_for_delivery').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Entregues</p>
          <p className="text-2xl font-bold text-green-900">
            {deliveries.filter(d => d.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="picked_up">Retirado</option>
          <option value="in_transit">Em trânsito</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma entrega encontrada</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pedido</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Endereço</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Entregador</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{delivery.orderNumber}</td>
                  <td className="py-3 px-4 text-gray-600">{delivery.customerName}</td>
                  <td className="py-3 px-4 text-gray-600">{delivery.deliveryAddress}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {delivery.driver?.name || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}