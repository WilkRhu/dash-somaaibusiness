import { useEffect } from 'react';
import { useExpensesStore } from '@/lib/stores/expenses-store';
import { ExpensesFilters } from '@/lib/api/expenses';

export function useExpenses(establishmentId: string | undefined, filters?: ExpensesFilters) {
  const {
    expenses,
    total,
    page,
    limit,
    isLoading,
    error,
    fetchExpenses,
    clearError,
  } = useExpensesStore();

  useEffect(() => {
    if (establishmentId) {
      fetchExpenses(establishmentId, filters);
    }
  }, [establishmentId, filters?.startDate, filters?.endDate, filters?.category, filters?.status, filters?.page]);

  return {
    expenses,
    total,
    page,
    limit,
    isLoading,
    error,
    refetch: () => establishmentId && fetchExpenses(establishmentId, filters),
    clearError,
  };
}

export function useFinancialBalance(
  establishmentId: string | undefined,
  startDate: string,
  endDate: string
) {
  const { financialBalance, isLoading, error, fetchFinancialBalance } = useExpensesStore();

  useEffect(() => {
    if (establishmentId && startDate && endDate) {
      fetchFinancialBalance(establishmentId, startDate, endDate);
    }
  }, [establishmentId, startDate, endDate]);

  return {
    financialBalance,
    isLoading,
    error,
    refetch: () =>
      establishmentId && fetchFinancialBalance(establishmentId, startDate, endDate),
  };
}
