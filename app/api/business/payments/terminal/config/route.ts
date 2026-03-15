import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';
import { PaymentTerminalService } from '@/lib/payment-terminal/payment-terminal-service';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json(
        { message: 'Provider é obrigatório' },
        { status: 400 }
      );
    }

    const service = PaymentTerminalService.getInstance();
    const config = await service.getTerminalConfig(auth.establishmentId, provider);

    if (!config) {
      return NextResponse.json(
        { message: 'Configuração de terminal não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Erro ao obter configuração:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao obter configuração' },
      { status: 500 }
    );
  }
}
