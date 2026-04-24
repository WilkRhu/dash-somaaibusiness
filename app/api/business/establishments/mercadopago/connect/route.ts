import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    const response = await fetch(`${apiUrl}/api/business/establishments/mercadopago/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error connecting MercadoPago manually:', error);
    return NextResponse.json({ success: false, error: 'Erro ao conectar' }, { status: 500 });
  }
}
