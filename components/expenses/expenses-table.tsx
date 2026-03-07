'use client';

import { Expense } from '@/lib/api/expenses';
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  EXPENSE_STATUS_COLORS,
} from '@/lib/utils/expense-labels';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
  onMarkAsPaid?: (expense: Expense) => void;
}

export function ExpensesTable({
  expenses,
  onEdit,
  onDelete,
  onMarkAsPaid,
}: ExpensesTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">Nenhuma despesa encontrada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descrição
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vencimento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    {expense.supplier && (
                      <p className="text-sm text-gray-500">{expense.supplier.name}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {EXPENSE_CATEGORY_LABELS[expense.category]}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatCurrency(parseFloat(expense.amount))}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(expense.expenseDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {expense.dueDate ? formatDate(expense.dueDate) : '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      EXPENSE_STATUS_COLORS[expense.status]
                    }`}
                  >
                    {EXPENSE_STATUS_LABELS[expense.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {expense.status === 'pending' && onMarkAsPaid && (
                      <button
                        onClick={() => onMarkAsPaid(expense)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Pagar
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(expense)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
