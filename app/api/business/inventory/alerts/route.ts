import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');
    const searchParams = request.nextUrl.searchParams;
    const alertType = searchParams.get('type') || 'low-stock';

    const response = await fetch(
      `${apiUrl}/business/inventory/alerts/${alertType}?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar alertas de inventário' },
      { status: 500 }
    );
  }
}
