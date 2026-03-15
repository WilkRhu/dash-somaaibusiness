import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';

interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

interface PaymentPreferenceRequest {
  saleId: string;
  items: PaymentItem[];
  totalAmount: number;
  customerEmail: string;
  customerName?: string;
  externalReference?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: PaymentPreferenceRequest = await request.json();

    // Validar campos obrigatórios
    if (!body.saleId || !body.items || !body.totalAmount || !body.customerEmail) {
      return NextResponse.json(
        { message: 'Campos obrigatórios faltando' },
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

    // TODO: Criar preferência de pagamento com Mercado Pago SDK
    // const mercadopago = new MercadoPago(decryptToken(integration.accessToken));
    // const preference = await mercadopago.preferences.create({
    //   items: body.items,
    //   payer: {
    //     email: body.customerEmail,
    //     name: body.customerName,
    //   },
    //   external_reference: body.externalReference || body.saleId,
    //   back_urls: {
    //     success: `${process.env.NEXT_PUBLIC_APP_URL}/sales/payment-success`,
    //     failure: `${process.env.NEXT_PUBLIC_APP_URL}/sales/payment-failure`,
    //     pending: `${process.env.NEXT_PUBLIC_APP_URL}/sales/payment-pending`,
    //   },
    //   auto_return: 'approved',
    // });

    // Mock response
    const preferenceId = 'pref-' + Math.random().toString(36).substr(2, 9);
    const initPoint = `https://www.mercadopago.com.br/checkout/v1/${preferenceId}`;
    const sandboxInitPoint = `https://sandbox.mercadopago.com.br/checkout/v1/${preferenceId}`;

    return NextResponse.json(
      {
        preferenceId,
        initPoint,
        sandboxInitPoint,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erro ao criar preferência de pagamento:', error);
    return NextResponse.json(
      { message: 'Erro ao criar preferência de pagamento' },
      { status: 500 }
    );
  }
}
