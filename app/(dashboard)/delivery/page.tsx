'use client';

import { useState } from 'react';
import { useDeliveryOrders, useDeliveryZones } from '@/lib/hooks/use-delivery';
import { useDeliveryRealtime } from '@/lib/hooks/use-delivery-realtime';
import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { DeliveryOrderCard } from '@/components/delivery/delivery-order-card';
import { DeliveryOrderDetailsModal } from '@/components/delivery/delivery-order-details-modal';
import { UpdateStatusModal } from '@/components/delivery/update-status-modal';
import { DeliveryZonesTable } from '@/components/delivery/delivery-zones-table';
import { CreateZoneModal } from '@/components/delivery/create-zone-modal';
import { EditZoneModal } from '@/components/delivery/edit-zone-modal';
import { DeliveryNotifications } from '@/components/delivery/delivery-notifications';
import { DeliveryDelayAlerts } from '@/components/delivery/delivery-delay-alerts';
import { DeliveryRealtimeStats } from '@/components/delivery/delivery-realtime-stats';
import { DeliveryRealtimeMap } from '@/components/delivery/delivery-realtime-map';
import { DeliveryRealtimeTable } from '@/components/delivery/delivery-realtime-table';
import { DeliveryGeofenceAlerts } from '@/components/delivery/delivery-geofence-alerts';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { deliveryApi } from '@/lib/api/delivery';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '@/components/ui/toast';
import Link from 'next/link';

type TabType = 'dashboard' | 'orders' | 'zones';

export default function DeliveryPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<DeliveryOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateZoneModal, setShowCreateZoneModal] = useState(false);
  const [showEditZoneModal, setShowEditZoneModal] = useState(false);
  const [showDeleteZoneModal, setShowDeleteZoneModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedOrderIdMap, setSelectedOrderIdMap] = useState<string | undefined>();

  const { orders, loading: ordersLoading, refetch: refetchOrders } = useDeliveryOrders(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
  const { zones, loading: zonesLoading, refetch: refetchZones } = useDeliveryZones();
  const { isConnected, deliveryLocations, etas, geofenceAlerts, clearGeofenceAlert } = useDeliveryRealtime();

  const handleViewDetails = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (order: DeliveryOrder) => {
    setOrderToUpdate(order);
    setShowUpdateModal(true);
  };

  const handleStatusUpdateSuccess = () => {
    refetchOrders();
  };

  const handleZoneCreated = () => {
    refetchZones();
  };

  const handleDeleteZone = async () => {
    if (!selectedZone || !currentEstablishment) return;

    try {
      await deliveryApi.deleteZone(currentEstablishment.id, selectedZone.id);
      showToast('Zona excluída com sucesso!', 'success');
      setShowDeleteZoneModal(false);
      setSelectedZone(null);
      refetchZones();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao excluir zona', 'error');
    }
  };

  const filteredOrders = orders;

  const activeOrders = orders.filter(
    o => ![DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED].includes(o.status)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notificações */}
      {currentEstablishment && (
        <DeliveryNotifications
          establishmentId={currentEstablishment.id}
          onNewOrder={() => refetchOrders()}
        />
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Delivery</h1>
        <p className="text-gray-600 mt-2">Gerencie pedidos e zonas de entrega</p>
      </div>

      {/* Alertas de Atraso */}
      <DeliveryDelayAlerts orders={orders} />

      {/* Card de Acesso Rápido aos Relatórios */}
      <div className="mb-6">
        <Link
          href="/delivery/reports"
          className="block bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <svg className="w-12 h-12 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h3 className="text-xl font-bold mb-1">Relatórios de Delivery</h3>
                <p className="text-blue-100">Visualize análises detalhadas de entregas, performance de entregadores e receita</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-blue-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
            </div>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Zonas de Entrega</p>
              <p className="text-2xl font-bold text-gray-900">{zones.length}</p>
            </div>
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'zones'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Zonas de Entrega
            </button>
            <Link
              href="/delivery/drivers"
              className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Entregadores
            </Link>
            <Link
              href="/delivery/reports"
              className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 ml-auto flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Relatórios
            </Link>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <DeliveryRealtimeStats orders={orders} isConnected={isConnected} />

              {/* Geofence Alerts */}
              {geofenceAlerts.length > 0 && (
                <DeliveryGeofenceAlerts
                  alerts={geofenceAlerts}
                  onClear={clearGeofenceAlert}
                />
              )}

              {/* Map */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Mapa de Entregas</h3>
                <DeliveryRealtimeMap
                  deliveryLocations={deliveryLocations}
                  orders={orders}
                  selectedOrderId={selectedOrderIdMap}
                  onSelectOrder={setSelectedOrderIdMap}
                />
              </div>

              {/* Table */}
              <DeliveryRealtimeTable
                orders={orders}
                etas={etas}
                selectedOrderId={selectedOrderIdMap}
                onSelectOrder={setSelectedOrderIdMap}
              />
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              {/* Filtros */}
              <div className="mb-6 flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value={DeliveryStatus.PENDING}>Pendente</option>
                  <option value={DeliveryStatus.CONFIRMED}>Confirmado</option>
                  <option value={DeliveryStatus.PREPARING}>Preparando</option>
                  <option value={DeliveryStatus.READY_FOR_DELIVERY}>Pronto</option>
                  <option value={DeliveryStatus.OUT_FOR_DELIVERY}>Saiu para Entrega</option>
                  <option value={DeliveryStatus.DELIVERED}>Entregue</option>
                  <option value={DeliveryStatus.CANCELLED}>Cancelado</option>
                </select>
              </div>

              {/* Lista de Pedidos */}
              {ordersLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Carregando pedidos...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum pedido encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders.map((order) => (
                    <DeliveryOrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={handleViewDetails}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'zones' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Zonas de Entrega</h2>
                <button
                  onClick={() => setShowCreateZoneModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Nova Zona
                </button>
              </div>

              {zonesLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Carregando zonas...</p>
                </div>
              ) : (
                <DeliveryZonesTable
                  zones={zones}
                  onEdit={(zone) => {
                    setSelectedZone(zone);
                    setShowEditZoneModal(true);
                  }}
                  onDelete={(zone) => {
                    setSelectedZone(zone);
                    setShowDeleteZoneModal(true);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <DeliveryOrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showUpdateModal && (
        <UpdateStatusModal
          order={orderToUpdate}
          onClose={() => {
            setShowUpdateModal(false);
            setOrderToUpdate(null);
          }}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}

      {showCreateZoneModal && (
        <CreateZoneModal
          onClose={() => setShowCreateZoneModal(false)}
          onSuccess={handleZoneCreated}
        />
      )}

      {showEditZoneModal && selectedZone && (
        <EditZoneModal
          zone={selectedZone}
          onClose={() => {
            setShowEditZoneModal(false);
            setSelectedZone(null);
          }}
          onSuccess={() => {
            refetchZones();
          }}
        />
      )}

      {showDeleteZoneModal && selectedZone && (
        <ConfirmModal
          title="Excluir Zona de Entrega"
          message={`Tem certeza que deseja excluir a zona "${selectedZone.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          onConfirm={handleDeleteZone}
          onCancel={() => {
            setShowDeleteZoneModal(false);
            setSelectedZone(null);
          }}
        />
      )}
    </div>
  );
}
