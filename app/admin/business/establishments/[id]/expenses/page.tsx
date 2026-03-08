'use client';

import { use, useState, useEffect } from 'react';
import { expensesApi, Expense, ExpenseStatus } from '@/lib/api/expenses';

export default function ExpensesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: establishmentId } = use(params);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [establishmentId]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expensesApi.list(establishmentId, {
        status: statusFilter || undefined,
        category: categoryFilter as any || undefined,
      });
      setExpenses(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar despesas:', err);
      setError(err.message || 'Erro ao carregar despesas');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusLabel = (status: ExpenseStatus) => {
    const labels: Record<ExpenseStatus, string> = {
      paid: 'Pago',
      pending: 'Pendente',
      overdue: 'Vencido',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: ExpenseStatus) => {
    const colors: Record<ExpenseStatus, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const categories = [...new Set(expenses.map(e => e.category))];

  const filteredExpenses = expenses.filter(expense => {
    if (statusFilter && expense.status !== statusFilter) return false;
    if (categoryFilter && expense.category !== categoryFilter) return false;
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);
  const paidExpenses = filteredExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending' || e.status === 'overdue').reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <a
          href="/admin/business/establishments"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Estabelecimentos
        </a>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
        <span className="text-sm text-gray-500">{filteredExpenses.length} despesas</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Pago</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(paidExpenses)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">Pendente/Vencido</p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(pendingExpenses)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ExpenseStatus | '')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="paid">Pago</option>
          <option value="pending">Pendente</option>
          <option value="overdue">Vencido</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma despesa encontrada</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Vencimento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{expense.description}</td>
                  <td className="py-3 px-4 text-gray-600">{expense.category}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(expense.amount)}</td>
                  <td className="py-3 px-4 text-gray-600">{expense.dueDate ? formatDate(expense.dueDate) : '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(expense.status)}`}>
                      {getStatusLabel(expense.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}