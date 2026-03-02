import apiClient from './client';

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: string;
  status: ExpenseStatus;
  expenseDate: string;
  dueDate?: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  isRecurring: boolean;
  recurrenceInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  supplierId?: string;
  supplier?: {
    id: string;
    name: string;
  };
  creator?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'inventory_purchase'
  | 'rent'
  | 'utilities'
  | 'internet_phone'
  | 'salaries'
  | 'taxes'
  | 'maintenance'
  | 'marketing'
  | 'fuel'
  | 'cleaning'
  | 'office_supplies'
  | 'delivery'
  | 'equipment'
  | 'software'
  | 'insurance'
  | 'bank_fees'
  | 'other';

export type ExpenseStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod =
  | 'cash'
  | 'debit_card'
  | 'credit_card'
  | 'pix'
  | 'bank_transfer'
  | 'bank_slip'
  | 'check'
  | 'other';

export interface CreateExpenseData {
  description: string;
  category: ExpenseCategory;
  amount: number;
  status: ExpenseStatus;
  expenseDate: string;
  dueDate?: string;
  isRecurring?: boolean;
  recurrenceInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  supplierId?: string;
}

export interface UpdateExpenseData {
  description?: string;
  category?: ExpenseCategory;
  amount?: number;
  status?: ExpenseStatus;
  expenseDate?: string;
  dueDate?: string;
  notes?: string;
  supplierId?: string;
}

export interface MarkAsPaidData {
  paymentDate: string;
  paymentMethod: PaymentMethod;
}

export interface ExpensesFilters {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  status?: ExpenseStatus;
  supplierId?: string;
  page?: number;
  limit?: number;
}

export interface FinancialBalance {
  period: {
    startDate: string;
    endDate: string;
  };
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  expensesByCategory: Array<{
    category: ExpenseCategory;
    categoryLabel: string;
    total: number;
    percentage: number;
  }>;
  revenueByPaymentMethod: Array<{
    method: PaymentMethod;
    total: number;
    percentage: number;
  }>;
  expensesByStatus: Array<{
    status: ExpenseStatus;
    total: number;
    count: number;
  }>;
  dailyCashFlow: Array<{
    date: string;
    revenue: number;
    expenses: number;
    balance: number;
  }>;
}

export const expensesApi = {
  async create(establishmentId: string, data: CreateExpenseData): Promise<Expense> {
    const response = await apiClient.post(
      `/business/establishments/${establishmentId}/expenses`,
      data
    );
    return response.data.data;
  },

  async list(
    establishmentId: string,
    filters?: ExpensesFilters
  ): Promise<{ data: Expense[]; total: number; page: number; limit: number }> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(
      `/business/establishments/${establishmentId}/expenses?${params.toString()}`
    );
    return response.data;
  },

  async getById(establishmentId: string, expenseId: string): Promise<Expense> {
    const response = await apiClient.get(
      `/business/establishments/${establishmentId}/expenses/${expenseId}`
    );
    return response.data.data;
  },

  async update(
    establishmentId: string,
    expenseId: string,
    data: UpdateExpenseData
  ): Promise<Expense> {
    const response = await apiClient.patch(
      `/business/establishments/${establishmentId}/expenses/${expenseId}`,
      data
    );
    return response.data.data;
  },

  async markAsPaid(
    establishmentId: string,
    expenseId: string,
    data: MarkAsPaidData
  ): Promise<Expense> {
    const response = await apiClient.patch(
      `/business/establishments/${establishmentId}/expenses/${expenseId}/mark-as-paid`,
      data
    );
    return response.data.data;
  },

  async delete(establishmentId: string, expenseId: string): Promise<void> {
    await apiClient.delete(
      `/business/establishments/${establishmentId}/expenses/${expenseId}`
    );
  },

  async getFinancialBalance(
    establishmentId: string,
    startDate: string,
    endDate: string
  ): Promise<FinancialBalance> {
    const response = await apiClient.get(
      `/business/establishments/${establishmentId}/expenses/financial-balance?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.data;
  },
};
