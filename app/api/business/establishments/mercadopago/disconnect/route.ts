import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-auth';

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Deletar integração do banco de dados
    // await db.mercadoPagoIntegration.deleteMany({
    //   where: {
    //     establishmentId: auth.establishmentId,
    //   },
    // });

    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.error('Erro ao desconectar Mercado Pago:', error);
    return NextResponse.json(
      { message: 'Erro ao desconectar Mercado Pago' },
      { status: 500 }
    );
  }
}
