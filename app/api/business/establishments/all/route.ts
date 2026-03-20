import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Log simples
    console.log('\n🔍 GET /api/business/establishments/all');
    console.log('Headers recebidos:');
    
    const authHeader = request.headers.get('Authorization');
    console.log('  Authorization:', authHeader ? '✅ SIM' : '❌ NÃO');
    
    if (authHeader) {
      console.log('  Valor:', authHeader.substring(0, 50) + '...');
    }
    
    // Listar todos os headers
    const headersList: string[] = [];
    request.headers.forEach((value, key) => {
      headersList.push(`  ${key}: ${value.substring(0, 40)}...`);
    });
    console.log('Todos os headers:');
    headersList.forEach(h => console.log(h));

    if (!authHeader) {
      console.log('❌ Authorization header não encontrado!');
      return NextResponse.json(
        { success: false, error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const response = await fetch(`${apiUrl}/business/establishments/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
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