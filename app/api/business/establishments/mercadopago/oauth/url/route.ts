import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');

    const response = await fetch(`${apiUrl}/api/business/establishments/mercadopago/oauth/url`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching MercadoPago OAuth URL:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar URL de autorização' },
      { status: 500 }
    );
  }
}
