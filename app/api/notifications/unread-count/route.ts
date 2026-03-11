import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Contar notificações não lidas do usuário
    const count = 0;

    return NextResponse.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('Erro ao contar notificações não lidas:', error);
    return NextResponse.json(
      { error: 'Erro ao contar notificações não lidas' },
      { status: 500 }
    );
  }
}
