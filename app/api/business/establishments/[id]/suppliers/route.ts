import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: establishmentId } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');

    const response = await fetch(`${apiUrl}/business/establishments/${establishmentId}/suppliers`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar fornecedores' },
      { status: 500 }
    );
  }
}