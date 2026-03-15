import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';
import { PaymentTerminalService } from '@/lib/payment-terminal/payment-terminal-service';
import { ProcessPaymentRequest } from '@/lib/types/payment-terminal';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body: ProcessPaymentRequest = await request.json();

    if (!body.provider || !body.amount || !body.orderId) {
      return NextResponse.json(
        { message: 'Provider, amount e orderId são obrigatórios' },
        { status: 400 }
      );
    }

    const service = PaymentTerminalService.getInstance();
    const response = await service.processPayment(auth.establishmentId, body);

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
