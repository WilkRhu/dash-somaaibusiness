'use client';

import { useEffect, useState } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useCustomerStore } from '@/lib/stores/customer-store';
import { CustomerForm } from '@/components/dashboard/customer-form';
import { CustomerList } from '@/components/dashboard/customer-list';
import { Customer, CreateCustomerDto } from '@/lib/types/customer';

export default function CustomersPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

  const {
    customers,
    isLoading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearError,
  } = useCustomerStore();

  useEffect(() => {
    if (currentEstablishment?.id) {
      fetchCustomers(currentEstablishment.id);
    }
  }, [currentEstablishment?.id, fetchCustomers]);

  const handleCreate = () => {
    setEditingCustomer(undefined);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateCustomerDto) => {
    if (!currentEstablishment?.id) return;
    
    try {
      if (editingCustomer) {
        await updateCustomer(currentEstablishment.id, editingCustomer.id, data);
      } else {
        await createCustomer(currentEstablishment.id, data);
      }
      setShowForm(false);
      setEditingCustomer(undefined);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentEstablishment?.id) return;
    
    try {
      await deleteCustomer(currentEstablishment.id, id);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(undefined);
  };



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes e programa de fidelidade</p>
        </div>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Novo Cliente
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
          <span className="text-red-800">{error}</span>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : (
            <CustomerList
              customers={customers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}

      {!showForm && customers.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Total de clientes: {customers.length}
        </div>
      )}
    </div>
  );
}
