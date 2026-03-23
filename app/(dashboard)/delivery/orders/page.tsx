'use client';

import { useState } from 'react';
import { useDeliveryOrders } from '@/lib/hooks/use-delivery';
import { DeliveryOrder, DeliveryStatus } from '@/lib/types/delivery';
import { DeliveryOrderCard } from '@/components/delivery/delivery-order-card';
import { DeliveryOrderDetailsModal } from '@/components/delivery/delivery-order-details-modal';
import { UpdateStatusModal } from '@/components/delivery/update-status-modal';
import { OrderActivityLog } from '@/components/delivery/order-activity-log';
import Link from 'next/link';

export default function DeliveryOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<DeliveryOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { orders, loading: ordersLoading, refetch: refetchOrders } = useDeliveryOrders(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

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

  const filteredOrders = orders;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/delivery"
          className="text-blue-600 hover:text-blue-700 mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos de Delivery</h1>
        <p className="text-gray-600 mt-2">Gerencie todos os pedidos de entrega</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === DeliveryStatus.PENDING).length}
              </p>
            </div>
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Trânsito</p>
              <p className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === DeliveryStatus.OUT_FOR_DELIVERY).length}
              </p>
            </div>
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Entregues</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === DeliveryStatus.DELIVERED).length}
              </p>
            </div>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

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
    </div>
  );
}
