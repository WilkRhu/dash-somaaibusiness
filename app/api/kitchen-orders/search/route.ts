import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'orderNumber é obrigatório' },
        { status: 400 }
      );
    }

    // Aqui você faria uma chamada ao seu backend para buscar o pedido
    // Por enquanto, retornamos um erro indicando que precisa ser implementado
    // no seu backend

    // Exemplo de como seria:
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kitchen-orders/search?orderNumber=${orderNumber}`);
    // const data = await response.json();
    // return NextResponse.json(data);

    return NextResponse.json(
      { error: 'Endpoint não implementado no backend' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}
