'use client';

import { useState } from 'react';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { AddSupplierForm } from '@/components/suppliers/add-supplier-form';
import { SuppliersTable } from '@/components/suppliers/suppliers-table';

export default function SuppliersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { searchTerm, setSearchTerm } = useSuppliers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Fornecedores</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Novo Fornecedor
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar por nome, CNPJ ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      {/* Tabela de Fornecedores */}
      <div className="bg-white rounded-lg shadow">
        <SuppliersTable />
      </div>

      {/* Modal de Adicionar Fornecedor */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-brand-navy mb-6">
                Novo Fornecedor
              </h2>
              <AddSupplierForm
                onSuccess={() => setShowAddForm(false)}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
