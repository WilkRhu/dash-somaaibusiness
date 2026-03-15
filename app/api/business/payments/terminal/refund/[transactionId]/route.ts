import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';
import { PaymentTerminalService } from '@/lib/payment-terminal/payment-terminal-service';
import { RefundRequest } from '@/lib/types/payment-terminal';

export async function POST(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId } = params;
    const body: RefundRequest = await request.json();

    if (!body.provider) {
      return NextResponse.json(
        { message: 'Provider é obrigatório' },
        { status: 400 }
      );
    }

    const service = PaymentTerminalService.getInstance();
    const response = await service.refundPayment(auth.establishmentId, transactionId, body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro ao reembolsar pagamento:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao reembolsar pagamento' },
      { status: 500 }
    );
  }
}
