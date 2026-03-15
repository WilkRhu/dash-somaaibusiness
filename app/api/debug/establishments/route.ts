import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');

    console.log('🔍 Debug - Fetching establishments');
    console.log('API URL:', apiUrl);
    console.log('Auth Header:', authHeader ? 'Present' : 'Missing');

    const response = await fetch(`${apiUrl}/business/establishments/all`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    return NextResponse.json({
      success: true,
      debug: {
        apiUrl,
        hasAuth: !!authHeader,
        responseStatus: response.status,
      },
      data,
    });
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
