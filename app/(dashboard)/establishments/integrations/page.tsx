'use client';

import Link from 'next/link';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  href: string;
  status: 'available' | 'coming_soon';
}

const integrations: Integration[] = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Aceite pagamentos via PIX, cartão de crédito e débito diretamente na conta do seu estabelecimento.',
    href: '/establishments/integrations/mercadopago',
    status: 'available',
    logo: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="24" fill="#009EE3" />
        <path
          d="M10 24c0-7.732 6.268-14 14-14s14 6.268 14 14"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="28" r="4" fill="#fff" />
      </svg>
    ),
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
        <p className="text-gray-500 mt-1">Conecte seu estabelecimento a serviços externos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              {integration.logo}
              <div>
                <p className="font-semibold text-gray-900">{integration.name}</p>
                {integration.status === 'coming_soon' && (
                  <span className="text-xs text-orange-500 font-medium">Em breve</span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 flex-1">{integration.description}</p>

            {integration.status === 'available' ? (
              <Link
                href={integration.href}
                className="text-center text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 transition-colors"
              >
                Configurar
              </Link>
            ) : (
              <button
                disabled
                className="text-center text-sm font-medium text-gray-400 bg-gray-100 rounded-lg px-4 py-2 cursor-not-allowed"
              >
                Em breve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
