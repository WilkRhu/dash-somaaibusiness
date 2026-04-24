import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Pegar token do header Authorization enviado pelo cliente
    const authHeader = request.headers.get('Authorization');
    console.log('🔑 Auth header:', authHeader);

    const response = await fetch(`${apiUrl}/business/establishments/all`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar estabelecimentos' },
      { status: 500 }
    );
  }
}