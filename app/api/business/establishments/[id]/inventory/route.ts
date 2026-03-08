import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: establishmentId } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');

    const response = await fetch(`${apiUrl}/business/establishments/${establishmentId}/inventory`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar inventário' },
      { status: 500 }
    );
  }
}