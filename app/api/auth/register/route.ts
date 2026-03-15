import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validação básica
    const errors: string[] = [];
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('email must be an email');
    }
    
    if (!password || password.length < 6) {
      errors.push('password must be longer than or equal to 6 characters');
    }
    
    if (!firstName) {
      errors.push('firstName is required');
    }
    
    if (!lastName) {
      errors.push('lastName is required');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: errors,
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    // TODO: Implementar lógica de registro no backend
    // Por enquanto, retorna mock de sucesso
    const mockUser = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      isActive: true,
    };

    const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.access.token';
    const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.refresh.token';

    return NextResponse.json(
      {
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        user: mockUser,
      },
      { status: 201 }
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
