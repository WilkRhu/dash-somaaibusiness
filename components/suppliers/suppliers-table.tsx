'use client';

import { useState } from 'react';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { EditSupplierForm } from './edit-supplier-form';
import { CreatePurchaseOrderModal } from './create-purchase-order-modal';
import { showToast } from '../ui/toast';
import { ConfirmModal } from '../ui/confirm-modal';
import type { Supplier } from '@/lib/types/supplier';

export function SuppliersTable() {
  const { suppliers, deleteSupplier, isLoading } = useSuppliers();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [orderingSupplier, setOrderingSupplier] = useState<Supplier | null>(null);

  const handleDelete = async () => {
    if (!deletingSupplier) return;

    try {
      await deleteSupplier(deletingSupplier.id);
      showToast('Fornecedor removido com sucesso!', 'success');
      setDeletingSupplier(null);
    } catch (error: any) {
      showToast(error.message || 'Erro ao remover fornecedor', 'error');
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatFullAddress = (supplier: Supplier) => {
    const parts = [];
    if (supplier.street) parts.push(supplier.street);
    if (supplier.number) parts.push(supplier.number);
    if (supplier.neighborhood) parts.push(supplier.neighborhood);
    if (supplier.city && supplier.state) parts.push(`${supplier.city} - ${supplier.state}`);
    return parts.join(', ') || '-';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum fornecedor cadastrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF/CNPJ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avaliação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {supplier.image ? (
                      <img
                        src={supplier.image}
                        alt={supplier.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{formatFullAddress(supplier)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.cnpj || supplier.cpf || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.phone}</div>
                  <div className="text-sm text-gray-500">{supplier.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRatingStars(supplier.rating)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      supplier.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {supplier.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setOrderingSupplier(supplier)}
                    className="text-green-600 hover:text-green-800 mr-4 inline-flex items-center gap-1"
                    title="Criar Pedido"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Pedido
                  </button>
                  <button
                    onClick={() => setEditingSupplier(supplier)}
                    className="text-brand-blue hover:text-brand-green mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeletingSupplier(supplier)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {editingSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-brand-navy mb-6">
                Editar Fornecedor
              </h2>
              <EditSupplierForm
                supplier={editingSupplier}
                onSuccess={() => setEditingSupplier(null)}
                onCancel={() => setEditingSupplier(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Pedido */}
      {orderingSupplier && (
        <CreatePurchaseOrderModal
          supplierId={orderingSupplier.id}
          supplierName={orderingSupplier.name}
          onClose={() => setOrderingSupplier(null)}
          onSuccess={() => {
            setOrderingSupplier(null);
          }}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deletingSupplier && (
        <ConfirmModal
          title="Remover Fornecedor"
          message={`Tem certeza que deseja remover o fornecedor "${deletingSupplier.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Remover"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setDeletingSupplier(null)}
          confirmVariant="danger"
        />
      )}
    </>
  );
}
