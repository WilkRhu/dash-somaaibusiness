'use client';

import { useState, useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useExpenses, useFinancialBalance } from '@/lib/hooks/use-expenses';
import { useExpensesStore } from '@/lib/stores/expenses-store';
import { ExpenseCategory, ExpenseStatus, Expense } from '@/lib/api/expenses';
import { CreateExpenseForm } from '@/components/expenses/create-expense-form';
import { EditExpenseForm } from '@/components/expenses/edit-expense-form';
import { ExpensesTable } from '@/components/expenses/expenses-table';
import { MarkAsPaidModal } from '@/components/expenses/mark-as-paid-modal';
import { FinancialBalanceCard } from '@/components/expenses/financial-balance-card';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { showToast } from '@/components/ui/toast';
import { EXPENSE_CATEGORY_LABELS } from '@/lib/utils/expense-labels';
import { suppliersApi } from '@/lib/api/suppliers';

export default function ExpensesPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const { deleteExpense } = useExpensesStore();

  const [activeTab, setActiveTab] = useState<'expenses' | 'balance'>('expenses');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Filtros
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.toISOString().split('T')[0];
  });
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | ''>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (currentEstablishment) {
        try {
          const data = await suppliersApi.list(currentEstablishment.id);
          setSuppliers(data);
        } catch (error) {
          console.error('Erro ao carregar fornecedores:', error);
        }
      }
    };

    fetchSuppliers();
  }, [currentEstablishment]);

  const { expenses, isLoading, refetch } = useExpenses(currentEstablishment?.id, {
    startDate,
    endDate,
    category: categoryFilter || undefined,
    status: statusFilter || undefined,
    supplierId: supplierFilter || undefined,
  });

  const { financialBalance, isLoading: balanceLoading } = useFinancialBalance(
    currentEstablishment?.id,
    startDate,
    endDate
  );

  const handleDelete = async () => {
    if (!selectedExpense || !currentEstablishment) return;

    try {
      await deleteExpense(currentEstablishment.id, selectedExpense.id);
      showToast('Despesa excluída com sucesso!', 'success');
      setShowDeleteModal(false);
      setSelectedExpense(null);
      refetch();
    } catch (error) {
      showToast('Erro ao excluir despesa', 'error');
    }
  };

  if (!currentEstablishment) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando estabelecimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Despesas e Balanço</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nova Despesa
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 px-4 font-medium ${
            activeTab === 'expenses'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Despesas
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          className={`pb-3 px-4 font-medium ${
            activeTab === 'balance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Balanço Financeiro
        </button>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab === 'expenses' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="overdue">Vencido</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor
                </label>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      {activeTab === 'expenses' ? (
        <div>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando despesas...</p>
            </div>
          ) : (
            <ExpensesTable
              expenses={expenses}
              onEdit={(expense) => {
                setSelectedExpense(expense);
                setShowEditModal(true);
              }}
              onMarkAsPaid={(expense) => {
                setSelectedExpense(expense);
                setShowPayModal(true);
              }}
              onDelete={(expense) => {
                setSelectedExpense(expense);
                setShowDeleteModal(true);
              }}
            />
          )}
        </div>
      ) : (
        <div>
          {balanceLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando balanço...</p>
            </div>
          ) : financialBalance ? (
            <FinancialBalanceCard balance={financialBalance} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Nenhum dado disponível para o período</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Criar Despesa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Despesa</h2>
            <CreateExpenseForm
              establishmentId={currentEstablishment.id}
              onSuccess={() => {
                setShowCreateModal(false);
                refetch();
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Editar Despesa */}
      {showEditModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Editar Despesa</h2>
            <EditExpenseForm
              expense={selectedExpense}
              establishmentId={currentEstablishment.id}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedExpense(null);
                refetch();
              }}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedExpense(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de Marcar como Paga */}
      {showPayModal && selectedExpense && (
        <MarkAsPaidModal
          expense={selectedExpense}
          establishmentId={currentEstablishment.id}
          onClose={() => {
            setShowPayModal(false);
            setSelectedExpense(null);
          }}
          onSuccess={refetch}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && selectedExpense && (
        <ConfirmModal
          title="Excluir Despesa"
          message={`Tem certeza que deseja excluir a despesa "${selectedExpense.description}"?`}
          confirmText="Excluir"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
}
