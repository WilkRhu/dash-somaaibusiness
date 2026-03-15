import { PaymentProvider, IPaymentTerminal, PaymentTerminalConfig } from '@/lib/types/payment-terminal';
import { StoneTerminalProvider } from './providers/stone-provider';
import { CieloTerminalProvider } from './providers/cielo-provider';
import { RedeTerminalProvider } from './providers/rede-provider';
import { GetnetTerminalProvider } from './providers/getnet-provider';
import { MercadoPagoTerminalProvider } from './providers/mercadopago-provider';

export class PaymentTerminalFactory {
  private static providers: Map<PaymentProvider, IPaymentTerminal> = new Map();

  static createProvider(provider: PaymentProvider, config: PaymentTerminalConfig): IPaymentTerminal {
    switch (provider) {
      case PaymentProvider.STONE:
        return new StoneTerminalProvider(config);
      case PaymentProvider.CIELO:
        return new CieloTerminalProvider(config);
      case PaymentProvider.REDE:
        return new RedeTerminalProvider(config);
      case PaymentProvider.GETNET:
        return new GetnetTerminalProvider(config);
      case PaymentProvider.MERCADOPAGO:
        return new MercadoPagoTerminalProvider(config);
      default:
        throw new Error(`Provedor de pagamento não suportado: ${provider}`);
    }
  }

  static getProvider(provider: PaymentProvider): IPaymentTerminal | undefined {
    return this.providers.get(provider);
  }

  static registerProvider(provider: PaymentProvider, instance: IPaymentTerminal): void {
    this.providers.set(provider, instance);
  }

  static unregisterProvider(provider: PaymentProvider): void {
    this.providers.delete(provider);
  }

  static getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.keys());
  }

  static isProviderAvailable(provider: PaymentProvider): boolean {
    return this.providers.has(provider);
  }
}
