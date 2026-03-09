'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/lib/stores/admin-store';

export default function NotificationsPage() {
  const { 
    fetchNotificationDeliveries,
    fetchNotificationDeliveriesSummary,
    notificationDeliveries,
    notificationDeliveriesSummary,
    isLoadingDeliveries
  } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'deliveries' | 'campaigns'>('deliveries');
  const [filters, setFilters] = useState({
    userId: '',
    establishmentId: '',
    campaignId: '',
    status: '',
  });

  useEffect(() => {
    fetchNotificationDeliveries();
    fetchNotificationDeliveriesSummary();
  }, [fetchNotificationDeliveries, fetchNotificationDeliveriesSummary]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Enviado</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Falhou</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pendente</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notificações</h1>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-4 py-2 border-b-2 font-medium capitalize ${
              activeTab === 'deliveries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Entregas
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 border-b-2 font-medium capitalize ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Campanhas
          </button>
        </nav>
      </div>

      {activeTab === 'deliveries' && (
        <>
          {notificationDeliveriesSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-800">{notificationDeliveriesSummary.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">Enviados</p>
                <p className="text-2xl font-bold text-green-600">{notificationDeliveriesSummary.sent}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">Falhas</p>
                <p className="text-2xl font-bold text-red-600">{notificationDeliveriesSummary.failed}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{notificationDeliveriesSummary.pending}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="ID do Usuário"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="ID do Estabelecimento"
                value={filters.establishmentId}
                onChange={(e) => setFilters({ ...filters, establishmentId: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="ID da Campanha"
                value={filters.campaignId}
                onChange={(e) => setFilters({ ...filters, campaignId: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="sent">Enviado</option>
                <option value="failed">Falhou</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estabelecimento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoadingDeliveries ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : !notificationDeliveries || notificationDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Nenhuma notificação encontrada
                    </td>
                  </tr>
                ) : (
                  notificationDeliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="px-4 py-3">
                        {getStatusBadge(delivery.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800">{delivery.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{delivery.message}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{delivery.userName || delivery.userId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{delivery.establishmentName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {delivery.sentAt ? new Date(delivery.sentAt).toLocaleString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Campanhas de Notificação</h3>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Nova Campanha
            </button>
          </div>
          
          <div className="text-center text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p>Nenhuma campanha encontrada</p>
            <p className="text-sm mt-2">Crie sua primeira campanha de notificação</p>
          </div>
        </div>
      )}
    </div>
  );
}