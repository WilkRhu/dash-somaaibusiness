import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // TODO: Implementar validação do JWT token
    // Por enquanto, retorna mock de validação
    const mockUser = {
      id: crypto.randomUUID(),
      email: 'user@example.com',
    };

    return NextResponse.json(
      {
        valid: true,
        user: mockUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
