import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Marcar todas as notificações como lidas no banco de dados
    
    return NextResponse.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas',
    });
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    return NextResponse.json(
      { error: 'Erro ao marcar todas as notificações como lidas' },
      { status: 500 }
    );
  }
}
