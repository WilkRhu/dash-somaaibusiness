'use client';

import { useState } from 'react';
import { useExpensesStore } from '@/lib/stores/expenses-store';
import { Expense, PaymentMethod } from '@/lib/api/expenses';
import { PAYMENT_METHOD_LABELS } from '@/lib/utils/expense-labels';
import { showToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/utils/format';

interface MarkAsPaidModalProps {
  expense: Expense;
  establishmentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MarkAsPaidModal({
  expense,
  establishmentId,
  onClose,
  onSuccess,
}: MarkAsPaidModalProps) {
  const { markAsPaid, isLoading } = useExpensesStore();
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await markAsPaid(establishmentId, expense.id, {
        paymentDate,
        paymentMethod,
      });
      showToast('Despesa marcada como paga!', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      showToast('Erro ao marcar despesa como paga', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Marcar como Paga</h2>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Despesa</p>
          <p className="font-medium text-gray-900">{expense.description}</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            {formatCurrency(parseFloat(expense.amount))}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do Pagamento *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forma de Pagamento *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
