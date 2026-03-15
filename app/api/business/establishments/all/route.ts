import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Pegar token do header Authorization enviado pelo cliente
    const authHeader = request.headers.get('Authorization');
    console.log('🔑 Auth header:', authHeader);
    console.log('📍 Calling microservice:', `${apiUrl}/business/establishments/all`);

    const response = await fetch(`${apiUrl}/business/establishments/all`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      console.error('❌ Microservice error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error response:', errorData);
      return NextResponse.json(
        { success: false, error: `Microservice error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Establishments fetched:', data);
    
    // Retornar no formato esperado pelo frontend: { success: true, data: [...] }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error fetching establishments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao buscar estabelecimentos' 
      },
      { status: 500 }
    );
  }
}