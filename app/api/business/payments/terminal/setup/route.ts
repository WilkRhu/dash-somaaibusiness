import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';
import { PaymentTerminalService } from '@/lib/payment-terminal/payment-terminal-service';
import { PaymentProvider } from '@/lib/types/payment-terminal';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { provider, apiKey, apiSecret, terminalId, environment } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { message: 'Provider e API Key são obrigatórios' },
        { status: 400 }
      );
    }

    if (!Object.values(PaymentProvider).includes(provider)) {
      return NextResponse.json(
        { message: 'Provedor de pagamento não suportado' },
        { status: 400 }
      );
    }

    const service = PaymentTerminalService.getInstance();
    const config = await service.setupTerminal(auth.establishmentId, provider, {
      apiKey,
      apiSecret,
      terminalId,
      environment: environment || 'sandbox',
      isActive: true,
      isVerified: true,
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao configurar terminal:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao configurar terminal' },
      { status: 500 }
    );
  }
}
