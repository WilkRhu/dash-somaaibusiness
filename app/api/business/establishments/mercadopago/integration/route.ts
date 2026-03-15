import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Buscar integração do banco de dados
    // const integration = await db.mercadoPagoIntegration.findFirst({
    //   where: {
    //     establishmentId: auth.establishmentId,
    //     isActive: true,
    //   },
    // });

    // if (!integration) {
    //   return NextResponse.json(
    //     { message: 'Mercado Pago integration not found for this establishment' },
    //     { status: 404 }
    //   );
    // }

    // Mock response
    const integration = {
      id: 'mp-123456789',
      establishmentId: auth.establishmentId,
      isActive: true,
      isVerified: true,
      merchantName: 'Minha Loja',
      merchantEmail: 'loja@email.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(integration);
  } catch (error: any) {
    console.error('Erro ao buscar integração:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar integração' },
      { status: 500 }
    );
  }
}
