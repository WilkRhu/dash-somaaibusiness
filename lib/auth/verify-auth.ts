import { NextRequest } from 'next/server';

export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Aqui você pode adicionar lógica de verificação do token
    // Por enquanto, apenas verifica se o token existe
    if (!token) {
      return null;
    }

    return {
      token,
      authenticated: true,
    };
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
}
