'use client';

import { Customer } from '@/lib/types/customer';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">Telefone</th>
            <th className="text-left p-3 font-medium">Email</th>
            <th className="text-right p-3 font-medium">Pontos</th>
            <th className="text-right p-3 font-medium">Total Gasto</th>
            <th className="text-right p-3 font-medium">Compras</th>
            <th className="text-left p-3 font-medium">Última Compra</th>
            <th className="text-right p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-8 text-gray-500">
                Nenhum cliente cadastrado
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3">{customer.email || '-'}</td>
                <td className="p-3 text-right">{customer.loyaltyPoints}</td>
                <td className="p-3 text-right">{formatCurrency(customer.totalSpent)}</td>
                <td className="p-3 text-right">{customer.purchaseCount}</td>
                <td className="p-3">{formatDate(customer.lastPurchaseDate)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onEdit(customer)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja realmente excluir este cliente?')) {
                        onDelete(customer.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
