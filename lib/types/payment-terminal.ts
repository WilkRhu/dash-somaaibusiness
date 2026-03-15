// Tipos para integração de terminal de pagamento

export enum PaymentProvider {
  STONE = 'stone',
  CIELO = 'cielo',
  REDE = 'rede',
  GETNET = 'getnet',
  MERCADOPAGO = 'mercadopago',
}

export enum PaymentStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface PaymentTerminalConfig {
  id: string;
  establishmentId: string;
  provider: PaymentProvider;
  apiKey: string;
  apiSecret?: string;
  terminalId?: string;
  isActive: boolean;
  isVerified: boolean;
  environment: 'sandbox' | 'production';
  terminalInfo?: {
    isOnline: boolean;
    lastSync: Date;
    model?: string;
    serialNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransaction {
  id: string;
  establishmentId: string;
  provider: PaymentProvider;
  transactionId: string;
  authorizationCode: string;
  status: PaymentStatus;
  amount: number;
  installments: number;
  description: string;
  orderId: string;
  customerEmail?: string;
  customerPhone?: string;
  cardBrand?: string;
  cardLastDigits?: string;
  error?: {
    code: string;
    message: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessPaymentRequest {
  amount: number;
  installments: number;
  description: string;
  orderId: string;
  customerEmail?: string;
  customerPhone?: string;
  provider: PaymentProvider;
  cardData?: {
    number: string;
    holder: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  };
}

export interface ProcessPaymentResponse {
  success: boolean;
  transactionId: string;
  authorizationCode: string;
  status: PaymentStatus;
  amount: number;
  installments: number;
  timestamp: Date;
  error?: {
    code: string;
    message: string;
  };
}

export interface RefundRequest {
  amount?: number;
  provider: PaymentProvider;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  message: string;
  timestamp: Date;
}

export interface IPaymentTerminal {
  setup(config: PaymentTerminalConfig): Promise<void>;
  processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse>;
  refund(transactionId: string, request: RefundRequest): Promise<RefundResponse>;
  getStatus(): Promise<{ isOnline: boolean; lastSync: Date }>;
  disconnect(): Promise<void>;
}
