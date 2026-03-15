import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'refreshToken is required',
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    // TODO: Implementar validação do refresh token
    // Por enquanto, retorna mock de sucesso
    const mockUser = {
      id: crypto.randomUUID(),
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    };

    const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.new.access.token';
    const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.new.refresh.token';

    return NextResponse.json(
      {
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
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
