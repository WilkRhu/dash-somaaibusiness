import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';

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

    const { accessToken, publicKey } = await request.json();

    // Validar campos obrigatórios
    if (!accessToken || !publicKey) {
      return NextResponse.json(
        { message: 'Access Token e Public Key são obrigatórios' },
        { status: 400 }
      );
    }

    // TODO: Implementar validação das credenciais com Mercado Pago
    // const isValid = await validateMercadoPagoCredentials(accessToken, publicKey);
    // if (!isValid) {
    //   return NextResponse.json(
    //     { message: 'Invalid Mercado Pago credentials' },
    //     { status: 400 }
    //   );
    // }

    // TODO: Salvar integração no banco de dados
    // const integration = await db.mercadoPagoIntegration.create({
    //   establishmentId: auth.establishmentId,
    //   accessToken: encryptToken(accessToken),
    //   publicKey: encryptToken(publicKey),
    //   isActive: true,
    //   isVerified: true,
    // });

    // Mock response
    const integration = {
      id: 'mp-' + Math.random().toString(36).substr(2, 9),
      establishmentId: auth.establishmentId,
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(integration, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao conectar Mercado Pago:', error);
    return NextResponse.json(
      { message: 'Erro ao conectar Mercado Pago' },
      { status: 500 }
    );
  }
}
