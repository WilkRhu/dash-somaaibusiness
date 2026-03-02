import { ExpenseCategory, ExpenseStatus, PaymentMethod } from '@/lib/api/expenses';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  inventory_purchase: 'Compra de Mercadorias',
  rent: 'Aluguel',
  utilities: 'Água, Luz e Gás',
  internet_phone: 'Internet e Telefone',
  salaries: 'Salários',
  taxes: 'Impostos',
  maintenance: 'Manutenção',
  marketing: 'Marketing',
  fuel: 'Combustível',
  cleaning: 'Material de Limpeza',
  office_supplies: 'Material de Escritório',
  delivery: 'Despesas com Delivery',
  equipment: 'Equipamentos',
  software: 'Software e Sistemas',
  insurance: 'Seguros',
  bank_fees: 'Taxas Bancárias',
  other: 'Outras Despesas',
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  debit_card: 'Cartão de Débito',
  credit_card: 'Cartão de Crédito',
  pix: 'PIX',
  bank_transfer: 'Transferência Bancária',
  bank_slip: 'Boleto',
  check: 'Cheque',
  other: 'Outro',
};

export const EXPENSE_STATUS_COLORS: Record<ExpenseStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};
