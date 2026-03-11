import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Adicionar verificação de autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = [
      {
        id: 'free',
        name: 'Gratuito',
        price: 0,
        recommended: false,
        contactSales: false,
        features: [
          '1 Estabelecimento',
          'Até 5 Funcionários',
          'Até 100 Produtos',
          'Relatórios Básicos',
          'Suporte por Email',
        ],
        limits: {
          establishments: 1,
          employees: 5,
          products: 100,
        },
      },
      {
        id: 'basic',
        name: 'Básico',
        price: 99.9,
        recommended: false,
        contactSales: false,
        features: [
          'Até 3 Estabelecimentos',
          'Até 20 Funcionários',
          'Até 500 Produtos',
          'Relatórios Avançados',
          'Suporte Prioritário',
          'Emissão de Notas Fiscais',
        ],
        limits: {
          establishments: 3,
          employees: 20,
          products: 500,
        },
      },
      {
        id: 'pro',
        name: 'Profissional',
        price: 299.9,
        recommended: true,
        contactSales: false,
        features: [
          'Até 10 Estabelecimentos',
          'Até 50 Funcionários',
          'Até 2000 Produtos',
          'Relatórios Customizados',
          'Suporte 24/7',
          'Emissão de Notas Fiscais',
          'Integração com Sistemas',
          'API Access',
        ],
        limits: {
          establishments: 10,
          employees: 50,
          products: 2000,
        },
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        recommended: false,
        contactSales: true,
        features: [
          'Estabelecimentos Ilimitados',
          'Funcionários Ilimitados',
          'Produtos Ilimitados',
          'Relatórios Customizados',
          'Suporte Dedicado',
          'Emissão de Notas Fiscais',
          'Integração com Sistemas',
          'API Access',
          'Consultoria Incluída',
        ],
        limits: {
          establishments: -1,
          employees: -1,
          products: -1,
        },
      },
    ];

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Erro ao listar planos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar planos' },
      { status: 500 }
    );
  }
}
