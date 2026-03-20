'use client';

import React, { useEffect, useState } from 'react';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { showToast } from '@/components/ui/toast';
import type { PurchaseOrder, UpdatePurchaseOrderStatusDto } from '@/lib/types/supplier';
import Link from 'next/link';

const STATUS_LABELS: Record<PurchaseOrder['status'], string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<PurchaseOrder['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS: PurchaseOrder['status'][] = ['pending', 'approved', 'delivered', 'cancelled'];

export default function PurchaseOrdersPage() {
  const { purchaseOrders, suppliers, isLoading, loadPurchaseOrders, updateOrderStatus } = useSuppliers();
  const [statusFilter, setStatusFilter] = useState<PurchaseOrder['status'] | 'all'>('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: PurchaseOrder['status']) => {
    setUpdatingId(orderId);
    try {
      const payload: UpdatePurchaseOrderStatusDto = {
        status,
        ...(status === 'delivered' ? { deliveredDate: new Date().toISOString() } : {}),
      };
      await updateOrderStatus(orderId, payload);
      showToast('Status atualizado', 'success');
    } catch {
      showToast('Erro ao atualizar status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = purchaseOrders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSupplier = supplierFilter === 'all' || o.supplierId === supplierFilter;
    return matchStatus && matchSupplier;
  });

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString('pt-BR') : '—';

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Pedidos de Compra</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/suppliers"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          ← Fornecedores
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PurchaseOrder['status'] | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="all">Todos os status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Fornecedor</label>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            <option value="all">Todos os fornecedores</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Carregando pedidos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">Nenhum pedido encontrado</p>
            <p className="text-sm mt-1">Crie um pedido na página de Fornecedores</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pedido</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fornecedor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Itens</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Entrega Prevista</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      #{order.orderNumber}
                      <div className="text-gray-400 font-sans">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {order.supplier?.name ?? suppliers.find(s => s.id === order.supplierId)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 font-semibold text-brand-navy">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(order.expectedDeliveryDate)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as PurchaseOrder['status'])}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-brand-blue ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>

                  {/* Linha expandida com itens */}
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-detail`} className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="space-y-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-xs text-gray-500 border-b border-gray-200">
                                <th className="text-left pb-2 font-medium">Produto</th>
                                <th className="text-right pb-2 font-medium">Qtd</th>
                                <th className="text-right pb-2 font-medium">Preço Unit.</th>
                                <th className="text-right pb-2 font-medium">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {order.items.map((item, i) => (
                                <tr key={i}>
                                  <td className="py-1.5 text-gray-700">{item.productName}</td>
                                  <td className="py-1.5 text-right text-gray-600">{item.quantity}</td>
                                  <td className="py-1.5 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                  <td className="py-1.5 text-right font-medium text-gray-800">{formatCurrency(item.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {order.notes && (
                            <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                              <span className="font-medium">Obs:</span> {order.notes}
                            </p>
                          )}
                          {order.deliveredDate && (
                            <p className="text-xs text-green-600">
                              Entregue em {formatDate(order.deliveredDate)}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
