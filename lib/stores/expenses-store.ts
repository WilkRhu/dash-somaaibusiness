import { create } from 'zustand';
import {
  Expense,
  ExpensesFilters,
  FinancialBalance,
  expensesApi,
  CreateExpenseData,
  UpdateExpenseData,
  MarkAsPaidData,
} from '@/lib/api/expenses';

interface ExpensesState {
  expenses: Expense[];
  currentExpense: Expense | null;
  financialBalance: FinancialBalance | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchExpenses: (establishmentId: string, filters?: ExpensesFilters) => Promise<void>;
  fetchExpenseById: (establishmentId: string, expenseId: string) => Promise<void>;
  createExpense: (establishmentId: string, data: CreateExpenseData) => Promise<Expense>;
  updateExpense: (
    establishmentId: string,
    expenseId: string,
    data: UpdateExpenseData
  ) => Promise<Expense>;
  markAsPaid: (
    establishmentId: string,
    expenseId: string,
    data: MarkAsPaidData
  ) => Promise<Expense>;
  deleteExpense: (establishmentId: string, expenseId: string) => Promise<void>;
  fetchFinancialBalance: (
    establishmentId: string,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  expenses: [],
  currentExpense: null,
  financialBalance: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  error: null,
};

export const useExpensesStore = create<ExpensesState>((set) => ({
  ...initialState,

  fetchExpenses: async (establishmentId, filters) => {
    set({ isLoading: true, error: null });
    try {
      const result = await expensesApi.list(establishmentId, filters);
      set({
        expenses: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao carregar despesas',
        isLoading: false,
      });
    }
  },

  fetchExpenseById: async (establishmentId, expenseId) => {
    set({ isLoading: true, error: null });
    try {
      const expense = await expensesApi.getById(establishmentId, expenseId);
      set({ currentExpense: expense, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao carregar despesa',
        isLoading: false,
      });
    }
  },

  createExpense: async (establishmentId, data) => {
    set({ isLoading: true, error: null });
    try {
      const expense = await expensesApi.create(establishmentId, data);
      set((state) => ({
        expenses: [expense, ...state.expenses],
        total: state.total + 1,
        isLoading: false,
      }));
      return expense;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao criar despesa',
        isLoading: false,
      });
      throw error;
    }
  },

  updateExpense: async (establishmentId, expenseId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await expensesApi.update(establishmentId, expenseId, data);
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === expenseId ? updated : e)),
        currentExpense: state.currentExpense?.id === expenseId ? updated : state.currentExpense,
        isLoading: false,
      }));
      return updated;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao atualizar despesa',
        isLoading: false,
      });
      throw error;
    }
  },

  markAsPaid: async (establishmentId, expenseId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await expensesApi.markAsPaid(establishmentId, expenseId, data);
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === expenseId ? updated : e)),
        currentExpense: state.currentExpense?.id === expenseId ? updated : state.currentExpense,
        isLoading: false,
      }));
      return updated;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao marcar despesa como paga',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteExpense: async (establishmentId, expenseId) => {
    set({ isLoading: true, error: null });
    try {
      await expensesApi.delete(establishmentId, expenseId);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== expenseId),
        total: state.total - 1,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao excluir despesa',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchFinancialBalance: async (establishmentId, startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const balance = await expensesApi.getFinancialBalance(establishmentId, startDate, endDate);
      set({ financialBalance: balance, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erro ao carregar balanço financeiro',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));
