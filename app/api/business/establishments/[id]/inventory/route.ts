import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;

    console.log('📍 Fetching inventory for establishment:', id);
    console.log('📍 Calling microservice:', `${apiUrl}/business/establishments/${id}/inventory`);

    const response = await fetch(
      `${apiUrl}/business/establishments/${id}/inventory?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

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
    console.log('✅ Inventory fetched:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching establishment inventory:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao buscar inventário do estabelecimento' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');
    const { id } = params;
    const body = await request.json();

    console.log('📍 Creating inventory item for establishment:', id);
    console.log('📍 Calling microservice:', `${apiUrl}/business/establishments/${id}/inventory`);
    console.log('📍 Body:', body);

    const response = await fetch(
      `${apiUrl}/business/establishments/${id}/inventory`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify(body),
      }
    );

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
    console.log('✅ Inventory item created:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error creating inventory item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar item de inventário' 
      },
      { status: 500 }
    );
  }
}
