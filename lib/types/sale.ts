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

export interface Sale {
  id: string;
  establishmentId: string;
  saleNumber: string;
  customerId?: string;
  sellerId: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes?: string;
  items: SaleItem[];
  createdAt: string;
}

export interface SaleItem {
  id: string;
  inventoryItemId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateSaleDto {
  customerId?: string;
  items: {
    inventoryItemId: string;
    quantity: number;
  }[];
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}
