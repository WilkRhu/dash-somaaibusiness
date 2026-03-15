import {
  PaymentProvider,
  PaymentTerminalConfig,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundRequest,
  RefundResponse,
} from '@/lib/types/payment-terminal';
import { PaymentTerminalFactory } from './payment-terminal-factory';

export class PaymentTerminalService {
  private static instance: PaymentTerminalService;
  private configs: Map<string, PaymentTerminalConfig> = new Map();

  private constructor() {}

  static getInstance(): PaymentTerminalService {
    if (!PaymentTerminalService.instance) {
      PaymentTerminalService.instance = new PaymentTerminalService();
    }
    return PaymentTerminalService.instance;
  }

  async setupTerminal(
    establishmentId: string,
    provider: PaymentProvider,
    config: Omit<PaymentTerminalConfig, 'id' | 'establishmentId' | 'provider' | 'createdAt' | 'updatedAt'>
  ): Promise<PaymentTerminalConfig> {
    try {
      const terminalConfig: PaymentTerminalConfig = {
        id: `${provider}-${Date.now()}`,
        establishmentId,
        provider,
        apiKey: config.apiKey,
        apiSecret: config.apiSecret,
        terminalId: config.terminalId,
        isActive: true,
        isVerified: true,
        environment: config.environment || 'sandbox',
        terminalInfo: {
          isOnline: true,
          lastSync: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // TODO: Salvar no banco de dados
      // await db.paymentTerminalConfig.create(terminalConfig);

      // Criar e registrar provedor
      const providerInstance = PaymentTerminalFactory.createProvider(provider, terminalConfig);
      await providerInstance.setup(terminalConfig);
      PaymentTerminalFactory.registerProvider(provider, providerInstance);

      // Armazenar em cache
      this.configs.set(`${establishmentId}-${provider}`, terminalConfig);

      return terminalConfig;
    } catch (error) {
      console.error(`Erro ao configurar terminal ${provider}:`, error);
      throw error;
    }
  }

  async getTerminalConfig(
    establishmentId: string,
    provider: PaymentProvider
  ): Promise<PaymentTerminalConfig | null> {
    try {
      const cacheKey = `${establishmentId}-${provider}`;

      // Verificar cache
      if (this.configs.has(cacheKey)) {
        return this.configs.get(cacheKey) || null;
      }

      // TODO: Buscar do banco de dados
      // const config = await db.paymentTerminalConfig.findFirst({
      //   where: {
      //     establishmentId,
      //     provider,
      //     isActive: true,
      //   },
      // });

      // Mock
      return null;
    } catch (error) {
      console.error(`Erro ao obter configuração do terminal ${provider}:`, error);
      throw error;
    }
  }

  async processPayment(
    establishmentId: string,
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> {
    try {
      const config = await this.getTerminalConfig(establishmentId, request.provider);

      if (!config) {
        throw new Error(`Terminal ${request.provider} não configurado`);
      }

      if (!config.isActive) {
        throw new Error(`Terminal ${request.provider} não está ativo`);
      }

      const provider = PaymentTerminalFactory.getProvider(request.provider);

      if (!provider) {
        throw new Error(`Provedor ${request.provider} não disponível`);
      }

      const response = await provider.processPayment(request);

      // TODO: Salvar transação no banco de dados
      // await db.paymentTransaction.create({
      //   establishmentId,
      //   provider: request.provider,
      //   transactionId: response.transactionId,
      //   authorizationCode: response.authorizationCode,
      //   status: response.status,
      //   amount: request.amount,
      //   installments: request.installments,
      //   description: request.description,
      //   orderId: request.orderId,
      //   customerEmail: request.customerEmail,
      //   customerPhone: request.customerPhone,
      // });

      return response;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  async refundPayment(
    establishmentId: string,
    transactionId: string,
    request: RefundRequest
  ): Promise<RefundResponse> {
    try {
      const config = await this.getTerminalConfig(establishmentId, request.provider);

      if (!config) {
        throw new Error(`Terminal ${request.provider} não configurado`);
      }

      const provider = PaymentTerminalFactory.getProvider(request.provider);

      if (!provider) {
        throw new Error(`Provedor ${request.provider} não disponível`);
      }

      const response = await provider.refund(transactionId, request);

      // TODO: Salvar reembolso no banco de dados
      // await db.paymentRefund.create({
      //   establishmentId,
      //   originalTransactionId: transactionId,
      //   refundTransactionId: response.transactionId,
      //   status: response.status,
      //   amount: response.amount,
      //   reason: request.reason,
      // });

      return response;
    } catch (error) {
      console.error('Erro ao reembolsar pagamento:', error);
      throw error;
    }
  }

  async getTerminalStatus(
    establishmentId: string,
    provider: PaymentProvider
  ): Promise<{ isOnline: boolean; lastSync: Date }> {
    try {
      const providerInstance = PaymentTerminalFactory.getProvider(provider);

      if (!providerInstance) {
        throw new Error(`Provedor ${provider} não disponível`);
      }

      return await providerInstance.getStatus();
    } catch (error) {
      console.error(`Erro ao obter status do terminal ${provider}:`, error);
      return {
        isOnline: false,
        lastSync: new Date(),
      };
    }
  }

  async disconnectTerminal(
    establishmentId: string,
    provider: PaymentProvider
  ): Promise<void> {
    try {
      const providerInstance = PaymentTerminalFactory.getProvider(provider);

      if (providerInstance) {
        await providerInstance.disconnect();
      }

      PaymentTerminalFactory.unregisterProvider(provider);

      const cacheKey = `${establishmentId}-${provider}`;
      this.configs.delete(cacheKey);

      // TODO: Desativar no banco de dados
      // await db.paymentTerminalConfig.update(
      //   { where: { establishmentId, provider } },
      //   { isActive: false }
      // );
    } catch (error) {
      console.error(`Erro ao desconectar terminal ${provider}:`, error);
      throw error;
    }
  }

  async listAvailableProviders(): Promise<PaymentProvider[]> {
    return Object.values(PaymentProvider);
  }

  async getActiveProviders(establishmentId: string): Promise<PaymentProvider[]> {
    try {
      // TODO: Buscar do banco de dados
      // const configs = await db.paymentTerminalConfig.findMany({
      //   where: {
      //     establishmentId,
      //     isActive: true,
      //   },
      // });

      // return configs.map(c => c.provider);

      return [];
    } catch (error) {
      console.error('Erro ao listar provedores ativos:', error);
      return [];
    }
  }
}
