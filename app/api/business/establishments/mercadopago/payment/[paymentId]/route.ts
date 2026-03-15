import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    // Verificar autenticação
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { paymentId } = params;

    if (!paymentId) {
      return NextResponse.json(
        { message: 'Payment ID é obrigatório' },
        { status: 400 }
      );
    }

    // TODO: Buscar integração do Mercado Pago
    // const integration = await db.mercadoPagoIntegration.findFirst({
    //   where: {
    //     establishmentId: auth.establishmentId,
    //     isActive: true,
    //   },
    // });

    // if (!integration) {
    //   return NextResponse.json(
    //     { message: 'Active Mercado Pago integration not found for this establishment' },
    //     { status: 404 }
    //   );
    // }

    // TODO: Buscar informações de pagamento com Mercado Pago SDK
    // const mercadopago = new MercadoPago(decryptToken(integration.accessToken));
    // const payment = await mercadopago.payment.findById(paymentId);

    // Mock response
    const payment = {
      id: paymentId,
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 100.0,
      currency_id: 'BRL',
      payer: {
        email: 'customer@email.com',
      },
      external_reference: 'sale-uuid',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error('Erro ao buscar pagamento:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar pagamento' },
      { status: 500 }
    );
  }
}
