'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDeliveryZones } from '@/lib/hooks/use-delivery';
import { useDeliveryRealtime } from '@/lib/hooks/use-delivery-realtime';
import { DeliveryZonesTable } from '@/components/delivery/delivery-zones-table';
import { CreateZoneModal } from '@/components/delivery/create-zone-modal';
import { EditZoneModal } from '@/components/delivery/edit-zone-modal';
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
import { useDeliveryOrders } from '@/lib/hooks/use-delivery';

type TabType = 'dashboard' | 'zones';

export default function DeliveryPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showCreateZoneModal, setShowCreateZoneModal] = useState(false);
  const [showEditZoneModal, setShowEditZoneModal] = useState(false);
  const [showDeleteZoneModal, setShowDeleteZoneModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedOrderIdMap, setSelectedOrderIdMap] = useState<string | undefined>();

  const { orders } = useDeliveryOrders();
  const { zones, loading: zonesLoading, refetch: refetchZones } = useDeliveryZones();
  const { isConnected, deliveryLocations, etas, geofenceAlerts, clearGeofenceAlert } = useDeliveryRealtime();

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
              </p>
            </div>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <Link
              href="/delivery/orders"
              className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pedidos
            </Link>
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
