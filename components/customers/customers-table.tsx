'use client';

import { useState } from 'react';
import type { Customer } from '@/lib/types/customer';
import { formatCurrency, formatCPF, formatPhone } from '@/lib/utils/format';

interface CustomersTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
}

export function CustomersTable({
  customers,
  onEdit,
  onDelete,
  onViewDetails,
}: CustomersTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Deseja realmente excluir o cliente ${customer.name}?`)) {
      return;
    }

    setDeletingId(customer.id);
    try {
      await onDelete(customer);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Nome</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Telefone</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Pontos</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Total Gasto</th>
            <th className="text-center py-3 px-4 font-medium text-gray-700">Compras</th>
            <th className="text-center py-3 px-4 font-medium text-gray-700">Última Compra</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">
                <button
                  onClick={() => onViewDetails(customer)}
                  className="font-medium text-brand-blue hover:underline text-left"
                >
                  {customer.name}
                </button>
              </td>
              <td className="py-3 px-4 text-gray-600">{formatPhone(customer.phone)}</td>
              <td className="py-3 px-4 text-gray-600">{customer.email || '-'}</td>
              <td className="py-3 px-4 text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {customer.loyaltyPoints} pts
                </span>
              </td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {formatCurrency(customer.totalSpent)}
              </td>
              <td className="py-3 px-4 text-center text-gray-600">
                {customer.purchaseCount}
              </td>
              <td className="py-3 px-4 text-center text-gray-600">
                {formatDate(customer.lastPurchaseDate)}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(customer)}
                    className="text-brand-blue hover:text-blue-700 text-sm font-medium"
                    disabled={deletingId === customer.id}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(customer)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                    disabled={deletingId === customer.id}
                  >
                    {deletingId === customer.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
