'use client';

import { useState } from 'react';
import { useCustomers } from '@/lib/hooks/use-customers';
import { CustomersTable } from '@/components/customers/customers-table';
import { AddCustomerForm } from '@/components/customers/add-customer-form';
import { EditCustomerForm } from '@/components/customers/edit-customer-form';
import { CustomerDetailsModal } from '@/components/customers/customer-details-modal';
import type { Customer } from '@/lib/types/customer';
import { showToast } from '@/components/ui/toast';

export default function CustomersPage() {
  const {
    customers,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    loadPurchaseHistory,
    clearError,
  } = useCustomers();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const handleCreate = async (data: any) => {
    try {
      await createCustomer(data);
      setShowAddForm(false);
      showToast('Cliente criado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar cliente', 'error');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingCustomer) return;

    try {
      await updateCustomer(editingCustomer.id, data);
      setEditingCustomer(null);
      showToast('Cliente atualizado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar cliente', 'error');
    }
  };

  const handleDelete = async (customer: Customer) => {
    try {
      await deleteCustomer(customer.id);
      showToast('Cliente excluído com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir cliente', 'error');
    }
  };

  const handleAddPoints = async (points: number) => {
    if (!viewingCustomer) return;

    try {
      await addLoyaltyPoints(viewingCustomer.id, points);
      showToast(`${points} pontos adicionados com sucesso!`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao adicionar pontos', 'error');
    }
  };

  const handleRedeemPoints = async (points: number) => {
    if (!viewingCustomer) return;

    try {
      await redeemLoyaltyPoints(viewingCustomer.id, points);
      showToast(`${points} pontos resgatados com sucesso!`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao resgatar pontos', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Clientes</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Cliente
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar por nome, telefone, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              <p className="text-gray-500 mt-4">Carregando clientes...</p>
            </div>
          ) : (
            <CustomersTable
              customers={customers}
              onEdit={setEditingCustomer}
              onDelete={handleDelete}
              onViewDetails={setViewingCustomer}
            />
          )}
        </div>
      </div>

      {showAddForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Novo Cliente</h2>
            <AddCustomerForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingCustomer && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditingCustomer(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Editar Cliente</h2>
            <EditCustomerForm
              customer={editingCustomer}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCustomer(null)}
            />
          </div>
        </div>
      )}

      {viewingCustomer && (
        <CustomerDetailsModal
          customer={viewingCustomer}
          onClose={() => setViewingCustomer(null)}
          onAddPoints={handleAddPoints}
          onRedeemPoints={handleRedeemPoints}
          loadPurchaseHistory={loadPurchaseHistory}
        />
      )}
    </div>
  );
}
