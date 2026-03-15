import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';
import { PaymentTerminalService } from '@/lib/payment-terminal/payment-terminal-service';

export async function DELETE(request: NextRequest) {
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
    await service.disconnectTerminal(auth.establishmentId, provider);

    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.error('Erro ao desconectar terminal:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao desconectar terminal' },
      { status: 500 }
    );
  }
}
