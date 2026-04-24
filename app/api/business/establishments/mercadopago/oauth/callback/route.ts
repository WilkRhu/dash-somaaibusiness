import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    if (!code) {
      return NextResponse.redirect(
        `${appUrl}/establishments/integrations/mercadopago?mp_status=error`
      );
    }

    // Repassa o callback para o backend
    const response = await fetch(
      `${apiUrl}/business/establishments/mercadopago/oauth/callback?code=${code}&state=${state ?? ''}`,
      { redirect: 'manual' }
    );

    // Backend redireciona para APP_URL/settings/payments?mp_status=...
    // Nós interceptamos e mandamos para a página correta
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location') || '';
      const status = location.includes('mp_status=success') ? 'success' : 'error';
      return NextResponse.redirect(
        `${appUrl}/establishments/integrations/mercadopago?mp_status=${status}`
      );
    }

    // Se o backend retornou JSON em vez de redirect
    if (response.ok) {
      return NextResponse.redirect(
        `${appUrl}/establishments/integrations/mercadopago?mp_status=success`
      );
    }

    return NextResponse.redirect(
      `${appUrl}/establishments/integrations/mercadopago?mp_status=error`
    );
  } catch (error) {
    console.error('MercadoPago OAuth callback error:', error);
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${appUrl}/establishments/integrations/mercadopago?mp_status=error`
    );
  }
}
