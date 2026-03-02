'use client';

import { FinancialBalance } from '@/lib/api/expenses';
import { formatCurrency } from '@/lib/utils/format';
import {
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  EXPENSE_STATUS_LABELS,
} from '@/lib/utils/expense-labels';

interface FinancialBalanceCardProps {
  balance: FinancialBalance;
}

export function FinancialBalanceCard({ balance }: FinancialBalanceCardProps) {
  return (
    <div className="space-y-6">
      {/* Resumo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Receitas</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(balance.totalRevenue)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(balance.totalExpenses)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Lucro Líquido</p>
          <p
            className={`text-2xl font-bold ${
              balance.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(balance.netProfit)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Margem de Lucro</p>
          <p
            className={`text-2xl font-bold ${
              balance.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {balance.profitMargin.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Despesas por Categoria */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Despesas por Categoria
        </h3>
        <div className="space-y-3">
          {balance.expensesByCategory.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">
                    {EXPENSE_CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.total)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receitas por Forma de Pagamento */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Receitas por Forma de Pagamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balance.revenueByPaymentMethod.map((item) => (
            <div key={item.method} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {PAYMENT_METHOD_LABELS[item.method]}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(item.total)}
              </p>
              <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Despesas por Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {balance.expensesByStatus.map((item) => (
            <div key={item.status} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {EXPENSE_STATUS_LABELS[item.status]}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(item.total)}
              </p>
              <p className="text-sm text-gray-500">{item.count} despesas</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
