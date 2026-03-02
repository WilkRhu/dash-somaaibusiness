'use client';

import { useState, useEffect } from 'react';
import { useExpensesStore } from '@/lib/stores/expenses-store';
import { CreateExpenseData, ExpenseCategory, ExpenseStatus } from '@/lib/api/expenses';
import { EXPENSE_CATEGORY_LABELS } from '@/lib/utils/expense-labels';
import { showToast } from '@/components/ui/toast';
import { suppliersApi } from '@/lib/api/suppliers';
import { Supplier } from '@/lib/types/supplier';

interface CreateExpenseFormProps {
  establishmentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateExpenseForm({
  establishmentId,
  onSuccess,
  onCancel,
}: CreateExpenseFormProps) {
  const { createExpense, isLoading } = useExpensesStore();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [formData, setFormData] = useState<CreateExpenseData>({
    description: '',
    category: 'other' as ExpenseCategory,
    amount: 0,
    status: 'pending' as ExpenseStatus,
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        const data = await suppliersApi.list(establishmentId);
        setSuppliers(data);
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, [establishmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createExpense(establishmentId, formData);
      showToast('Despesa criada com sucesso!', 'success');
      onSuccess?.();
    } catch (error) {
      showToast('Erro ao criar despesa', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as ExpenseCategory })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da Despesa *
          </label>
          <input
            type="date"
            value={formData.expenseDate}
            onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento
          </label>
          <input
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as ExpenseStatus })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fornecedor (opcional)
        </label>
        <select
          value={formData.supplierId || ''}
          onChange={(e) =>
            setFormData({ ...formData, supplierId: e.target.value || undefined })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loadingSuppliers}
        >
          <option value="">Nenhum fornecedor</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {loadingSuppliers && (
          <p className="text-xs text-gray-500 mt-1">Carregando fornecedores...</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
          Despesa recorrente
        </label>
      </div>

      {formData.isRecurring && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intervalo de Recorrência
          </label>
          <select
            value={formData.recurrenceInterval || 'monthly'}
            onChange={(e) =>
              setFormData({
                ...formData,
                recurrenceInterval: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Criando...' : 'Criar Despesa'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
