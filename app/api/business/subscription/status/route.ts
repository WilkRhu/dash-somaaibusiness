import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Adicionar verificação de autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Buscar dados reais do banco de dados
    const status = {
      currentPlan: 'free',
      isOnTrial: false,
      trialDaysRemaining: 0,
      usage: {
        establishments: 1,
        employees: 3,
        products: 45,
      },
      limits: {
        establishments: 1,
        employees: 5,
        products: 100,
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status' },
      { status: 500 }
    );
  }
}
