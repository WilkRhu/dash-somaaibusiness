import {
  IPaymentTerminal,
  PaymentTerminalConfig,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundRequest,
  RefundResponse,
  PaymentStatus,
} from '@/lib/types/payment-terminal';

export class MercadoPagoTerminalProvider implements IPaymentTerminal {
  private config: PaymentTerminalConfig;
  private isConnected: boolean = false;

  constructor(config: PaymentTerminalConfig) {
    this.config = config;
  }

  async setup(config: PaymentTerminalConfig): Promise<void> {
    this.config = config;
    this.isConnected = true;
    console.log('Mercado Pago terminal configurado com sucesso');
  }

  async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    if (!this.isConnected) {
      throw new Error('Terminal Mercado Pago não está conectado');
    }

    // TODO: Implementar integração com Mercado Pago API
    const mockResponse: ProcessPaymentResponse = {
      success: true,
      transactionId: `mp-${Date.now()}`,
      authorizationCode: `AUTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: PaymentStatus.APPROVED,
      amount: request.amount,
      installments: request.installments,
      timestamp: new Date(),
    };

    return mockResponse;
  }

  async refund(transactionId: string, request: RefundRequest): Promise<RefundResponse> {
    if (!this.isConnected) {
      throw new Error('Terminal Mercado Pago não está conectado');
    }

    // TODO: Implementar integração com Mercado Pago API para reembolso
    const mockResponse: RefundResponse = {
      success: true,
      transactionId: `refund-${Date.now()}`,
      status: PaymentStatus.REFUNDED,
      amount: request.amount || 0,
      message: 'Reembolso processado com sucesso',
      timestamp: new Date(),
    };

    return mockResponse;
  }

  async getStatus(): Promise<{ isOnline: boolean; lastSync: Date }> {
    return {
      isOnline: this.isConnected,
      lastSync: new Date(),
    };
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('Mercado Pago terminal desconectado');
  }
}
