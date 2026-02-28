export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
}

export enum SaleStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export interface SaleItem {
  id: string;
  saleId: string;
  itemId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  subtotal: number;
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
}

export interface Establishment {
  id: string;
  name: string;
  cnpj: string;
  address?: string;
  phone?: string;
}

export interface Sale {
  id: string;
  establishmentId: string;
  saleNumber: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  customerId: string | null;
  sellerId: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  seller?: Seller;
  establishment?: Establishment;
}

export interface CreateSaleItemDto {
  itemId: string;
  unitPrice: number;
  quantity: number;
  discount?: number;
}

export interface CreateSaleDto {
  items: CreateSaleItemDto[];
  paymentMethod: PaymentMethod;
  customerId?: string;
  discount?: number;
  notes?: string;
}

export interface SalesFilters {
  startDate?: string;
  endDate?: string;
  status?: SaleStatus;
  page?: number;
  limit?: number;
}

export interface SalesListResponse {
  data: Sale[];
  total: number;
  page: number;
  limit: number;
}
